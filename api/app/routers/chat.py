from fastapi import APIRouter

router = APIRouter()

@router.post("/project-overview")
async def project_overview_chat():
    """Stream a conversational project overview chat"""
    return {"message": "Project overview chat endpoint - TODO"}

@router.get("/template/{category}")
async def get_category_template():
    """Get a category-specific document template"""
    return {"message": "Category template endpoint - TODO"}

@router.post("/generate-document")
async def generate_document():
    """Generate a document using AI"""
    return {"message": "Generate document endpoint - TODO"}

@router.post("/save-conversation")
async def save_conversation():
    """Save a chat conversation"""
    return {"message": "Save conversation endpoint - TODO"}

@router.get("/conversation/{idea_id}")
async def load_conversation():
    """Load a saved chat conversation"""
    return {"message": "Load conversation endpoint - TODO"} 