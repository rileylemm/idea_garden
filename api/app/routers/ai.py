from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.idea import Idea, Document, ActionPlan, Tag
from app.schemas.idea import IdeaUpdate
import os

router = APIRouter()

@router.post("/generate-summary/{idea_id}")
async def generate_idea_summary(
    idea_id: int,
    db: Session = Depends(get_db)
):
    """Generate an AI-powered summary for an idea."""
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    try:
        # Get related documents and action plans for context
        documents = db.query(Document).filter(Document.idea_id == idea_id).all()
        action_plans = db.query(ActionPlan).filter(ActionPlan.idea_id == idea_id).all()

        # Build context for AI
        context = f"Title: {idea.title}\n"
        if idea.description:
            context += f"Description: {idea.description}\n"
        if idea.content:
            context += f"Content: {idea.content}\n"
        
        context += f"Category: {idea.category}\n"
        context += f"Status: {idea.status}\n"
        context += f"Tags: {', '.join([tag.name for tag in idea.tags])}\n\n"

        if documents:
            context += "Related Documents:\n"
            for doc in documents:
                context += f"- {doc.title}: {doc.content[:200]}...\n"

        if action_plans:
            context += "\nAction Plans:\n"
            for plan in action_plans:
                context += f"- {plan.title}: {plan.content[:200]}...\n"

        # TODO: Integrate with OpenAI API for actual summary generation
        # For now, return a structured summary
        summary = {
            "key_points": [
                f"Idea focuses on {idea.category} domain",
                f"Current status: {idea.status}",
                f"Has {len(documents)} research documents",
                f"Has {len(action_plans)} action plans"
            ],
            "recommendations": [
                "Consider adding more detailed content if status is 'seedling'",
                "Review action plans for feasibility",
                "Explore related ideas in the same category"
            ],
            "next_steps": [
                "Expand on the core concept",
                "Research market opportunities",
                "Create detailed implementation plan"
            ]
        }

        return {
            "success": True,
            "data": {
                "idea_id": idea_id,
                "summary": summary,
                "context_used": context[:500] + "..." if len(context) > 500 else context
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summary generation error: {str(e)}")

@router.post("/suggest-tags/{idea_id}")
async def suggest_tags_for_idea(
    idea_id: int,
    db: Session = Depends(get_db)
):
    """Suggest tags for an idea using AI analysis."""
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    try:
        # Analyze content for tag suggestions
        content_for_analysis = f"{idea.title} {idea.description or ''} {idea.content or ''}"
        
        # TODO: Use OpenAI API for actual tag suggestions
        # For now, provide basic suggestions based on content analysis
        suggested_tags = []
        
        # Category-based suggestions
        if idea.category == "technology":
            suggested_tags.extend(["tech", "innovation", "software", "digital"])
        elif idea.category == "business":
            suggested_tags.extend(["startup", "entrepreneurship", "market", "strategy"])
        elif idea.category == "creative":
            suggested_tags.extend(["design", "art", "creative", "inspiration"])
        
        # Content-based suggestions
        content_lower = content_for_analysis.lower()
        if "app" in content_lower or "application" in content_lower:
            suggested_tags.append("app")
        if "web" in content_lower or "website" in content_lower:
            suggested_tags.append("web")
        if "mobile" in content_lower or "phone" in content_lower:
            suggested_tags.append("mobile")
        if "ai" in content_lower or "artificial" in content_lower:
            suggested_tags.append("ai")
        if "data" in content_lower or "analytics" in content_lower:
            suggested_tags.append("data")
        
        # Remove duplicates and existing tags
        existing_tags = [tag.name for tag in idea.tags]
        suggested_tags = list(set(suggested_tags) - set(existing_tags))

        return {
            "success": True,
            "data": {
                "idea_id": idea_id,
                "suggested_tags": suggested_tags,
                "existing_tags": existing_tags,
                "reasoning": "Tags suggested based on content analysis and category patterns"
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tag suggestion error: {str(e)}")

@router.post("/improve-content/{idea_id}")
async def improve_idea_content(
    idea_id: int,
    improvement_type: str = "clarity",  # clarity, structure, completeness
    db: Session = Depends(get_db)
):
    """Suggest improvements for idea content."""
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    try:

        # TODO: Use OpenAI API for actual content improvement
        # For now, provide structured suggestions
        suggestions = {
            "clarity": [
                "Consider adding a clear problem statement",
                "Define the target audience more specifically",
                "Add concrete examples or use cases",
                "Simplify technical jargon"
            ],
            "structure": [
                "Organize content into clear sections",
                "Add a brief executive summary",
                "Include a timeline or roadmap",
                "Structure as: Problem → Solution → Benefits → Implementation"
            ],
            "completeness": [
                "Add market research findings",
                "Include competitive analysis",
                "Define success metrics",
                "Add risk assessment and mitigation strategies"
            ]
        }

        current_suggestions = suggestions.get(improvement_type, suggestions["clarity"])
        
        # Analyze current content for specific suggestions
        content_analysis = {
            "has_problem_statement": "problem" in (idea.description or "").lower(),
            "has_target_audience": any(word in (idea.description or "").lower() for word in ["user", "customer", "audience", "people"]),
            "has_examples": any(word in (idea.description or "").lower() for word in ["example", "instance", "case", "scenario"]),
            "word_count": len(idea.description or "") + len(idea.content or "")
        }

        return {
            "success": True,
            "data": {
                "idea_id": idea_id,
                "improvement_type": improvement_type,
                "suggestions": current_suggestions,
                "content_analysis": content_analysis,
                "priority_suggestions": current_suggestions[:2]  # Top 2 suggestions
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Content improvement error: {str(e)}")

@router.post("/research-suggestions/{idea_id}")
async def get_research_suggestions(
    idea_id: int,
    db: Session = Depends(get_db)
):
    """Suggest research topics and resources for an idea."""
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    try:

        # TODO: Use OpenAI API for actual research suggestions
        # For now, provide category-based research suggestions
        research_suggestions = {
            "technology": [
                "Market size and growth trends",
                "Competitive landscape analysis",
                "Technical feasibility assessment",
                "User adoption patterns",
                "Regulatory considerations"
            ],
            "business": [
                "Market validation studies",
                "Customer persona development",
                "Revenue model analysis",
                "Cost structure research",
                "Partnership opportunities"
            ],
            "creative": [
                "Audience research and preferences",
                "Style and trend analysis",
                "Medium and format exploration",
                "Collaboration opportunities",
                "Distribution channels"
            ]
        }

        suggestions = research_suggestions.get(idea.category, research_suggestions["business"])
        
        # Add general research topics
        general_topics = [
            "Industry reports and whitepapers",
            "Academic research in the field",
            "Case studies of similar projects",
            "Expert interviews and insights",
            "User feedback and surveys"
        ]

        return {
            "success": True,
            "data": {
                "idea_id": idea_id,
                "category_specific_suggestions": suggestions,
                "general_research_topics": general_topics,
                "recommended_approach": f"Focus on {idea.category}-specific research first, then expand to general topics"
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Research suggestion error: {str(e)}")

@router.post("/validate-action-plan/{action_plan_id}")
async def validate_action_plan(
    action_plan_id: int,
    db: Session = Depends(get_db)
):
    """Validate action plan feasibility and suggest improvements."""
    action_plan = db.query(ActionPlan).filter(ActionPlan.id == action_plan_id).first()
    if not action_plan:
        raise HTTPException(status_code=404, detail="Action plan not found")

    try:

        # TODO: Use OpenAI API for actual validation
        # For now, provide structured validation
        validation_results = {
            "feasibility_score": 0.75,  # Placeholder score
            "timeline_assessment": "Timeline appears reasonable",
            "resource_adequacy": "Resources seem sufficient",
            "risk_factors": [
                "Market conditions may change",
                "Resource availability uncertain",
                "Timeline may be optimistic"
            ],
            "improvement_suggestions": [
                "Add more specific milestones",
                "Include contingency plans",
                "Define success metrics clearly",
                "Consider external dependencies"
            ],
            "strengths": [
                "Clear vision and objectives",
                "Well-defined timeline",
                "Resource requirements identified"
            ]
        }

        return {
            "success": True,
            "data": {
                "action_plan_id": action_plan_id,
                "validation_results": validation_results,
                "recommendation": "Action plan is feasible with suggested improvements"
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Action plan validation error: {str(e)}") 