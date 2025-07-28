from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.idea import Idea as IdeaModel, Tag as TagModel
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
    """Update all embeddings"""
    # TODO: Implement embedding update logic
    # This would involve:
    # 1. Getting all ideas
    # 2. Generating embeddings for each idea
    # 3. Storing embeddings in the database
    
    return {
        "success": True,
        "message": "Embedding update initiated",
        "note": "This endpoint is a placeholder for future implementation"
    } 