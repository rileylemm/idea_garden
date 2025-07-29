from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
import psutil
import os
from datetime import datetime, timedelta
from typing import Dict, Any
from pydantic import BaseModel
from app.database import get_db
from app.models.idea import Idea, Document, ActionPlan

router = APIRouter()

# In-memory storage for AI settings (in production, this would be in a database)
_ai_settings_storage = {
    "provider": "openai",
    "model": "gpt-3.5-turbo"
}

class UserPreferences(BaseModel):
    theme: str = "light"
    default_category: str = "general"
    auto_save: bool = True
    notifications_enabled: bool = True
    default_view: str = "dashboard"

class AISettings(BaseModel):
    provider: str = "openai"  # "openai" or "ollama"
    model: str = "gpt-3.5-turbo"

class SystemStats(BaseModel):
    total_ideas: int
    total_documents: int
    total_action_plans: int
    database_size_mb: float
    memory_usage_mb: float
    cpu_usage_percent: float

@router.get("/preferences")
async def get_user_preferences():
    """Get user preferences and settings."""
    try:
        # TODO: Store preferences in database
        # For now, return default preferences
        preferences = {
            "theme": "light",
            "default_category": "general",
            "auto_save": True,
            "notifications_enabled": True,
            "default_view": "dashboard",
            "language": "en",
            "timezone": "UTC",
            "date_format": "YYYY-MM-DD",
            "items_per_page": 20
        }

        return {
            "success": True,
            "data": preferences
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Preferences error: {str(e)}")

@router.put("/preferences")
async def update_user_preferences(
    preferences: UserPreferences
):
    """Update user preferences."""
    try:
        # TODO: Store preferences in database
        return {
            "success": True,
            "data": {
                "updated_preferences": preferences.dict(),
                "timestamp": datetime.now().isoformat()
            },
            "message": "Preferences updated successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Preferences update error: {str(e)}")

@router.get("/ai-settings")
async def get_ai_settings():
    """Get AI settings (provider and model preferences)."""
    try:
        # Return the stored AI settings
        return {
            "success": True,
            "data": _ai_settings_storage
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI settings error: {str(e)}")

@router.put("/ai-settings")
async def update_ai_settings(ai_settings: AISettings):
    """Update AI settings."""
    try:
        # Store the AI settings in memory
        global _ai_settings_storage
        _ai_settings_storage = {
            "provider": ai_settings.provider,
            "model": ai_settings.model
        }
        
        return {
            "success": True,
            "data": {
                "updated_ai_settings": ai_settings.dict(),
                "timestamp": datetime.now().isoformat()
            },
            "message": "AI settings updated successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI settings update error: {str(e)}")

@router.get("/health")
async def get_system_health(db: Session = Depends(get_db)):
    """Get detailed system health information."""
    try:
        # Database health - since we can successfully query the database later, mark as healthy
        db_status = "healthy"

        # System metrics
        memory = psutil.virtual_memory()
        cpu_percent = psutil.cpu_percent(interval=1)
        disk = psutil.disk_usage('/')

        # Database statistics
        total_ideas = db.query(Idea).count()
        total_documents = db.query(Document).count()
        total_action_plans = db.query(ActionPlan).count()

        # Get database file size
        db_file_path = "../data/ideas.db"
        db_size_mb = 0
        if os.path.exists(db_file_path):
            db_size_mb = os.path.getsize(db_file_path) / (1024 * 1024)

        health_data = {
            "status": "healthy" if db_status == "healthy" else "degraded",
            "timestamp": datetime.now().isoformat(),
            "database": {
                "status": db_status,
                "total_ideas": total_ideas,
                "total_documents": total_documents,
                "total_action_plans": total_action_plans,
                "size_mb": round(db_size_mb, 2)
            },
            "system": {
                "memory_usage_percent": memory.percent,
                "memory_available_gb": round(memory.available / (1024**3), 2),
                "cpu_usage_percent": cpu_percent,
                "disk_usage_percent": disk.percent,
                "disk_free_gb": round(disk.free / (1024**3), 2)
            },
            "api": {
                "version": "1.0.0",
                "uptime": "running",  # TODO: Calculate actual uptime
                "endpoints_available": True
            }
        }

        return {
            "success": True,
            "data": health_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check error: {str(e)}")

@router.get("/stats")
async def get_system_statistics(db: Session = Depends(get_db)):
    """Get comprehensive system statistics."""
    try:
        # Basic counts
        total_ideas = db.query(Idea).count()
        total_documents = db.query(Document).count()
        total_action_plans = db.query(ActionPlan).count()

        # Category distribution
        category_stats = db.query(
            Idea.category,
            func.count(Idea.id).label('count')
        ).group_by(Idea.category).all()

        # Status distribution
        status_stats = db.query(
            Idea.status,
            func.count(Idea.id).label('count')
        ).group_by(Idea.status).all()

        # Recent activity (last 7 days)
        recent_ideas = db.query(Idea).filter(
            Idea.created_at >= datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=7)
        ).count()

        # Average ideas per day
        days_since_first_idea = 1  # Default
        first_idea = db.query(Idea).order_by(Idea.created_at).first()
        if first_idea:
            days_since_first_idea = max(1, (datetime.now() - first_idea.created_at).days)
        
        avg_ideas_per_day = round(total_ideas / days_since_first_idea, 2)

        # System performance metrics
        memory = psutil.virtual_memory()
        cpu_percent = psutil.cpu_percent(interval=1)

        stats = {
            "overview": {
                "total_ideas": total_ideas,
                "total_documents": total_documents,
                "total_action_plans": total_action_plans,
                "recent_ideas": recent_ideas,
                "avg_ideas_per_day": avg_ideas_per_day
            },
            "distribution": {
                "categories": [{"category": cat, "count": count} for cat, count in category_stats],
                "statuses": [{"status": status, "count": count} for status, count in status_stats]
            },
            "performance": {
                "memory_usage_percent": memory.percent,
                "cpu_usage_percent": cpu_percent,
                "response_time_ms": 50  # Placeholder
            },
            "growth": {
                "ideas_this_week": recent_ideas,
                "ideas_this_month": db.query(Idea).filter(
                    Idea.created_at >= datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                ).count(),
                "growth_rate": "positive" if recent_ideas > 0 else "stable"
            }
        }

        return {
            "success": True,
            "data": stats
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Statistics error: {str(e)}")

@router.get("/config")
async def get_system_configuration():
    """Get system configuration and settings."""
    try:
        config = {
            "api": {
                "version": "1.0.0",
                "environment": os.getenv("NODE_ENV", "development"),
                "port": int(os.getenv("PORT", 4000)),
                "debug": os.getenv("NODE_ENV") == "development"
            },
            "database": {
                "type": "sqlite",
                "path": "../data/ideas.db",
                "backup_enabled": True,
                "auto_backup_interval_hours": 24
            },
            "features": {
                "ai_enabled": bool(os.getenv("OPENAI_API_KEY")),
                "export_enabled": True,
                "analytics_enabled": True,
                "workflows_enabled": True
            },
            "limits": {
                "max_ideas_per_user": 1000,
                "max_documents_per_idea": 50,
                "max_action_plans_per_idea": 10,
                "max_tags_per_idea": 20
            },
            "security": {
                "cors_enabled": True,
                "rate_limiting": False,
                "authentication": False
            }
        }

        return {
            "success": True,
            "data": config
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Configuration error: {str(e)}")

@router.post("/maintenance/backup")
async def create_system_backup(db: Session = Depends(get_db)):
    """Create a system backup."""
    try:
        import shutil
        import json
        
        # Create backups directory if it doesn't exist
        backup_dir = "../data/backups"
        os.makedirs(backup_dir, exist_ok=True)
        
        # Generate backup ID and paths
        backup_id = f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        db_source = "../data/ideas.db"
        db_backup = f"{backup_dir}/{backup_id}.db"
        metadata_file = f"{backup_dir}/{backup_id}.json"
        
        # Check if source database exists
        if not os.path.exists(db_source):
            raise HTTPException(status_code=404, detail="Database file not found")
        
        # Copy the database file
        shutil.copy2(db_source, db_backup)
        
        # Get actual file size
        backup_size_mb = os.path.getsize(db_backup) / (1024 * 1024)
        
        # Get database statistics for metadata
        total_ideas = db.query(Idea).count()
        total_documents = db.query(Document).count()
        total_action_plans = db.query(ActionPlan).count()
        
        # Create metadata
        metadata = {
            "backup_id": backup_id,
            "timestamp": datetime.now().isoformat(),
            "type": "manual",
            "status": "completed",
            "size_mb": round(backup_size_mb, 2),
            "includes": ["ideas", "documents", "action_plans", "tags"],
            "statistics": {
                "total_ideas": total_ideas,
                "total_documents": total_documents,
                "total_action_plans": total_action_plans
            },
            "source_file": db_source,
            "backup_file": db_backup
        }
        
        # Save metadata
        with open(metadata_file, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        backup_info = {
            "id": backup_id,
            "timestamp": metadata["timestamp"],
            "type": "manual",
            "size_mb": metadata["size_mb"],
            "status": "completed"
        }

        return {
            "success": True,
            "data": backup_info,
            "message": "Backup created successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backup error: {str(e)}")

@router.get("/maintenance/backups")
async def list_system_backups():
    """List available system backups."""
    try:
        import json
        import glob
        
        backup_dir = "../data/backups"
        backups = []
        
        # Create backup directory if it doesn't exist
        os.makedirs(backup_dir, exist_ok=True)
        
        # Find all metadata files
        metadata_files = glob.glob(f"{backup_dir}/*.json")
        
        for metadata_file in metadata_files:
            try:
                with open(metadata_file, 'r') as f:
                    metadata = json.load(f)
                
                # Check if backup file still exists
                backup_file = metadata.get("backup_file", "")
                if os.path.exists(backup_file):
                    backup_info = {
                        "id": metadata["backup_id"],
                        "timestamp": metadata["timestamp"],
                        "type": metadata["type"],
                        "size_mb": metadata["size_mb"],
                        "status": metadata["status"]
                    }
                    backups.append(backup_info)
            except Exception as e:
                print(f"Error reading backup metadata {metadata_file}: {e}")
                continue
        
        # Sort backups by timestamp (newest first)
        backups.sort(key=lambda x: x["timestamp"], reverse=True)
        
        total_size_mb = sum(b["size_mb"] for b in backups)

        return {
            "success": True,
            "data": {
                "backups": backups,
                "total_backups": len(backups),
                "total_size_mb": round(total_size_mb, 2)
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backup listing error: {str(e)}") 