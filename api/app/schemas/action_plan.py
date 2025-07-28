from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ActionPlanBase(BaseModel):
    title: str
    content: str
    timeline: str
    vision: str
    resources: str
    constraints: str
    priority: int = 1

class ActionPlanCreate(ActionPlanBase):
    pass

class ActionPlanUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    timeline: Optional[str] = None
    vision: Optional[str] = None
    resources: Optional[str] = None
    constraints: Optional[str] = None
    priority: Optional[int] = None

class ActionPlan(ActionPlanBase):
    id: int
    idea_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ActionPlanResponse(BaseModel):
    success: bool
    data: ActionPlan
    message: Optional[str] = None 