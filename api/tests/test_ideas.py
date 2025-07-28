import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

def test_get_all_ideas_empty(client: TestClient):
    """Test getting all ideas when database is empty."""
    response = client.get("/api/ideas")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"] == []

def test_create_idea(client: TestClient, sample_idea_data: dict):
    """Test creating a new idea."""
    response = client.post("/api/ideas", json=sample_idea_data)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["title"] == sample_idea_data["title"]
    assert data["data"]["description"] == sample_idea_data["description"]
    assert data["data"]["category"] == sample_idea_data["category"]
    assert data["data"]["status"] == sample_idea_data["status"]
    assert "id" in data["data"]
    assert "created_at" in data["data"]
    assert "updated_at" in data["data"]
    assert len(data["data"]["tags"]) == 2
    tag_names = [tag["name"] for tag in data["data"]["tags"]]
    assert "test" in tag_names
    assert "api" in tag_names

def test_create_idea_without_tags(client: TestClient):
    """Test creating an idea without tags."""
    idea_data = {
        "title": "Simple Idea",
        "description": "A simple test idea",
        "category": "personal",
        "status": "seedling"
    }
    response = client.post("/api/ideas", json=idea_data)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["title"] == idea_data["title"]
    assert data["data"]["tags"] == []

def test_get_idea_by_id(client: TestClient, sample_idea_data: dict):
    """Test getting a specific idea by ID."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Then get it by ID
    response = client.get(f"/api/ideas/{idea_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["id"] == idea_id
    assert data["data"]["title"] == sample_idea_data["title"]

def test_get_idea_by_id_not_found(client: TestClient):
    """Test getting a non-existent idea."""
    response = client.get("/api/ideas/99999")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Idea not found"

def test_update_idea(client: TestClient, sample_idea_data: dict):
    """Test updating an idea."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Then update it
    update_data = {
        "title": "Updated Idea",
        "description": "Updated description",
        "status": "growing",
        "tags": ["updated", "tags"]
    }
    response = client.put(f"/api/ideas/{idea_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["title"] == update_data["title"]
    assert data["data"]["description"] == update_data["description"]
    assert data["data"]["status"] == update_data["status"]
    
    # Check that tags were updated
    tag_names = [tag["name"] for tag in data["data"]["tags"]]
    assert "updated" in tag_names
    assert "tags" in tag_names

def test_update_idea_not_found(client: TestClient):
    """Test updating a non-existent idea."""
    update_data = {"title": "Updated Idea"}
    response = client.put("/api/ideas/99999", json=update_data)
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Idea not found"

def test_delete_idea(client: TestClient, sample_idea_data: dict):
    """Test deleting an idea."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Then delete it
    response = client.delete(f"/api/ideas/{idea_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Idea deleted successfully"
    
    # Verify it's gone
    get_response = client.get(f"/api/ideas/{idea_id}")
    assert get_response.status_code == 404

def test_delete_idea_not_found(client: TestClient):
    """Test deleting a non-existent idea."""
    response = client.delete("/api/ideas/99999")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Idea not found"

def test_search_ideas(client: TestClient, sample_idea_data: dict):
    """Test searching ideas."""
    # First create an idea
    client.post("/api/ideas", json=sample_idea_data)
    
    # Then search for it
    response = client.get("/api/ideas/search?q=Test")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) > 0
    assert any("Test" in idea["title"] for idea in data["data"])

def test_search_ideas_no_results(client: TestClient):
    """Test searching with no results."""
    response = client.get("/api/ideas/search?q=nonexistent")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"] == []

def test_get_related_ideas(client: TestClient, sample_idea_data: dict):
    """Test getting related ideas."""
    # Create multiple ideas with same category
    idea1 = sample_idea_data.copy()
    idea1["title"] = "First Idea"
    idea2 = sample_idea_data.copy()
    idea2["title"] = "Second Idea"
    
    client.post("/api/ideas", json=idea1)
    create_response = client.post("/api/ideas", json=idea2)
    idea_id = create_response.json()["data"]["id"]
    
    # Get related ideas
    response = client.get(f"/api/ideas/{idea_id}/related")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) > 0
    assert all(related["category"] == "technology" for related in data["data"])

def test_get_related_ideas_not_found(client: TestClient):
    """Test getting related ideas for non-existent idea."""
    response = client.get("/api/ideas/99999/related")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Idea not found"

def test_get_ideas_with_filters(client: TestClient, sample_idea_data: dict):
    """Test getting ideas with various filters."""
    # Create an idea
    client.post("/api/ideas", json=sample_idea_data)
    
    # Test category filter
    response = client.get("/api/ideas?category=technology")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert all(idea["category"] == "technology" for idea in data["data"])
    
    # Test status filter
    response = client.get("/api/ideas?status=seedling")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert all(idea["status"] == "seedling" for idea in data["data"])

def test_invalid_idea_id(client: TestClient):
    """Test invalid idea ID format."""
    response = client.get("/api/ideas/invalid")
    assert response.status_code == 422  # Validation error 