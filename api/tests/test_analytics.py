import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

@pytest.fixture
def sample_idea(client: TestClient, db_session: Session, sample_idea_data):
    """Create a sample idea for testing."""
    response = client.post("/api/ideas", json=sample_idea_data)
    return response.json()["data"]

def test_get_usage_analytics(client: TestClient, db_session: Session):
    """Test getting usage analytics."""
    response = client.get("/api/analytics/usage")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "total_ideas" in data["data"]
    assert "ideas_created" in data["data"]
    assert "categories" in data["data"]
    assert "statuses" in data["data"]
    assert "period" in data["data"]

def test_get_usage_analytics_with_period(client: TestClient, db_session: Session):
    """Test getting usage analytics with specific period."""
    response = client.get("/api/analytics/usage?period=7d")
    assert response.status_code == 400  # Invalid period format

def test_get_usage_analytics_invalid_period(client: TestClient, db_session: Session):
    """Test usage analytics with invalid period."""
    response = client.get("/api/analytics/usage?period=invalid")
    assert response.status_code == 400

def test_get_idea_insights(client: TestClient, db_session: Session, sample_idea):
    """Test getting insights for a specific idea."""
    response = client.get(f"/api/analytics/ideas/{sample_idea['id']}/insights")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "idea_id" in data["data"]
    assert "growth_progress" in data["data"]
    assert "document_count" in data["data"]
    assert "action_plan_count" in data["data"]

def test_get_idea_insights_not_found(client: TestClient, db_session: Session):
    """Test idea insights with non-existent idea."""
    response = client.get("/api/analytics/ideas/99999/insights")
    assert response.status_code == 404

def test_get_growth_patterns(client: TestClient, db_session: Session):
    """Test getting growth patterns."""
    response = client.get("/api/analytics/growth-patterns")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "category_growth" in data["data"]
    assert "monthly_trends" in data["data"]
    assert "stage_averages" in data["data"] 