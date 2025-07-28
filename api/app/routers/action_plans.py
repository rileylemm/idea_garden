from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.action_plan import ActionPlan, ActionPlanCreate, ActionPlanUpdate, ActionPlanResponse
from app.models.idea import ActionPlan as ActionPlanModel
from datetime import datetime

router = APIRouter()

@router.get("/ideas/{idea_id}/action-plan", response_model=ActionPlanResponse)
async def get_action_plan(idea_id: int, db: Session = Depends(get_db)):
    """Get action plan for an idea"""
    action_plan = db.query(ActionPlanModel).filter(ActionPlanModel.idea_id == idea_id).first()
    
    if not action_plan:
        raise HTTPException(status_code=404, detail="Action plan not found")
    
    return ActionPlanResponse(success=True, data=action_plan)

@router.get("/ideas/{idea_id}/action-plans/{action_plan_id}", response_model=ActionPlanResponse)
async def get_action_plan_by_id(idea_id: int, action_plan_id: int, db: Session = Depends(get_db)):
    """Get a specific action plan"""
    action_plan = db.query(ActionPlanModel).filter(
        ActionPlanModel.id == action_plan_id,
        ActionPlanModel.idea_id == idea_id
    ).first()
    
    if not action_plan:
        raise HTTPException(status_code=404, detail="Action plan not found")
    
    return ActionPlanResponse(success=True, data=action_plan)

@router.post("/ideas/{idea_id}/action-plans", response_model=ActionPlanResponse, status_code=201)
async def create_action_plan(
    idea_id: int, 
    action_plan: ActionPlanCreate, 
    db: Session = Depends(get_db)
):
    """Create a new action plan for an idea"""
    db_action_plan = ActionPlanModel(
        idea_id=idea_id,
        title=action_plan.title,
        content=action_plan.content,
        timeline=action_plan.timeline,
        vision=action_plan.vision,
        resources=action_plan.resources,
        constraints=action_plan.constraints,
        priority=action_plan.priority
    )
    
    db.add(db_action_plan)
    db.commit()
    db.refresh(db_action_plan)
    
    return ActionPlanResponse(
        success=True, 
        data=db_action_plan, 
        message="Action plan created successfully"
    )

@router.put("/ideas/{idea_id}/action-plans/{action_plan_id}", response_model=ActionPlanResponse)
async def update_action_plan(
    idea_id: int, 
    action_plan_id: int, 
    action_plan_update: ActionPlanUpdate, 
    db: Session = Depends(get_db)
):
    """Update an action plan"""
    db_action_plan = db.query(ActionPlanModel).filter(
        ActionPlanModel.id == action_plan_id,
        ActionPlanModel.idea_id == idea_id
    ).first()
    
    if not db_action_plan:
        raise HTTPException(status_code=404, detail="Action plan not found")
    
    # Update fields
    update_data = action_plan_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_action_plan, field, value)
    
    db_action_plan.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_action_plan)
    
    return ActionPlanResponse(
        success=True, 
        data=db_action_plan, 
        message="Action plan updated successfully"
    )

@router.delete("/ideas/{idea_id}/action-plans/{action_plan_id}")
async def delete_action_plan(idea_id: int, action_plan_id: int, db: Session = Depends(get_db)):
    """Delete an action plan"""
    db_action_plan = db.query(ActionPlanModel).filter(
        ActionPlanModel.id == action_plan_id,
        ActionPlanModel.idea_id == idea_id
    ).first()
    
    if not db_action_plan:
        raise HTTPException(status_code=404, detail="Action plan not found")
    
    db.delete(db_action_plan)
    db.commit()
    
    return {"success": True, "message": "Action plan deleted successfully"} 