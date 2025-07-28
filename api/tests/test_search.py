import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

@pytest.fixture
def sample_idea(client: TestClient, db_session: Session, sample_idea_data):
    """Create a sample idea for testing."""
    response = client.post("/api/ideas", json=sample_idea_data)
    return response.json()["data"]

def test_semantic_search(client: TestClient, db_session: Session):
    """Test semantic search functionality."""
    response = client.get("/api/search/semantic?q=technology")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "results" in data["data"]
    assert "query" in data["data"]

def test_semantic_search_with_limit(client: TestClient, db_session: Session):
    """Test semantic search with limit parameter."""
    response = client.get("/api/search/semantic?q=technology&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert len(data["data"]["results"]) <= 5

def test_advanced_filter_ideas(client: TestClient, db_session: Session):
    """Test advanced filtering of ideas."""
    response = client.get("/api/search/ideas/filter")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "ideas" in data["data"]
    assert "pagination" in data["data"]
    assert "total" in data["data"]["pagination"]

def test_advanced_filter_with_category(client: TestClient, db_session: Session):
    """Test advanced filtering with category filter."""
    response = client.get("/api/search/ideas/filter?category=technology")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True

def test_advanced_filter_with_status(client: TestClient, db_session: Session):
    """Test advanced filtering with status filter."""
    response = client.get("/api/search/ideas/filter?status=seedling")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True

def test_advanced_filter_with_tags(client: TestClient, db_session: Session):
    """Test advanced filtering with tags filter."""
    response = client.get("/api/search/ideas/filter?tags=tech,innovation")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True

def test_advanced_filter_with_date_range(client: TestClient, db_session: Session):
    """Test advanced filtering with date range."""
    response = client.get("/api/search/ideas/filter?date_from=2024-01-01&date_to=2024-12-31")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True

def test_advanced_filter_with_sorting(client: TestClient, db_session: Session):
    """Test advanced filtering with sorting."""
    response = client.get("/api/search/ideas/filter?sort_by=created_at&sort_order=desc")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True

def test_advanced_filter_with_pagination(client: TestClient, db_session: Session):
    """Test advanced filtering with pagination."""
    response = client.get("/api/search/ideas/filter?limit=10&offset=0")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "pagination" in data["data"]

def test_get_idea_recommendations(client: TestClient, db_session: Session, sample_idea):
    """Test getting idea recommendations."""
    response = client.get(f"/api/search/ideas/{sample_idea['id']}/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "recommendations" in data["data"]
    assert "total_recommendations" in data["data"]

def test_get_idea_recommendations_with_limit(client: TestClient, db_session: Session, sample_idea):
    """Test getting idea recommendations with limit."""
    response = client.get(f"/api/search/ideas/{sample_idea['id']}/recommendations?limit=3")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert len(data["data"]["recommendations"]) <= 3

def test_get_idea_recommendations_not_found(client: TestClient, db_session: Session):
    """Test idea recommendations with non-existent idea."""
    response = client.get("/api/search/ideas/99999/recommendations")
    assert response.status_code == 404 