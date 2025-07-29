from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

# Many-to-many relationship table for ideas and tags
idea_tags = Table(
    'idea_tags',
    Base.metadata,
    Column('idea_id', Integer, ForeignKey('ideas.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)

class Idea(Base):
    __tablename__ = "ideas"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    content = Column(Text)
    category = Column(String)
    status = Column(String, default="seedling")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    tags = relationship("Tag", secondary=idea_tags, back_populates="ideas")
    documents = relationship("Document", back_populates="idea")
    action_plans = relationship("ActionPlan", back_populates="idea")
    embeddings = relationship("Embedding", back_populates="idea")

class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    
    # Relationships
    ideas = relationship("Idea", secondary=idea_tags, back_populates="tags")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    idea_id = Column(Integer, ForeignKey("ideas.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text)
    document_type = Column(String, default="uploaded")
    conversation_id = Column(String)
    file_path = Column(String)  # Path to uploaded file
    original_filename = Column(String)  # Original filename
    file_size = Column(Integer)  # File size in bytes
    mime_type = Column(String)  # MIME type of the file
    is_overview = Column(Boolean, default=False)  # Whether this is the overview document
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    idea = relationship("Idea", back_populates="documents")
    versions = relationship("DocumentVersion", back_populates="document")

class DocumentVersion(Base):
    __tablename__ = "document_versions"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    created_by = Column(String, default="user")
    
    # Relationships
    document = relationship("Document", back_populates="versions")

class ActionPlan(Base):
    __tablename__ = "action_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    idea_id = Column(Integer, ForeignKey("ideas.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    timeline = Column(String, nullable=False)
    vision = Column(Text, nullable=False)
    resources = Column(Text, nullable=False)
    constraints = Column(Text, nullable=False)
    priority = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    idea = relationship("Idea", back_populates="action_plans")

class Embedding(Base):
    __tablename__ = "embeddings"
    
    idea_id = Column(Integer, ForeignKey("ideas.id"), primary_key=True)
    embedding = Column(Text, nullable=False)  # JSON string of embedding vector
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    idea = relationship("Idea", back_populates="embeddings") 