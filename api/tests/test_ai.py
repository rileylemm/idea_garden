import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.idea import Idea, ActionPlan

@pytest.fixture
def sample_idea(client: TestClient, db_session: Session, sample_idea_data):
    """Create a sample idea for testing."""
    response = client.post("/api/ideas", json=sample_idea_data)
    return response.json()["data"]

@pytest.fixture
def sample_action_plan(client: TestClient, db_session: Session, sample_idea, sample_action_plan_data):
    """Create a sample action plan for testing."""
    response = client.post(f"/api/ideas/{sample_idea['id']}/action-plans", json=sample_action_plan_data)
    return response.json()["data"]

def test_generate_idea_summary(client: TestClient, db_session: Session, sample_idea):
    """Test generating AI summary for an idea."""
    response = client.post(f"/api/ai/generate-summary/{sample_idea['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert data["data"]["idea_id"] == sample_idea["id"]
    assert "summary" in data["data"]
    assert "key_points" in data["data"]["summary"]
    assert "recommendations" in data["data"]["summary"]
    assert "next_steps" in data["data"]["summary"]

def test_generate_idea_summary_not_found(client: TestClient, db_session: Session):
    """Test generating summary for non-existent idea."""
    response = client.post("/api/ai/generate-summary/99999")
    assert response.status_code == 404

def test_suggest_tags_for_idea(client: TestClient, db_session: Session, sample_idea):
    """Test suggesting tags for an idea."""
    response = client.post(f"/api/ai/suggest-tags/{sample_idea['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert data["data"]["idea_id"] == sample_idea["id"]
    assert "suggested_tags" in data["data"]
    assert "existing_tags" in data["data"]
    assert "reasoning" in data["data"]

def test_suggest_tags_not_found(client: TestClient, db_session: Session):
    """Test suggesting tags for non-existent idea."""
    response = client.post("/api/ai/suggest-tags/99999")
    assert response.status_code == 404

def test_improve_idea_content(client: TestClient, db_session: Session, sample_idea):
    """Test improving idea content."""
    response = client.post(f"/api/ai/improve-content/{sample_idea['id']}?improvement_type=clarity")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert data["data"]["idea_id"] == sample_idea["id"]
    assert "improvement_type" in data["data"]
    assert "suggestions" in data["data"]
    assert "content_analysis" in data["data"]
    assert "priority_suggestions" in data["data"]

def test_improve_idea_content_structure(client: TestClient, db_session: Session, sample_idea):
    """Test improving idea content with structure focus."""
    response = client.post(f"/api/ai/improve-content/{sample_idea['id']}?improvement_type=structure")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert data["data"]["improvement_type"] == "structure"

def test_improve_idea_content_completeness(client: TestClient, db_session: Session, sample_idea):
    """Test improving idea content with completeness focus."""
    response = client.post(f"/api/ai/improve-content/{sample_idea['id']}?improvement_type=completeness")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert data["data"]["improvement_type"] == "completeness"

def test_improve_idea_content_not_found(client: TestClient, db_session: Session):
    """Test improving content for non-existent idea."""
    response = client.post("/api/ai/improve-content/99999?improvement_type=clarity")
    assert response.status_code == 404

def test_get_research_suggestions(client: TestClient, db_session: Session, sample_idea):
    """Test getting research suggestions for an idea."""
    response = client.post(f"/api/ai/research-suggestions/{sample_idea['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert data["data"]["idea_id"] == sample_idea["id"]
    assert "category_specific_suggestions" in data["data"]
    assert "general_research_topics" in data["data"]
    assert "recommended_approach" in data["data"]

def test_get_research_suggestions_not_found(client: TestClient, db_session: Session):
    """Test getting research suggestions for non-existent idea."""
    response = client.post("/api/ai/research-suggestions/99999")
    assert response.status_code == 404

def test_validate_action_plan(client: TestClient, db_session: Session, sample_action_plan):
    """Test validating an action plan."""
    response = client.post(f"/api/ai/validate-action-plan/{sample_action_plan['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert data["data"]["action_plan_id"] == sample_action_plan["id"]
    assert "validation_results" in data["data"]

def test_validate_action_plan_not_found(client: TestClient, db_session: Session):
    """Test validating non-existent action plan."""
    response = client.post("/api/ai/validate-action-plan/99999")
    assert response.status_code == 404 