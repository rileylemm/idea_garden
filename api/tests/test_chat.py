import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock

def test_project_overview_chat_streaming(client: TestClient):
    """Test the project overview chat endpoint with streaming response."""
    with patch('app.services.ai_service.ai_service.stream_chat') as mock_stream:
        # Mock the streaming response
        async def mock_stream_response():
            yield "Hello! I'm here to help you explore your idea."
            yield " What's the feeling behind this project?"
        
        mock_stream.return_value = mock_stream_response()
        
        response = client.post("/api/chat/project-overview", json={
            "messages": [
                {"type": "user", "content": "I want to build a flower sharing app"}
            ],
            "idea": {
                "title": "Flower Sharing App",
                "description": "An app to share beautiful flowers digitally"
            },
            "documents": [],
            "tone": "warm",
            "model_provider": "openai",
            "model_name": "gpt-3.5-turbo"
        })
        
        assert response.status_code == 200
        # Check that it's a streaming response
        assert "text/plain" in response.headers.get("content-type", "")

def test_get_category_template_technology(client: TestClient):
    """Test the category template endpoint for technology category."""
    response = client.get("/api/chat/template/technology")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "template" in data
    assert "Technical Approach" in data["template"]
    assert "Implementation Plan" in data["template"]

def test_get_category_template_business(client: TestClient):
    """Test the category template endpoint for business category."""
    response = client.get("/api/chat/template/business")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "template" in data
    assert "Business Concept" in data["template"]
    assert "Market Opportunity" in data["template"]

def test_get_category_template_creative(client: TestClient):
    """Test the category template endpoint for creative category."""
    response = client.get("/api/chat/template/creative")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "template" in data
    assert "Creative Vision" in data["template"]
    assert "Artistic Direction" in data["template"]

def test_get_category_template_unknown(client: TestClient):
    """Test the category template endpoint for unknown category."""
    response = client.get("/api/chat/template/unknown")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "template" in data
    # Should fall back to general template
    assert "Concept Overview" in data["template"]

def test_generate_document_with_openai(client: TestClient):
    """Test the generate document endpoint with OpenAI."""
    with patch('app.services.ai_service.ai_service.generate_document') as mock_generate:
        mock_generate.return_value = "# Test Document\n\nThis is a test document."
        
        response = client.post("/api/chat/generate-document", json={
            "messages": [
                {"type": "user", "content": "I want to build a flower app"},
                {"type": "ai", "content": "That sounds lovely! Tell me more about it."}
            ],
            "idea": {
                "title": "Flower App",
                "description": "A beautiful flower sharing app"
            },
            "documents": [],
            "template": "# {projectTitle}\n\n## Overview\n{description}",
            "tone": "warm",
            "model_provider": "openai",
            "model_name": "gpt-3.5-turbo"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "document" in data
        assert "Test Document" in data["document"]

def test_generate_document_with_ollama(client: TestClient):
    """Test the generate document endpoint with Ollama."""
    with patch('app.services.ai_service.ai_service.generate_document') as mock_generate:
        mock_generate.return_value = "# Ollama Document\n\nGenerated with local model."
        
        response = client.post("/api/chat/generate-document", json={
            "messages": [
                {"type": "user", "content": "I want to build a flower app"}
            ],
            "idea": {
                "title": "Flower App",
                "description": "A beautiful flower sharing app"
            },
            "documents": [],
            "template": "# {projectTitle}\n\n## Overview\n{description}",
            "tone": "warm",
            "model_provider": "ollama",
            "model_name": "llama2"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "document" in data
        assert "Ollama Document" in data["document"]

def test_save_conversation_placeholder(client: TestClient):
    """Test the save conversation endpoint (placeholder)."""
    response = client.post("/api/chat/save-conversation", json={
        "messages": [
            {"type": "user", "content": "Hello"},
            {"type": "ai", "content": "Hi there!"}
        ],
        "idea_id": 1
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "conversation_id" in data

def test_load_conversation_placeholder(client: TestClient):
    """Test the load conversation endpoint (placeholder)."""
    response = client.get("/api/chat/conversation/1")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "conversation" in data
    assert data["idea_id"] == 1

def test_get_available_models(client: TestClient):
    """Test the get available models endpoint."""
    with patch('app.services.ai_service.ai_service.get_available_models') as mock_models:
        mock_models.return_value = {
            "openai": ["gpt-3.5-turbo", "gpt-4"],
            "ollama": ["llama2", "mistral"]
        }
        
        response = client.get("/api/chat/models")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "models" in data
        assert "openai" in data["models"]
        assert "ollama" in data["models"]
        assert "gpt-3.5-turbo" in data["models"]["openai"]
        assert "llama2" in data["models"]["ollama"]

def test_project_overview_chat_invalid_request(client: TestClient):
    """Test the project overview chat endpoint with invalid request."""
    response = client.post("/api/chat/project-overview", json={
        "invalid": "data"
    })
    # The endpoint should handle invalid requests gracefully
    assert response.status_code in [200, 500]

def test_generate_document_invalid_request(client: TestClient):
    """Test the generate document endpoint with invalid request."""
    response = client.post("/api/chat/generate-document", json={
        "invalid": "data"
    })
    # The endpoint should handle invalid requests gracefully
    assert response.status_code in [200, 500] 