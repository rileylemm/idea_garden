import pytest
from fastapi.testclient import TestClient

def test_get_categories_empty(client: TestClient):
    """Test getting categories when database is empty."""
    response = client.get("/api/categories")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"] == []

def test_get_categories_with_data(client: TestClient, sample_idea_data: dict):
    """Test getting categories when ideas exist."""
    # Create ideas with different categories
    idea1 = sample_idea_data.copy()
    idea1["category"] = "technology"
    idea2 = sample_idea_data.copy()
    idea2["title"] = "Business Idea"
    idea2["category"] = "business"
    idea3 = sample_idea_data.copy()
    idea3["title"] = "Personal Idea"
    idea3["category"] = "personal"
    
    client.post("/api/ideas", json=idea1)
    client.post("/api/ideas", json=idea2)
    client.post("/api/ideas", json=idea3)
    
    # Get categories
    response = client.get("/api/categories")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) == 3
    assert "technology" in data["data"]
    assert "business" in data["data"]
    assert "personal" in data["data"]

def test_get_tags_empty(client: TestClient):
    """Test getting tags when database is empty."""
    response = client.get("/api/tags")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"] == []

def test_get_tags_with_data(client: TestClient, sample_idea_data: dict):
    """Test getting tags when ideas with tags exist."""
    # Create ideas with different tags
    idea1 = sample_idea_data.copy()
    idea1["tags"] = ["test", "api"]
    idea2 = sample_idea_data.copy()
    idea2["title"] = "Another Idea"
    idea2["tags"] = ["business", "innovation"]
    
    client.post("/api/ideas", json=idea1)
    client.post("/api/ideas", json=idea2)
    
    # Get tags
    response = client.get("/api/tags")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) == 4
    
    tag_names = [tag["name"] for tag in data["data"]]
    assert "test" in tag_names
    assert "api" in tag_names
    assert "business" in tag_names
    assert "innovation" in tag_names
    
    # Check that each tag has an id
    for tag in data["data"]:
        assert "id" in tag
        assert "name" in tag

def test_update_embeddings_placeholder(client: TestClient):
    """Test the embeddings update endpoint (placeholder)."""
    response = client.post("/api/embeddings/update-all")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Embedding update initiated"
    assert "note" in data
    assert "placeholder" in data["note"] 