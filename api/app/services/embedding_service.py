import json
import numpy as np
import requests
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.idea import Idea, Embedding
import logging

logger = logging.getLogger(__name__)

class OllamaEmbeddingService:
    def __init__(self, model_name: str = "all-minilm", base_url: str = "http://localhost:11434"):
        self.model_name = model_name
        self.base_url = base_url
        self.embedding_dimension = 384  # Dimension for all-MiniLM-L6-v2
        
    def _call_ollama_api(self, text: str) -> Optional[List[float]]:
        """Call Ollama API to generate embeddings"""
        try:
            url = f"{self.base_url}/api/embeddings"
            payload = {
                "model": self.model_name,
                "prompt": text
            }
            
            response = requests.post(url, json=payload, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            if "embedding" in data:
                return data["embedding"]
            else:
                logger.error(f"Unexpected response format from Ollama: {data}")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to call Ollama API: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error in embedding generation: {e}")
            return None
    
    def generate_embedding(self, text: str) -> Optional[List[float]]:
        """Generate embedding for given text"""
        if not text or not text.strip():
            return None
            
        # Clean and prepare text
        cleaned_text = text.strip()
        
        # Generate embedding
        embedding = self._call_ollama_api(cleaned_text)
        
        if embedding:
            # Normalize the embedding
            embedding_array = np.array(embedding)
            normalized_embedding = embedding_array / np.linalg.norm(embedding_array)
            return normalized_embedding.tolist()
        
        return None
    
    def calculate_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """Calculate cosine similarity between two embeddings"""
        try:
            vec1 = np.array(embedding1)
            vec2 = np.array(embedding2)
            
            # Calculate cosine similarity
            dot_product = np.dot(vec1, vec2)
            norm1 = np.linalg.norm(vec1)
            norm2 = np.linalg.norm(vec2)
            
            if norm1 == 0 or norm2 == 0:
                return 0.0
                
            similarity = dot_product / (norm1 * norm2)
            return float(similarity)
            
        except Exception as e:
            logger.error(f"Error calculating similarity: {e}")
            return 0.0
    
    def get_idea_text_for_embedding(self, idea: Idea) -> str:
        """Extract and combine text from idea for embedding generation"""
        text_parts = []
        
        if idea.title:
            text_parts.append(idea.title)
        
        if idea.description:
            text_parts.append(idea.description)
            
        if idea.content:
            text_parts.append(idea.content)
            
        # Add tags as context
        if idea.tags:
            tag_names = [tag.name for tag in idea.tags]
            text_parts.append(f"Tags: {', '.join(tag_names)}")
            
        # Add category as context
        if idea.category:
            text_parts.append(f"Category: {idea.category}")
            
        return " | ".join(text_parts)
    
    def update_idea_embedding(self, db: Session, idea: Idea) -> bool:
        """Generate and store embedding for an idea"""
        try:
            # Get text for embedding
            idea_text = self.get_idea_text_for_embedding(idea)
            
            if not idea_text:
                logger.warning(f"No text content found for idea {idea.id}")
                return False
            
            # Generate embedding
            embedding_vector = self.generate_embedding(idea_text)
            
            if not embedding_vector:
                logger.error(f"Failed to generate embedding for idea {idea.id}")
                return False
            
            # Store in database
            db_embedding = db.query(Embedding).filter(Embedding.idea_id == idea.id).first()
            
            if db_embedding:
                # Update existing embedding
                db_embedding.embedding = json.dumps(embedding_vector)
            else:
                # Create new embedding
                db_embedding = Embedding(
                    idea_id=idea.id,
                    embedding=json.dumps(embedding_vector)
                )
                db.add(db_embedding)
            
            db.commit()
            logger.info(f"Successfully updated embedding for idea {idea.id}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating embedding for idea {idea.id}: {e}")
            db.rollback()
            return False
    
    def get_similar_ideas(self, db: Session, idea_id: int, limit: int = 5, min_similarity: float = 0.3) -> List[dict]:
        """Find similar ideas based on embedding similarity"""
        try:
            # Get the target idea and its embedding
            target_idea = db.query(Idea).filter(Idea.id == idea_id).first()
            if not target_idea:
                return []
            
            target_embedding = db.query(Embedding).filter(Embedding.idea_id == idea_id).first()
            if not target_embedding:
                # Generate embedding if it doesn't exist
                if not self.update_idea_embedding(db, target_idea):
                    return []
                target_embedding = db.query(Embedding).filter(Embedding.idea_id == idea_id).first()
            
            target_vector = json.loads(target_embedding.embedding)
            
            # Get all other ideas with embeddings
            other_embeddings = db.query(Embedding).filter(Embedding.idea_id != idea_id).all()
            
            similarities = []
            for emb in other_embeddings:
                try:
                    other_vector = json.loads(emb.embedding)
                    similarity = self.calculate_similarity(target_vector, other_vector)
                    
                    if similarity >= min_similarity:
                        # Get the idea details
                        other_idea = db.query(Idea).filter(Idea.id == emb.idea_id).first()
                        if other_idea:
                            similarities.append({
                                "idea_id": other_idea.id,
                                "similarity": similarity,
                                "title": other_idea.title,
                                "description": other_idea.description,
                                "category": other_idea.category,
                                "status": other_idea.status
                            })
                except Exception as e:
                    logger.error(f"Error calculating similarity for idea {emb.idea_id}: {e}")
                    continue
            
            # Sort by similarity and return top results
            similarities.sort(key=lambda x: x["similarity"], reverse=True)
            return similarities[:limit]
            
        except Exception as e:
            logger.error(f"Error getting similar ideas: {e}")
            return []
    
    def update_all_embeddings(self, db: Session) -> dict:
        """Update embeddings for all ideas"""
        try:
            ideas = db.query(Idea).all()
            success_count = 0
            error_count = 0
            
            for idea in ideas:
                if self.update_idea_embedding(db, idea):
                    success_count += 1
                else:
                    error_count += 1
            
            return {
                "success": True,
                "total_ideas": len(ideas),
                "successful_updates": success_count,
                "failed_updates": error_count
            }
            
        except Exception as e:
            logger.error(f"Error updating all embeddings: {e}")
            return {
                "success": False,
                "error": str(e)
            }

# Global instance
embedding_service = OllamaEmbeddingService() 