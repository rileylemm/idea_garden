from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.idea import Idea, IdeaCreate, IdeaUpdate, IdeaResponse, IdeasResponse, SearchQuery, RelatedIdea, RelatedIdeasResponse
from app.models.idea import Idea as IdeaModel, Tag as TagModel
from datetime import datetime

router = APIRouter()

@router.get("/ideas", response_model=IdeasResponse)
async def get_all_ideas(
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status"),
    tags: Optional[str] = Query(None, description="Filter by tags"),
    db: Session = Depends(get_db)
):
    """Get all ideas with optional filtering"""
    query = db.query(IdeaModel)
    
    if q:
        query = query.filter(IdeaModel.title.contains(q) | IdeaModel.description.contains(q))
    if category:
        query = query.filter(IdeaModel.category == category)
    if status:
        query = query.filter(IdeaModel.status == status)
    
    ideas = query.all()
    
    return IdeasResponse(success=True, data=ideas)

@router.get("/ideas/search", response_model=IdeasResponse)
async def search_ideas(q: str = Query(..., description="Search query"), db: Session = Depends(get_db)):
    """Search ideas by query string"""
    ideas = db.query(IdeaModel).filter(
        IdeaModel.title.contains(q) | IdeaModel.description.contains(q)
    ).all()
    
    return IdeasResponse(success=True, data=ideas)

@router.get("/ideas/{idea_id}", response_model=IdeaResponse)
async def get_idea_by_id(idea_id: int, db: Session = Depends(get_db)):
    """Get a specific idea by ID"""
    idea = db.query(IdeaModel).filter(IdeaModel.id == idea_id).first()
    
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    return IdeaResponse(success=True, data=idea)

@router.post("/ideas", response_model=IdeaResponse, status_code=201)
async def create_idea(idea: IdeaCreate, db: Session = Depends(get_db)):
    """Create a new idea"""
    db_idea = IdeaModel(
        title=idea.title,
        description=idea.description,
        content=idea.content,
        category=idea.category,
        status=idea.status
    )
    
    # Handle tags
    if idea.tags:
        for tag_name in idea.tags:
            # Get or create tag
            tag = db.query(TagModel).filter(TagModel.name == tag_name).first()
            if not tag:
                tag = TagModel(name=tag_name)
                db.add(tag)
                db.flush()  # Get the tag ID
            db_idea.tags.append(tag)
    
    db.add(db_idea)
    db.commit()
    db.refresh(db_idea)
    
    return IdeaResponse(
        success=True, 
        data=db_idea, 
        message="Idea created successfully"
    )

@router.put("/ideas/{idea_id}", response_model=IdeaResponse)
async def update_idea(idea_id: int, idea_update: IdeaUpdate, db: Session = Depends(get_db)):
    """Update an existing idea"""
    db_idea = db.query(IdeaModel).filter(IdeaModel.id == idea_id).first()
    
    if not db_idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    # Update fields
    update_data = idea_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field != "tags":
            setattr(db_idea, field, value)
    
    # Handle tags
    if idea_update.tags is not None:
        db_idea.tags.clear()
        for tag_name in idea_update.tags:
            tag = db.query(TagModel).filter(TagModel.name == tag_name).first()
            if not tag:
                tag = TagModel(name=tag_name)
                db.add(tag)
                db.flush()
            db_idea.tags.append(tag)
    
    db_idea.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_idea)
    
    return IdeaResponse(
        success=True, 
        data=db_idea, 
        message="Idea updated successfully"
    )

@router.delete("/ideas/{idea_id}")
async def delete_idea(idea_id: int, db: Session = Depends(get_db)):
    """Delete an idea and all related data"""
    db_idea = db.query(IdeaModel).filter(IdeaModel.id == idea_id).first()
    
    if not db_idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    try:
        # Delete related documents first
        from app.models.idea import Document
        documents = db.query(Document).filter(Document.idea_id == idea_id).all()
        for doc in documents:
            db.delete(doc)
        
        # Delete related action plans
        from app.models.idea import ActionPlan
        action_plans = db.query(ActionPlan).filter(ActionPlan.idea_id == idea_id).all()
        for plan in action_plans:
            db.delete(plan)
        
        # Delete related embeddings
        from app.models.idea import Embedding
        embeddings = db.query(Embedding).filter(Embedding.idea_id == idea_id).all()
        for embedding in embeddings:
            db.delete(embedding)
        
        # Clear tags association (many-to-many relationship)
        db_idea.tags.clear()
        
        # Finally delete the idea
        db.delete(db_idea)
        db.commit()
        
        return {"success": True, "message": "Idea deleted successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete idea: {str(e)}")

@router.get("/ideas/{idea_id}/related", response_model=RelatedIdeasResponse)
async def get_related_ideas(
    idea_id: int, 
    limit: int = Query(5, description="Number of related ideas to return"),
    db: Session = Depends(get_db)
):
    """Get AI-powered related ideas using semantic similarity"""
    # For now, return ideas with similar categories
    # TODO: Implement proper semantic similarity with embeddings
    idea = db.query(IdeaModel).filter(IdeaModel.id == idea_id).first()
    
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    related_ideas = db.query(IdeaModel).filter(
        IdeaModel.category == idea.category,
        IdeaModel.id != idea_id
    ).limit(limit).all()
    
    related_data = []
    for related_idea in related_ideas:
        related_data.append(RelatedIdea(
            idea_id=related_idea.id,
            similarity=0.8,  # Placeholder similarity score
            title=related_idea.title,
            description=related_idea.description,
            category=related_idea.category,
            status=related_idea.status
        ))
    
    return RelatedIdeasResponse(success=True, data=related_data) 