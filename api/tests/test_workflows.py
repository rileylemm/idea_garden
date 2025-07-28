import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.idea import Idea, ActionPlan

@pytest.fixture
def sample_idea(client: TestClient, db_session: Session, sample_idea_data):
    """Create a sample idea for testing."""
    response = client.post("/api/ideas", json=sample_idea_data)
    return response.json()["data"]

def test_trigger_idea_matured_workflow(client: TestClient, db_session: Session, sample_idea):
    """Test triggering workflow for matured idea."""
    # First, update the idea to mature status
    client.put(f"/api/ideas/{sample_idea['id']}", json={"status": "mature"})
    
    response = client.post(f"/api/workflows/idea-matured?idea_id={sample_idea['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert data["data"]["idea_id"] == sample_idea["id"]
    assert "actions_taken" in data["data"]
    assert "suggestions" in data["data"]
    assert "workflow_completed" in data["data"]

def test_trigger_idea_matured_workflow_not_mature(client: TestClient, db_session: Session, sample_idea):
    """Test triggering workflow for non-mature idea."""
    response = client.post(f"/api/workflows/idea-matured?idea_id={sample_idea['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "message" in data["data"]

def test_trigger_idea_matured_workflow_not_found(client: TestClient, db_session: Session):
    """Test triggering workflow for non-existent idea."""
    response = client.post("/api/workflows/idea-matured?idea_id=99999")
    assert response.status_code == 404

def test_trigger_periodic_review_workflow(client: TestClient, db_session: Session):
    """Test triggering periodic review workflow."""
    response = client.post("/api/workflows/periodic-review?days_old=30")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "review_date" in data["data"]
    assert "cutoff_days" in data["data"]
    assert "ideas_needing_review" in data["data"]
    assert "review_results" in data["data"]

def test_create_automation_rule(client: TestClient, db_session: Session):
    """Test creating an automation rule."""
    rule_data = {
        "name": "Test Rule",
        "trigger_type": "idea_created",
        "conditions": {"category": "technology"},
        "actions": ["add_tag:tech"]
    }
    
    response = client.post("/api/workflows/automation/rules", json=rule_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "rule_id" in data["data"]
    assert "rule" in data["data"]
    assert "status" in data["data"]

def test_list_automation_rules(client: TestClient, db_session: Session):
    """Test listing automation rules."""
    response = client.get("/api/workflows/automation/rules")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "rules" in data["data"]
    assert "total_rules" in data["data"]

def test_trigger_custom_workflow(client: TestClient, db_session: Session, sample_idea):
    """Test triggering a custom workflow."""
    trigger_data = {
        "trigger_type": "idea_created",
        "idea_id": sample_idea["id"],
        "metadata": {"source": "test"}
    }
    
    response = client.post("/api/workflows/workflows/trigger", json=trigger_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert data["data"]["trigger_type"] == "idea_created"
    assert data["data"]["idea_id"] == sample_idea["id"]
    assert "actions_executed" in data["data"]

def test_trigger_custom_workflow_not_found(client: TestClient, db_session: Session):
    """Test triggering custom workflow with non-existent idea."""
    trigger_data = {
        "trigger_type": "idea_created",
        "idea_id": 99999,
        "metadata": {"source": "test"}
    }
    
    response = client.post("/api/workflows/workflows/trigger", json=trigger_data)
    assert response.status_code == 404

def test_get_workflow_status(client: TestClient, db_session: Session):
    """Test getting workflow status."""
    response = client.get("/api/workflows/workflows/status")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "workflow_statistics" in data["data"]
    assert "automation_status" in data["data"]
    assert "total_ideas" in data["data"]["workflow_statistics"]
    assert "active_rules" in data["data"]["automation_status"] 