from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.idea import Idea, Document
from app.services.ai_service import ai_service, ChatRequest, DocumentGenerationRequest, Message
from typing import List, Dict, Any
import json
import asyncio

router = APIRouter()

@router.post("/project-overview")
async def project_overview_chat(request: Request):
    """Stream a conversational project overview chat"""
    try:
        # Parse request body
        body = await request.json()
        
        # Convert messages to our format
        messages = []
        for msg in body.get('messages', []):
            messages.append(Message(
                role=msg.get('type', 'user'),  # Map 'type' to 'role'
                content=msg.get('content', '')
            ))
        
        # Create chat request
        chat_request = ChatRequest(
            messages=messages,
            idea=body.get('idea', {}),
            documents=body.get('documents', []),
            tone=body.get('tone', 'warm'),
            model_provider=body.get('model_provider', 'openai'),
            model_name=body.get('model_name', 'gpt-3.5-turbo')
        )
        
        # Stream the response
        async def generate_stream():
            async for chunk in ai_service.stream_chat(chat_request):
                yield f"data: {json.dumps({'content': chunk})}\n\n"
            yield "data: [DONE]\n\n"
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@router.get("/template/{category}")
async def get_category_template(category: str):
    """Get a category-specific document template"""
    try:
        # Define templates for different categories
        templates = {
            "technology": """# {projectTitle}

## Concept Overview
{description}

## Technical Approach
- Core technologies and frameworks
- Architecture and system design
- Development methodology

## Target Users
- Primary user personas
- User needs and pain points
- Market opportunity

## Implementation Plan
- Development phases and milestones
- Key deliverables and features
- Success metrics and KPIs

## Technical Requirements
- Infrastructure needs
- Third-party integrations
- Security considerations

## Timeline & Next Steps
- Immediate next actions
- Short-term goals (1-3 months)
- Long-term vision (6-12 months)

---

*Generated collaboratively on {date}. This is a living document.*""",

            "business": """# {projectTitle}

## Business Concept
{description}

## Market Opportunity
- Target market size and segments
- Competitive landscape
- Unique value proposition

## Business Model
- Revenue streams and pricing
- Cost structure and profitability
- Key partnerships and resources

## Go-to-Market Strategy
- Customer acquisition approach
- Marketing and sales channels
- Growth and scaling plans

## Financial Projections
- Revenue forecasts
- Funding requirements
- Key financial metrics

## Success Metrics
- Key performance indicators
- Milestones and checkpoints
- Risk mitigation strategies

---

*Generated collaboratively on {date}. This is a living document.*""",

            "creative": """# {projectTitle}

## Creative Vision
{description}

## Artistic Direction
- Visual style and aesthetic
- Creative influences and inspiration
- Target audience and appeal

## Content Strategy
- Core themes and messages
- Content formats and mediums
- Distribution channels

## Production Plan
- Creative process and workflow
- Resource requirements
- Timeline and milestones

## Impact Goals
- Desired outcomes and effects
- Success metrics and feedback
- Long-term creative vision

## Next Steps
- Immediate creative tasks
- Short-term projects
- Future development ideas

---

*Generated collaboratively on {date}. This is a living document.*""",

            "general": """# {projectTitle}

## Concept Overview
{description}

## Core Value
- What makes this project unique
- Target audience and user needs
- Key benefits and value proposition

## Implementation Approach
- How the project will be built
- Timeline and key milestones
- Resources and requirements

## Success Metrics
- Key performance indicators
- User engagement and satisfaction
- Project impact and outcomes

## What Happens Next
- Immediate next actions
- Short-term goals
- Long-term vision

---

*Generated collaboratively on {date}. This is a living document.*"""
        }
        
        template = templates.get(category.lower(), templates["general"])
        
        return {
            "success": True,
            "template": template,
            "category": category
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Template error: {str(e)}")

@router.post("/generate-document")
async def generate_document(request: Request):
    """Generate a document using AI"""
    try:
        # Parse request body
        body = await request.json()
        
        # Convert messages to our format
        messages = []
        for msg in body.get('messages', []):
            messages.append(Message(
                role=msg.get('type', 'user'),  # Map 'type' to 'role'
                content=msg.get('content', '')
            ))
        
        # Create document generation request
        doc_request = DocumentGenerationRequest(
            messages=messages,
            idea=body.get('idea', {}),
            documents=body.get('documents', []),
            template=body.get('template', ''),
            tone=body.get('tone', 'warm'),
            model_provider=body.get('model_provider', 'openai'),
            model_name=body.get('model_name', 'gpt-3.5-turbo')
        )
        
        # Generate document
        document_content = await ai_service.generate_document(doc_request)
        
        return {
            "success": True,
            "document": document_content
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document generation error: {str(e)}")

@router.post("/save-conversation")
async def save_conversation(request: Request):
    """Save a chat conversation"""
    try:
        body = await request.json()
        
        # TODO: Implement conversation saving to database
        # For now, just return success
        return {
            "success": True,
            "message": "Conversation saved successfully",
            "conversation_id": "temp_id_123"  # Placeholder
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Save conversation error: {str(e)}")

@router.get("/conversation/{idea_id}")
async def load_conversation(idea_id: int, db: Session = Depends(get_db)):
    """Load a saved chat conversation"""
    try:
        # TODO: Implement conversation loading from database
        # For now, return empty conversation
        return {
            "success": True,
            "conversation": [],
            "idea_id": idea_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Load conversation error: {str(e)}")

@router.get("/models")
async def get_available_models():
    """Get available AI models for each provider"""
    try:
        models = ai_service.get_available_models()
        return {
            "success": True,
            "models": models
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Get models error: {str(e)}") 