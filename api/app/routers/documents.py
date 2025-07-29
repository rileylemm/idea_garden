from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.document import Document, DocumentCreate, DocumentUpdate, DocumentResponse, DocumentsResponse
from app.models.idea import Document as DocumentModel
from datetime import datetime
import os
import shutil
import uuid
from pathlib import Path
import mimetypes

router = APIRouter()

# File upload configuration
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.rtf': 'application/rtf'
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def is_allowed_file(filename: str) -> bool:
    """Check if file extension is allowed"""
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS

def get_file_extension(filename: str) -> str:
    """Get file extension from filename"""
    return Path(filename).suffix.lower()

def generate_unique_filename(original_filename: str) -> str:
    """Generate a unique filename to prevent conflicts"""
    extension = get_file_extension(original_filename)
    unique_id = str(uuid.uuid4())
    return f"{unique_id}{extension}"

def save_uploaded_file(file: UploadFile, idea_id: int) -> str:
    """Save uploaded file and return the file path"""
    if not is_allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="File type not allowed")
    
    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    # Create idea-specific directory
    idea_upload_dir = UPLOAD_DIR / str(idea_id)
    idea_upload_dir.mkdir(exist_ok=True)
    
    # Generate unique filename
    unique_filename = generate_unique_filename(file.filename)
    file_path = idea_upload_dir / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return str(file_path)

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

@router.post("/ideas/{idea_id}/documents/upload", response_model=DocumentResponse, status_code=201)
async def upload_document(
    idea_id: int,
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    document_type: str = Form("uploaded"),
    conversation_id: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """Upload a file as a document"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Save the uploaded file
    file_path = save_uploaded_file(file, idea_id)
    
    # Use provided title or filename without extension
    document_title = title or Path(file.filename).stem
    
    # Create document record
    db_document = DocumentModel(
        idea_id=idea_id,
        title=document_title,
        content=content,
        document_type=document_type,
        conversation_id=conversation_id,
        file_path=file_path,
        original_filename=file.filename,
        file_size=file.size,
        mime_type=file.content_type or mimetypes.guess_type(file.filename)[0]
    )
    
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    return DocumentResponse(
        success=True, 
        data=db_document, 
        message="Document uploaded successfully"
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
    
    # Delete associated file if it exists
    if db_document.file_path and os.path.exists(db_document.file_path):
        try:
            os.remove(db_document.file_path)
        except OSError:
            pass  # File might already be deleted
    
    db.delete(db_document)
    db.commit()
    
    return {"success": True, "message": "Document deleted successfully"}

@router.post("/ideas/{idea_id}/documents/{document_id}/set-overview")
async def set_document_as_overview(idea_id: int, document_id: int, db: Session = Depends(get_db)):
    """Set a document as the overview document for an idea"""
    # First, unset any existing overview documents for this idea
    existing_overview = db.query(DocumentModel).filter(
        DocumentModel.idea_id == idea_id,
        DocumentModel.is_overview == True
    ).all()
    
    for doc in existing_overview:
        doc.is_overview = False
    
    # Set the specified document as overview
    db_document = db.query(DocumentModel).filter(
        DocumentModel.id == document_id,
        DocumentModel.idea_id == idea_id
    ).first()
    
    if not db_document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db_document.is_overview = True
    db.commit()
    db.refresh(db_document)
    
    return DocumentResponse(
        success=True, 
        data=db_document, 
        message="Document set as overview successfully"
    ) 