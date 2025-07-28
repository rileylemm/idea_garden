from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.database import get_db
from app.models.idea import Idea, Document, ActionPlan
from app.schemas.idea import IdeaResponse

router = APIRouter()

@router.get("/usage")
async def get_usage_analytics(
    period: str = "month",  # day, week, month, year
    db: Session = Depends(get_db)
):
    """Get usage analytics for the specified period."""
    # Calculate date range
    end_date = datetime.now()
    if period == "day":
        start_date = end_date - timedelta(days=1)
    elif period == "week":
        start_date = end_date - timedelta(weeks=1)
    elif period == "month":
        start_date = end_date - timedelta(days=30)
    elif period == "year":
        start_date = end_date - timedelta(days=365)
    else:
        raise HTTPException(status_code=400, detail="Invalid period")

    try:

        # Get idea creation stats
        ideas_created = db.query(Idea).filter(
            Idea.created_at >= start_date
        ).count()

        # Get category distribution
        category_stats = db.query(
            Idea.category,
            func.count(Idea.id).label('count')
        ).filter(
            Idea.created_at >= start_date
        ).group_by(Idea.category).all()

        # Get status distribution
        status_stats = db.query(
            Idea.status,
            func.count(Idea.id).label('count')
        ).filter(
            Idea.created_at >= start_date
        ).group_by(Idea.status).all()

        # Get most active tags
        tag_stats = db.query(
            func.count(Idea.id).label('idea_count')
        ).join(Idea.tags).filter(
            Idea.created_at >= start_date
        ).group_by(Idea.id).all()

        return {
            "success": True,
            "data": {
                "period": period,
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "ideas_created": ideas_created,
                "categories": [{"category": cat, "count": count} for cat, count in category_stats],
                "statuses": [{"status": status, "count": count} for status, count in status_stats],
                "total_ideas": db.query(Idea).count(),
                "total_documents": db.query(Document).count(),
                "total_action_plans": db.query(ActionPlan).count()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating analytics: {str(e)}")

@router.get("/ideas/{idea_id}/insights")
async def get_idea_insights(
    idea_id: int,
    db: Session = Depends(get_db)
):
    """Get detailed insights for a specific idea."""
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    try:

        # Calculate time in each stage
        created_at = idea.created_at
        updated_at = idea.updated_at
        time_in_current_stage = (updated_at - created_at).days

        # Get related documents
        documents = db.query(Document).filter(Document.idea_id == idea_id).all()
        document_count = len(documents)

        # Get action plans
        action_plans = db.query(ActionPlan).filter(ActionPlan.idea_id == idea_id).all()
        action_plan_count = len(action_plans)

        # Get related ideas (same category or tags)
        related_ideas = db.query(Idea).filter(
            Idea.id != idea_id,
            (Idea.category == idea.category) | (Idea.tags.any())
        ).limit(5).all()

        return {
            "success": True,
            "data": {
                "idea_id": idea_id,
                "time_in_current_stage": time_in_current_stage,
                "document_count": document_count,
                "action_plan_count": action_plan_count,
                "related_ideas_count": len(related_ideas),
                "last_updated": idea.updated_at.isoformat(),
                "growth_progress": {
                    "current_stage": idea.status,
                    "days_in_stage": time_in_current_stage,
                    "total_days": (updated_at - created_at).days
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating insights: {str(e)}")

@router.get("/growth-patterns")
async def get_growth_patterns(db: Session = Depends(get_db)):
    """Get growth pattern analytics across all ideas."""
    try:
        # Calculate average time in each stage
        stage_stats = db.query(
            Idea.status,
            func.avg(func.julianday(Idea.updated_at) - func.julianday(Idea.created_at)).label('avg_days')
        ).group_by(Idea.status).all()

        # Get category-specific growth rates
        category_growth = db.query(
            Idea.category,
            Idea.status,
            func.count(Idea.id).label('count')
        ).group_by(Idea.category, Idea.status).all()

        # Get monthly trends
        monthly_trends = db.query(
            func.strftime('%Y-%m', Idea.created_at).label('month'),
            func.count(Idea.id).label('count')
        ).group_by(func.strftime('%Y-%m', Idea.created_at)).order_by(desc('month')).limit(12).all()

        return {
            "success": True,
            "data": {
                "stage_averages": [{"stage": stage, "avg_days": avg_days} for stage, avg_days in stage_stats],
                "category_growth": [{"category": cat, "status": status, "count": count} for cat, status, count in category_growth],
                "monthly_trends": [{"month": month, "count": count} for month, count in monthly_trends]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating growth patterns: {str(e)}") 