import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

@pytest.fixture
def sample_idea(client: TestClient, db_session: Session, sample_idea_data):
    """Create a sample idea for testing."""
    response = client.post("/api/ideas", json=sample_idea_data)
    return response.json()["data"]

def test_export_ideas_json(client: TestClient, db_session: Session):
    """Test exporting ideas in JSON format."""
    response = client.get("/api/export/ideas?format=json")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/json"
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "ideas" in data["data"]
    assert "total_ideas" in data["data"]

def test_export_ideas_csv(client: TestClient, db_session: Session):
    """Test exporting ideas in CSV format."""
    response = client.get("/api/export/ideas?format=csv")
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert response.text is not None

def test_export_ideas_markdown(client: TestClient, db_session: Session):
    """Test exporting ideas in Markdown format."""
    response = client.get("/api/export/ideas?format=markdown")
    assert response.status_code == 200
    assert "text/markdown" in response.headers["content-type"]
    assert response.text is not None

def test_export_ideas_with_filters(client: TestClient, db_session: Session):
    """Test exporting ideas with filters."""
    response = client.get("/api/export/ideas?format=json&category=technology&status=seedling")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "ideas" in data["data"]

def test_export_ideas_invalid_format(client: TestClient, db_session: Session):
    """Test exporting ideas with invalid format."""
    response = client.get("/api/export/ideas?format=invalid")
    assert response.status_code == 400

def test_export_full_idea_json(client: TestClient, db_session: Session, sample_idea):
    """Test exporting a full idea in JSON format."""
    response = client.get(f"/api/export/idea/{sample_idea['id']}/full?format=json")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/json"
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "idea" in data["data"]
    assert "documents" in data["data"]
    assert "action_plans" in data["data"]

def test_export_full_idea_markdown(client: TestClient, db_session: Session, sample_idea):
    """Test exporting a full idea in Markdown format."""
    response = client.get(f"/api/export/idea/{sample_idea['id']}/full?format=markdown")
    assert response.status_code == 200
    assert "text/markdown" in response.headers["content-type"]
    assert response.text is not None

def test_export_full_idea_html(client: TestClient, db_session: Session, sample_idea):
    """Test exporting a full idea in HTML format."""
    response = client.get(f"/api/export/idea/{sample_idea['id']}/full?format=html")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    assert response.text is not None

def test_export_full_idea_not_found(client: TestClient, db_session: Session):
    """Test exporting a non-existent idea."""
    response = client.get("/api/export/idea/99999/full?format=json")
    assert response.status_code == 404

def test_export_full_idea_invalid_format(client: TestClient, db_session: Session, sample_idea):
    """Test exporting a full idea with invalid format."""
    response = client.get(f"/api/export/idea/{sample_idea['id']}/full?format=invalid")
    assert response.status_code == 400

def test_import_ideas(client: TestClient, db_session: Session):
    """Test importing ideas."""
    import_data = [
        {
            "title": "Imported Idea",
            "description": "An imported idea",
            "category": "technology",
            "status": "seedling",
            "tags": ["imported", "test"]
        }
    ]
    response = client.post("/api/export/import/ideas", json=import_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "imported_count" in data["data"]

def test_import_ideas_with_duplicates(client: TestClient, db_session: Session):
    """Test importing ideas with duplicate handling."""
    import_data = [
        {
            "title": "Duplicate Idea",
            "description": "A duplicate idea",
            "category": "business",
            "status": "growing",
            "tags": ["duplicate"]
        }
    ]
    response = client.post("/api/export/import/ideas", json=import_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True

def test_import_ideas_empty_data(client: TestClient, db_session: Session):
    """Test importing ideas with empty data."""
    import_data = []
    response = client.post("/api/export/import/ideas", json=import_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert data["data"]["imported_count"] == 0 