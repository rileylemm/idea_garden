from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, func
from typing import List, Optional
from app.database import get_db
from app.models.idea import Idea, Tag
from app.schemas.idea import IdeaResponse

router = APIRouter()

@router.get("/semantic")
async def semantic_search(
    q: str = Query(..., description="Search query"),
    limit: int = Query(10, description="Number of results to return"),
    db: Session = Depends(get_db)
):
    """Perform semantic search across ideas using AI embeddings."""
    try:
        # For now, implement basic text search
        # TODO: Implement actual semantic search with embeddings
        ideas = db.query(Idea).filter(
            or_(
                Idea.title.ilike(f"%{q}%"),
                Idea.description.ilike(f"%{q}%"),
                Idea.content.ilike(f"%{q}%")
            )
        ).limit(limit).all()

        return {
            "success": True,
            "data": {
                "query": q,
                "results": [
                    {
                        "id": idea.id,
                        "title": idea.title,
                        "description": idea.description,
                        "category": idea.category,
                        "status": idea.status,
                        "relevance_score": 0.85,  # Placeholder
                        "tags": [{"id": tag.id, "name": tag.name} for tag in idea.tags]
                    } for idea in ideas
                ],
                "total_results": len(ideas)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

@router.get("/ideas/filter")
async def advanced_filter_ideas(
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status"),
    tags: Optional[str] = Query(None, description="Comma-separated tags"),
    date_from: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    sort_by: str = Query("updated_at", description="Sort field"),
    sort_order: str = Query("desc", description="Sort order (asc/desc)"),
    limit: int = Query(50, description="Number of results"),
    offset: int = Query(0, description="Pagination offset"),
    db: Session = Depends(get_db)
):
    """Advanced filtering and sorting for ideas."""
    try:
        query = db.query(Idea)

        # Apply filters
        if q:
            query = query.filter(
                or_(
                    Idea.title.ilike(f"%{q}%"),
                    Idea.description.ilike(f"%{q}%"),
                    Idea.content.ilike(f"%{q}%")
                )
            )

        if category:
            query = query.filter(Idea.category == category)

        if status:
            query = query.filter(Idea.status == status)

        if tags:
            tag_list = [tag.strip() for tag in tags.split(",")]
            query = query.join(Idea.tags).filter(Tag.name.in_(tag_list))

        if date_from:
            query = query.filter(Idea.created_at >= date_from)

        if date_to:
            query = query.filter(Idea.created_at <= date_to)

        # Apply sorting
        if sort_order == "desc":
            query = query.order_by(desc(getattr(Idea, sort_by)))
        else:
            query = query.order_by(getattr(Idea, sort_by))

        # Apply pagination
        total = query.count()
        ideas = query.offset(offset).limit(limit).all()

        return {
            "success": True,
            "data": {
                "ideas": [
                    {
                        "id": idea.id,
                        "title": idea.title,
                        "description": idea.description,
                        "category": idea.category,
                        "status": idea.status,
                        "created_at": idea.created_at.isoformat(),
                        "updated_at": idea.updated_at.isoformat(),
                        "tags": [{"id": tag.id, "name": tag.name} for tag in idea.tags]
                    } for idea in ideas
                ],
                "pagination": {
                    "total": total,
                    "limit": limit,
                    "offset": offset,
                    "has_more": offset + limit < total
                },
                "filters_applied": {
                    "query": q,
                    "category": category,
                    "status": status,
                    "tags": tags,
                    "date_from": date_from,
                    "date_to": date_to
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Filter error: {str(e)}")

@router.get("/ideas/{idea_id}/recommendations")
async def get_idea_recommendations(
    idea_id: int,
    limit: int = Query(5, description="Number of recommendations"),
    db: Session = Depends(get_db)
):
    """Get AI-powered recommendations for related ideas."""
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    try:

        # Find related ideas based on category and tags
        related_ideas = db.query(Idea).filter(
            and_(
                Idea.id != idea_id,
                or_(
                    Idea.category == idea.category,
                    Idea.tags.any(Tag.name.in_([tag.name for tag in idea.tags]))
                )
            )
        ).limit(limit).all()

        # Calculate similarity scores (placeholder)
        recommendations = []
        for related_idea in related_ideas:
            # Simple similarity calculation based on shared tags
            shared_tags = set([tag.name for tag in idea.tags]) & set([tag.name for tag in related_idea.tags])
            similarity_score = len(shared_tags) / max(len(idea.tags), len(related_idea.tags), 1)

            recommendations.append({
                "id": related_idea.id,
                "title": related_idea.title,
                "description": related_idea.description,
                "category": related_idea.category,
                "status": related_idea.status,
                "similarity_score": similarity_score,
                "shared_tags": list(shared_tags),
                "reason": f"Shares {len(shared_tags)} tags" if shared_tags else f"Same category: {idea.category}"
            })

        # Sort by similarity score
        recommendations.sort(key=lambda x: x["similarity_score"], reverse=True)

        return {
            "success": True,
            "data": {
                "idea_id": idea_id,
                "recommendations": recommendations,
                "total_recommendations": len(recommendations)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}") 