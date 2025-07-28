from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class TagBase(BaseModel):
    name: str

class Tag(TagBase):
    id: int
    
    class Config:
        from_attributes = True

class IdeaBase(BaseModel):
    title: str
    description: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    status: str = "seedling"

class IdeaCreate(IdeaBase):
    tags: Optional[List[str]] = []

class IdeaUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[List[str]] = []

class Idea(IdeaBase):
    id: int
    created_at: datetime
    updated_at: datetime
    tags: List[Tag] = []
    
    class Config:
        from_attributes = True

class IdeaResponse(BaseModel):
    success: bool
    data: Idea
    message: Optional[str] = None

class IdeasResponse(BaseModel):
    success: bool
    data: List[Idea]

class SearchQuery(BaseModel):
    q: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[str] = None

class RelatedIdea(BaseModel):
    idea_id: int
    similarity: float
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None

class RelatedIdeasResponse(BaseModel):
    success: bool
    data: List[RelatedIdea] 