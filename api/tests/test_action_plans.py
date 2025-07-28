import pytest
from fastapi.testclient import TestClient

def test_get_action_plan_not_found(client: TestClient, sample_idea_data: dict):
    """Test getting action plan when idea has no action plan."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Then try to get action plan
    response = client.get(f"/api/ideas/{idea_id}/action-plan")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Action plan not found"

def test_create_action_plan(client: TestClient, sample_idea_data: dict, sample_action_plan_data: dict):
    """Test creating a new action plan."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Then create an action plan
    response = client.post(f"/api/ideas/{idea_id}/action-plans", json=sample_action_plan_data)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["title"] == sample_action_plan_data["title"]
    assert data["data"]["content"] == sample_action_plan_data["content"]
    assert data["data"]["timeline"] == sample_action_plan_data["timeline"]
    assert data["data"]["vision"] == sample_action_plan_data["vision"]
    assert data["data"]["resources"] == sample_action_plan_data["resources"]
    assert data["data"]["constraints"] == sample_action_plan_data["constraints"]
    assert data["data"]["priority"] == sample_action_plan_data["priority"]
    assert data["data"]["idea_id"] == idea_id
    assert "id" in data["data"]
    assert "created_at" in data["data"]
    assert "updated_at" in data["data"]

def test_get_action_plan_by_id(client: TestClient, sample_idea_data: dict, sample_action_plan_data: dict):
    """Test getting a specific action plan."""
    # First create an idea and action plan
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    plan_response = client.post(f"/api/ideas/{idea_id}/action-plans", json=sample_action_plan_data)
    action_plan_id = plan_response.json()["data"]["id"]
    
    # Then get the action plan
    response = client.get(f"/api/ideas/{idea_id}/action-plans/{action_plan_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["id"] == action_plan_id
    assert data["data"]["title"] == sample_action_plan_data["title"]

def test_get_action_plan_by_id_not_found(client: TestClient, sample_idea_data: dict):
    """Test getting a non-existent action plan."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Then try to get a non-existent action plan
    response = client.get(f"/api/ideas/{idea_id}/action-plans/99999")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Action plan not found"

def test_update_action_plan(client: TestClient, sample_idea_data: dict, sample_action_plan_data: dict):
    """Test updating an action plan."""
    # First create an idea and action plan
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    plan_response = client.post(f"/api/ideas/{idea_id}/action-plans", json=sample_action_plan_data)
    action_plan_id = plan_response.json()["data"]["id"]
    
    # Then update the action plan
    update_data = {
        "title": "Updated Action Plan",
        "content": "Updated content",
        "priority": 2
    }
    response = client.put(f"/api/ideas/{idea_id}/action-plans/{action_plan_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["title"] == update_data["title"]
    assert data["data"]["content"] == update_data["content"]
    assert data["data"]["priority"] == update_data["priority"]

def test_update_action_plan_not_found(client: TestClient, sample_idea_data: dict):
    """Test updating a non-existent action plan."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Then try to update a non-existent action plan
    update_data = {"title": "Updated Action Plan"}
    response = client.put(f"/api/ideas/{idea_id}/action-plans/99999", json=update_data)
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Action plan not found"

def test_delete_action_plan(client: TestClient, sample_idea_data: dict, sample_action_plan_data: dict):
    """Test deleting an action plan."""
    # First create an idea and action plan
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    plan_response = client.post(f"/api/ideas/{idea_id}/action-plans", json=sample_action_plan_data)
    action_plan_id = plan_response.json()["data"]["id"]
    
    # Then delete the action plan
    response = client.delete(f"/api/ideas/{idea_id}/action-plans/{action_plan_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Action plan deleted successfully"
    
    # Verify it's gone
    get_response = client.get(f"/api/ideas/{idea_id}/action-plans/{action_plan_id}")
    assert get_response.status_code == 404

def test_delete_action_plan_not_found(client: TestClient, sample_idea_data: dict):
    """Test deleting a non-existent action plan."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Then try to delete a non-existent action plan
    response = client.delete(f"/api/ideas/{idea_id}/action-plans/99999")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Action plan not found"

def test_get_action_plan_after_creation(client: TestClient, sample_idea_data: dict, sample_action_plan_data: dict):
    """Test getting action plan after creating one."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Create an action plan
    client.post(f"/api/ideas/{idea_id}/action-plans", json=sample_action_plan_data)
    
    # Then get the action plan
    response = client.get(f"/api/ideas/{idea_id}/action-plan")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["title"] == sample_action_plan_data["title"]
    assert data["data"]["idea_id"] == idea_id

def test_create_action_plan_with_different_priorities(client: TestClient, sample_idea_data: dict):
    """Test creating action plans with different priorities."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Create action plan with high priority
    high_priority_data = {
        "title": "High Priority Plan",
        "content": "Important content",
        "timeline": "1 week",
        "vision": "Quick win",
        "resources": "Minimal resources",
        "constraints": "Time constraint",
        "priority": 1
    }
    response = client.post(f"/api/ideas/{idea_id}/action-plans", json=high_priority_data)
    assert response.status_code == 201
    data = response.json()
    assert data["data"]["priority"] == 1
    
    # Create action plan with low priority
    low_priority_data = {
        "title": "Low Priority Plan",
        "content": "Less important content",
        "timeline": "3 months",
        "vision": "Long-term goal",
        "resources": "Extensive resources",
        "constraints": "Budget constraint",
        "priority": 3
    }
    response = client.post(f"/api/ideas/{idea_id}/action-plans", json=low_priority_data)
    assert response.status_code == 201
    data = response.json()
    assert data["data"]["priority"] == 3 