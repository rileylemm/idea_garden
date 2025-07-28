import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import os
import tempfile

from app.database import get_db, Base
from main import app

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    """Create a test client with an in-memory database."""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    with TestClient(app) as test_client:
        yield test_client
    
    # Clean up tables
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session():
    """Create a database session for testing."""
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()

@pytest.fixture
def sample_idea_data():
    """Sample data for creating test ideas."""
    return {
        "title": "Test Idea",
        "description": "A test idea for API testing",
        "content": "Detailed content for the test idea",
        "category": "technology",
        "status": "seedling",
        "tags": ["test", "api"]
    }

@pytest.fixture
def sample_document_data():
    """Sample data for creating test documents."""
    return {
        "title": "Test Document",
        "content": "Test document content",
        "document_type": "uploaded",
        "conversation_id": None
    }

@pytest.fixture
def sample_action_plan_data():
    """Sample data for creating test action plans."""
    return {
        "title": "Test Action Plan",
        "content": "Test action plan content",
        "timeline": "2 weeks",
        "vision": "Test vision",
        "resources": "Test resources",
        "constraints": "Test constraints",
        "priority": 1
    } 