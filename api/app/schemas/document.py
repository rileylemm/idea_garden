from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DocumentBase(BaseModel):
    title: str
    content: Optional[str] = None
    document_type: str = "uploaded"
    conversation_id: Optional[str] = None

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    document_type: Optional[str] = None
    conversation_id: Optional[str] = None

class Document(DocumentBase):
    id: int
    idea_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class DocumentResponse(BaseModel):
    success: bool
    data: Document
    message: Optional[str] = None

class DocumentsResponse(BaseModel):
    success: bool
    data: List[Document]

class DocumentVersion(BaseModel):
    id: int
    document_id: int
    version_number: int
    content: str
    created_at: datetime
    created_by: str
    
    class Config:
        from_attributes = True 