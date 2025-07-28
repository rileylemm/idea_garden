import OpenAI from 'openai';
import { db, runQuery, runSingleQuery } from '../database';

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export interface EmbeddingResult {
  idea_id: number;
  similarity: number;
  title: string;
  description?: string;
  category?: string;
  status: string;
}

export class EmbeddingService {
  // Generate embedding for a text using OpenAI
  async generateEmbedding(text: string): Promise<number[]> {
    if (!openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  // Calculate cosine similarity between two vectors
  calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  // Store embedding for an idea
  async storeEmbedding(ideaId: number, embedding: number[]): Promise<void> {
    const embeddingJson = JSON.stringify(embedding);
    
    try {
      await runSingleQuery(
        'INSERT OR REPLACE INTO embeddings (idea_id, embedding, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
        [ideaId, embeddingJson]
      );
    } catch (error) {
      console.error('Error storing embedding:', error);
      throw new Error('Failed to store embedding');
    }
  }

  // Get embedding for an idea
  async getEmbedding(ideaId: number): Promise<number[] | null> {
    try {
      const result = await runQuery(
        'SELECT embedding FROM embeddings WHERE idea_id = ?',
        [ideaId]
      );

      if (result.length === 0) {
        return null;
      }

      return JSON.parse(result[0].embedding);
    } catch (error) {
      console.error('Error getting embedding:', error);
      return null;
    }
  }

  // Generate and store embedding for an idea
  async generateAndStoreEmbedding(ideaId: number, title: string, description?: string, content?: string): Promise<void> {
    if (!openai) {
      console.log('⚠️  Skipping embedding generation - OpenAI API key not configured');
      return;
    }

    // Combine title, description, and content for embedding
    const textToEmbed = [title, description, content].filter(Boolean).join(' ');
    
    if (!textToEmbed.trim()) {
      throw new Error('No text content to embed');
    }

    const embedding = await this.generateEmbedding(textToEmbed);
    await this.storeEmbedding(ideaId, embedding);
  }

  // Find related ideas using semantic similarity
  async findRelatedIdeas(ideaId: number, limit: number = 5): Promise<EmbeddingResult[]> {
    if (!openai) {
      console.log('⚠️  Related ideas feature disabled - OpenAI API key not configured');
      return [];
    }

    try {
      // Get the target idea's embedding
      const targetEmbedding = await this.getEmbedding(ideaId);
      if (!targetEmbedding) {
        return [];
      }

      // Get all other ideas with their embeddings
      const ideasWithEmbeddings = await runQuery(`
        SELECT 
          i.id,
          i.title,
          i.description,
          i.category,
          i.status,
          e.embedding
        FROM ideas i
        INNER JOIN embeddings e ON i.id = e.idea_id
        WHERE i.id != ?
      `, [ideaId]);

      // Calculate similarities
      const similarities: EmbeddingResult[] = [];

      for (const idea of ideasWithEmbeddings) {
        const ideaEmbedding = JSON.parse(idea.embedding);
        const similarity = this.calculateCosineSimilarity(targetEmbedding, ideaEmbedding);

        similarities.push({
          idea_id: idea.id,
          similarity,
          title: idea.title,
          description: idea.description,
          category: idea.category,
          status: idea.status,
        });
      }

      // Sort by similarity (highest first) and return top results
      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
    } catch (error) {
      console.error('Error finding related ideas:', error);
      return [];
    }
  }

  // Update embeddings for all ideas (useful for initial setup)
  async updateAllEmbeddings(): Promise<void> {
    if (!openai) {
      console.log('⚠️  Skipping embedding updates - OpenAI API key not configured');
      return;
    }

    try {
      const ideas = await runQuery('SELECT id, title, description, content FROM ideas');
      
      for (const idea of ideas) {
        try {
          await this.generateAndStoreEmbedding(
            idea.id,
            idea.title,
            idea.description,
            idea.content
          );
          console.log(`✅ Updated embedding for idea ${idea.id}: ${idea.title}`);
        } catch (error) {
          console.error(`❌ Failed to update embedding for idea ${idea.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error updating all embeddings:', error);
      throw error;
    }
  }
}

export const embeddingService = new EmbeddingService(); 