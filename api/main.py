from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Idea Garden API",
    description="A comprehensive API for managing ideas, documents, and AI-powered features",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "message": "Idea Garden API is running",
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Idea Garden API",
        "docs": "/docs",
        "health": "/health"
    }

# Import and include routers
from app.routers import ideas, documents, action_plans, chat, categories, analytics, search, export, ai, workflows, system

app.include_router(ideas.router, prefix="/api", tags=["ideas"])
app.include_router(documents.router, prefix="/api", tags=["documents"])
app.include_router(action_plans.router, prefix="/api", tags=["action-plans"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(categories.router, prefix="/api", tags=["categories"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(search.router, prefix="/api/search", tags=["search"])
app.include_router(export.router, prefix="/api/export", tags=["export"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(workflows.router, prefix="/api/workflows", tags=["workflows"])
app.include_router(system.router, prefix="/api/system", tags=["system"])

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 4000))
    uvicorn.run(app, host="0.0.0.0", port=port) 