from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.document import Document, DocumentCreate, DocumentUpdate, DocumentResponse, DocumentsResponse
from app.models.idea import Document as DocumentModel
from datetime import datetime

router = APIRouter()

@router.get("/ideas/{idea_id}/documents", response_model=DocumentsResponse)
async def get_documents(idea_id: int, db: Session = Depends(get_db)):
    """Get all documents for an idea"""
    documents = db.query(DocumentModel).filter(DocumentModel.idea_id == idea_id).all()
    return DocumentsResponse(success=True, data=documents)

@router.get("/ideas/{idea_id}/documents/{document_id}", response_model=DocumentResponse)
async def get_document(idea_id: int, document_id: int, db: Session = Depends(get_db)):
    """Get a specific document"""
    document = db.query(DocumentModel).filter(
        DocumentModel.id == document_id,
        DocumentModel.idea_id == idea_id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return DocumentResponse(success=True, data=document)

@router.post("/ideas/{idea_id}/documents", response_model=DocumentResponse, status_code=201)
async def create_document(
    idea_id: int, 
    document: DocumentCreate, 
    db: Session = Depends(get_db)
):
    """Create a new document for an idea"""
    db_document = DocumentModel(
        idea_id=idea_id,
        title=document.title,
        content=document.content,
        document_type=document.document_type,
        conversation_id=document.conversation_id
    )
    
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    return DocumentResponse(
        success=True, 
        data=db_document, 
        message="Document created successfully"
    )

@router.put("/ideas/{idea_id}/documents/{document_id}", response_model=DocumentResponse)
async def update_document(
    idea_id: int, 
    document_id: int, 
    document_update: DocumentUpdate, 
    db: Session = Depends(get_db)
):
    """Update a document"""
    db_document = db.query(DocumentModel).filter(
        DocumentModel.id == document_id,
        DocumentModel.idea_id == idea_id
    ).first()
    
    if not db_document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Update fields
    update_data = document_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_document, field, value)
    
    db_document.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_document)
    
    return DocumentResponse(
        success=True, 
        data=db_document, 
        message="Document updated successfully"
    )

@router.delete("/ideas/{idea_id}/documents/{document_id}")
async def delete_document(idea_id: int, document_id: int, db: Session = Depends(get_db)):
    """Delete a document"""
    db_document = db.query(DocumentModel).filter(
        DocumentModel.id == document_id,
        DocumentModel.idea_id == idea_id
    ).first()
    
    if not db_document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db.delete(db_document)
    db.commit()
    
    return {"success": True, "message": "Document deleted successfully"} 