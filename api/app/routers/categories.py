from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.idea import Idea as IdeaModel, Tag as TagModel
from app.services.embedding_service import embedding_service
from typing import List

router = APIRouter()

@router.get("/categories")
async def get_categories(db: Session = Depends(get_db)):
    """Get all available categories"""
    # Get unique categories from ideas
    categories = db.query(IdeaModel.category).filter(
        IdeaModel.category.isnot(None)
    ).distinct().all()
    
    category_list = [cat[0] for cat in categories if cat[0]]
    
    return {
        "success": True,
        "data": category_list
    }

@router.get("/tags")
async def get_tags(db: Session = Depends(get_db)):
    """Get all available tags"""
    tags = db.query(TagModel).all()
    
    return {
        "success": True,
        "data": [{"id": tag.id, "name": tag.name} for tag in tags]
    }

@router.post("/embeddings/update-all")
async def update_all_embeddings(db: Session = Depends(get_db)):
    """Update all embeddings using local Ollama model"""
    try:
        result = embedding_service.update_all_embeddings(db)
        return result
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to update embeddings: {str(e)}"
        } 