import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

def test_get_user_preferences(client: TestClient, db_session: Session):
    """Test getting user preferences."""
    response = client.get("/api/system/preferences")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "theme" in data["data"]
    assert "default_category" in data["data"]
    assert "auto_save" in data["data"]
    assert "notifications_enabled" in data["data"]

def test_update_user_preferences(client: TestClient, db_session: Session):
    """Test updating user preferences."""
    preferences_data = {
        "theme": "dark",
        "default_category": "technology",
        "auto_save": False,
        "notifications_enabled": True,
        "default_view": "list"
    }
    
    response = client.put("/api/system/preferences", json=preferences_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "updated_preferences" in data["data"]
    assert "timestamp" in data["data"]

def test_get_system_health(client: TestClient, db_session: Session):
    """Test getting system health information."""
    response = client.get("/api/system/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "status" in data["data"]
    assert "timestamp" in data["data"]
    assert "database" in data["data"]
    assert "system" in data["data"]
    assert "api" in data["data"]

def test_get_system_statistics(client: TestClient, db_session: Session):
    """Test getting system statistics."""
    response = client.get("/api/system/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "overview" in data["data"]
    assert "distribution" in data["data"]
    assert "performance" in data["data"]
    assert "growth" in data["data"]
    assert "total_ideas" in data["data"]["overview"]
    assert "categories" in data["data"]["distribution"]
    assert "statuses" in data["data"]["distribution"]

def test_get_system_configuration(client: TestClient, db_session: Session):
    """Test getting system configuration."""
    response = client.get("/api/system/config")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "api" in data["data"]
    assert "database" in data["data"]
    assert "features" in data["data"]
    assert "limits" in data["data"]
    assert "security" in data["data"]

def test_create_system_backup(client: TestClient, db_session: Session):
    """Test creating a system backup."""
    response = client.post("/api/system/maintenance/backup")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "backup_id" in data["data"]
    assert "timestamp" in data["data"]
    assert "type" in data["data"]
    assert "status" in data["data"]
    assert "size_mb" in data["data"]
    assert "includes" in data["data"]

def test_list_system_backups(client: TestClient, db_session: Session):
    """Test listing system backups."""
    response = client.get("/api/system/maintenance/backups")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert "backups" in data["data"]
    assert "total_backups" in data["data"]
    assert "total_size_mb" in data["data"]
    assert isinstance(data["data"]["backups"], list) 