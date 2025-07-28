from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.database import get_db
from app.models.idea import Idea, Document, ActionPlan, Tag

router = APIRouter()

class AutomationRule(BaseModel):
    name: str
    trigger_type: str  # idea_created, idea_updated, status_changed, category_changed
    conditions: Dict[str, Any]
    actions: List[str]

class WorkflowTrigger(BaseModel):
    trigger_type: str
    idea_id: int
    metadata: Dict[str, Any]

@router.post("/idea-matured")
async def trigger_idea_matured_workflow(
    idea_id: int,
    db: Session = Depends(get_db)
):
    """Trigger actions when an idea reaches 'mature' status."""
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    try:

        if idea.status != "mature":
            return {
                "success": True,
                "data": {
                    "message": f"Idea status is '{idea.status}', not 'mature'. No workflow triggered."
                }
            }

        # Check if action plan already exists
        existing_plans = db.query(ActionPlan).filter(ActionPlan.idea_id == idea_id).count()
        
        actions_taken = []
        
        # Auto-generate action plan if none exists
        if existing_plans == 0:
            action_plan = ActionPlan(
                idea_id=idea_id,
                title=f"Implementation Plan for {idea.title}",
                content="Auto-generated implementation plan for mature idea. Review and customize as needed.",
                timeline="3-6 months",
                vision="Transform this mature idea into a successful implementation",
                resources="Team, budget, and technical resources",
                constraints="Time, budget, and market conditions",
                priority=1
            )
            db.add(action_plan)
            actions_taken.append("Created auto-generated action plan")

        # Suggest next steps
        suggestions = [
            "Review and refine the implementation strategy",
            "Identify key stakeholders and team members",
            "Create detailed project timeline",
            "Define success metrics and KPIs",
            "Plan for market validation and testing"
        ]

        db.commit()

        return {
            "success": True,
            "data": {
                "idea_id": idea_id,
                "idea_title": idea.title,
                "actions_taken": actions_taken,
                "suggestions": suggestions,
                "workflow_completed": True
            }
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Workflow error: {str(e)}")

@router.post("/periodic-review")
async def trigger_periodic_review_workflow(
    days_old: int = 30,
    db: Session = Depends(get_db)
):
    """Trigger periodic review for ideas that haven't been updated recently."""
    try:
        cutoff_date = datetime.now() - timedelta(days=days_old)
        
        # Find ideas that haven't been updated recently
        stale_ideas = db.query(Idea).filter(
            Idea.updated_at < cutoff_date
        ).all()

        review_results = []
        
        for idea in stale_ideas:
            days_since_update = (datetime.now() - idea.updated_at).days
            
            review_results.append({
                "idea_id": idea.id,
                "title": idea.title,
                "status": idea.status,
                "days_since_update": days_since_update,
                "suggestions": [
                    "Consider updating the idea with new insights",
                    "Review if the idea is still relevant",
                    "Add new research or findings",
                    "Update the status if appropriate"
                ]
            })

        return {
            "success": True,
            "data": {
                "review_date": datetime.now().isoformat(),
                "cutoff_days": days_old,
                "ideas_needing_review": len(review_results),
                "review_results": review_results
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Periodic review error: {str(e)}")

@router.post("/automation/rules")
async def create_automation_rule(
    rule: AutomationRule,
    db: Session = Depends(get_db)
):
    """Create a new automation rule."""
    try:
        # TODO: Store automation rules in database
        # For now, return success response
        return {
            "success": True,
            "data": {
                "rule_id": "rule_" + str(datetime.now().timestamp()),
                "rule": rule.dict(),
                "status": "created"
            },
            "message": "Automation rule created successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rule creation error: {str(e)}")

@router.get("/automation/rules")
async def list_automation_rules(db: Session = Depends(get_db)):
    """List all active automation rules."""
    try:
        # TODO: Retrieve rules from database
        # For now, return sample rules
        sample_rules = [
            {
                "id": "rule_1",
                "name": "Auto-tag Technology Ideas",
                "trigger_type": "idea_created",
                "conditions": {"category": "technology"},
                "actions": ["add_tag:tech", "add_tag:innovation"],
                "active": True
            },
            {
                "id": "rule_2", 
                "name": "Generate Action Plan for Mature Ideas",
                "trigger_type": "status_changed",
                "conditions": {"new_status": "mature"},
                "actions": ["create_action_plan"],
                "active": True
            },
            {
                "id": "rule_3",
                "name": "Weekly Review Reminder",
                "trigger_type": "periodic",
                "conditions": {"frequency": "weekly"},
                "actions": ["send_reminder"],
                "active": True
            }
        ]

        return {
            "success": True,
            "data": {
                "rules": sample_rules,
                "total_rules": len(sample_rules)
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rule listing error: {str(e)}")

@router.post("/workflows/trigger")
async def trigger_custom_workflow(
    trigger: WorkflowTrigger,
    db: Session = Depends(get_db)
):
    """Trigger a custom workflow based on the provided trigger."""
    idea = db.query(Idea).filter(Idea.id == trigger.idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    try:

        workflow_results = {
            "trigger_type": trigger.trigger_type,
            "idea_id": trigger.idea_id,
            "idea_title": idea.title,
            "actions_executed": [],
            "metadata": trigger.metadata
        }

        # Handle different trigger types
        if trigger.trigger_type == "idea_created":
            workflow_results["actions_executed"].append("Welcome workflow initiated")
            
        elif trigger.trigger_type == "idea_updated":
            workflow_results["actions_executed"].append("Update workflow processed")
            
        elif trigger.trigger_type == "status_changed":
            new_status = trigger.metadata.get("new_status")
            if new_status == "growing":
                workflow_results["actions_executed"].append("Growth milestone reached")
            elif new_status == "mature":
                workflow_results["actions_executed"].append("Maturity workflow triggered")
                
        elif trigger.trigger_type == "category_changed":
            new_category = trigger.metadata.get("new_category")
            workflow_results["actions_executed"].append(f"Category changed to {new_category}")

        return {
            "success": True,
            "data": workflow_results
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Workflow trigger error: {str(e)}")

@router.get("/workflows/status")
async def get_workflow_status(db: Session = Depends(get_db)):
    """Get the status of all workflows and automation rules."""
    try:
        # Get workflow statistics
        total_ideas = db.query(Idea).count()
        mature_ideas = db.query(Idea).filter(Idea.status == "mature").count()
        growing_ideas = db.query(Idea).filter(Idea.status == "growing").count()
        seedling_ideas = db.query(Idea).filter(Idea.status == "seedling").count()

        # Get recent activity
        recent_ideas = db.query(Idea).filter(
            Idea.updated_at >= datetime.now() - timedelta(days=7)
        ).count()

        return {
            "success": True,
            "data": {
                "workflow_statistics": {
                    "total_ideas": total_ideas,
                    "mature_ideas": mature_ideas,
                    "growing_ideas": growing_ideas,
                    "seedling_ideas": seedling_ideas,
                    "recent_activity": recent_ideas
                },
                "automation_status": {
                    "active_rules": 3,  # Placeholder
                    "last_execution": datetime.now().isoformat(),
                    "next_scheduled": (datetime.now() + timedelta(hours=24)).isoformat()
                }
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Status check error: {str(e)}") 