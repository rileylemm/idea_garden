import pytest
from fastapi.testclient import TestClient

def test_get_documents_empty(client: TestClient, sample_idea_data: dict):
    """Test getting documents when idea has no documents."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Then get documents
    response = client.get(f"/api/ideas/{idea_id}/documents")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"] == []

def test_create_document(client: TestClient, sample_idea_data: dict, sample_document_data: dict):
    """Test creating a new document."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Then create a document
    response = client.post(f"/api/ideas/{idea_id}/documents", json=sample_document_data)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["title"] == sample_document_data["title"]
    assert data["data"]["content"] == sample_document_data["content"]
    assert data["data"]["document_type"] == sample_document_data["document_type"]
    assert data["data"]["idea_id"] == idea_id
    assert "id" in data["data"]
    assert "created_at" in data["data"]
    assert "updated_at" in data["data"]

def test_get_document_by_id(client: TestClient, sample_idea_data: dict, sample_document_data: dict):
    """Test getting a specific document."""
    # First create an idea and document
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    doc_response = client.post(f"/api/ideas/{idea_id}/documents", json=sample_document_data)
    document_id = doc_response.json()["data"]["id"]
    
    # Then get the document
    response = client.get(f"/api/ideas/{idea_id}/documents/{document_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["id"] == document_id
    assert data["data"]["title"] == sample_document_data["title"]

def test_get_document_not_found(client: TestClient, sample_idea_data: dict):
    """Test getting a non-existent document."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Then try to get a non-existent document
    response = client.get(f"/api/ideas/{idea_id}/documents/99999")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Document not found"

def test_update_document(client: TestClient, sample_idea_data: dict, sample_document_data: dict):
    """Test updating a document."""
    # First create an idea and document
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    doc_response = client.post(f"/api/ideas/{idea_id}/documents", json=sample_document_data)
    document_id = doc_response.json()["data"]["id"]
    
    # Then update the document
    update_data = {
        "title": "Updated Document",
        "content": "Updated content"
    }
    response = client.put(f"/api/ideas/{idea_id}/documents/{document_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["title"] == update_data["title"]
    assert data["data"]["content"] == update_data["content"]

def test_update_document_not_found(client: TestClient, sample_idea_data: dict):
    """Test updating a non-existent document."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Then try to update a non-existent document
    update_data = {"title": "Updated Document"}
    response = client.put(f"/api/ideas/{idea_id}/documents/99999", json=update_data)
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Document not found"

def test_delete_document(client: TestClient, sample_idea_data: dict, sample_document_data: dict):
    """Test deleting a document."""
    # First create an idea and document
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    doc_response = client.post(f"/api/ideas/{idea_id}/documents", json=sample_document_data)
    document_id = doc_response.json()["data"]["id"]
    
    # Then delete the document
    response = client.delete(f"/api/ideas/{idea_id}/documents/{document_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Document deleted successfully"
    
    # Verify it's gone
    get_response = client.get(f"/api/ideas/{idea_id}/documents/{document_id}")
    assert get_response.status_code == 404

def test_delete_document_not_found(client: TestClient, sample_idea_data: dict):
    """Test deleting a non-existent document."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Then try to delete a non-existent document
    response = client.delete(f"/api/ideas/{idea_id}/documents/99999")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Document not found"

def test_create_document_with_ai_type(client: TestClient, sample_idea_data: dict):
    """Test creating a document with AI-generated type."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Then create an AI-generated document
    ai_document_data = {
        "title": "AI Generated Document",
        "content": "AI generated content",
        "document_type": "ai_generated",
        "conversation_id": "conv_123"
    }
    response = client.post(f"/api/ideas/{idea_id}/documents", json=ai_document_data)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["document_type"] == "ai_generated"
    assert data["data"]["conversation_id"] == "conv_123"

def test_get_multiple_documents(client: TestClient, sample_idea_data: dict, sample_document_data: dict):
    """Test getting multiple documents for an idea."""
    # First create an idea
    create_response = client.post("/api/ideas", json=sample_idea_data)
    idea_id = create_response.json()["data"]["id"]
    
    # Create multiple documents
    doc1 = sample_document_data.copy()
    doc1["title"] = "First Document"
    doc2 = sample_document_data.copy()
    doc2["title"] = "Second Document"
    
    client.post(f"/api/ideas/{idea_id}/documents", json=doc1)
    client.post(f"/api/ideas/{idea_id}/documents", json=doc2)
    
    # Get all documents
    response = client.get(f"/api/ideas/{idea_id}/documents")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) == 2
    titles = [doc["title"] for doc in data["data"]]
    assert "First Document" in titles
    assert "Second Document" in titles 