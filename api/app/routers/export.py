from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import and_
import json
import csv
import io
from datetime import datetime
from typing import List, Optional
from app.database import get_db
from app.models.idea import Idea, Document, ActionPlan, Tag
from app.schemas.idea import IdeaCreate

router = APIRouter()

@router.get("/ideas")
async def export_ideas(
    format: str = Query("json", description="Export format (json, csv, markdown)"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status"),
    tags: Optional[str] = Query(None, description="Comma-separated tags"),
    db: Session = Depends(get_db)
):
    """Export ideas in various formats."""
    query = db.query(Idea)

    try:

        # Apply filters
        if category:
            query = query.filter(Idea.category == category)
        if status:
            query = query.filter(Idea.status == status)
        if tags:
            tag_list = [tag.strip() for tag in tags.split(",")]
            query = query.join(Idea.tags).filter(Tag.name.in_(tag_list))

        ideas = query.all()

        if format == "json":
            data = {
                "export_date": datetime.now().isoformat(),
                "total_ideas": len(ideas),
                "ideas": [
                    {
                        "id": idea.id,
                        "title": idea.title,
                        "description": idea.description,
                        "content": idea.content,
                        "category": idea.category,
                        "status": idea.status,
                        "created_at": idea.created_at.isoformat(),
                        "updated_at": idea.updated_at.isoformat(),
                        "tags": [{"id": tag.id, "name": tag.name} for tag in idea.tags]
                    } for idea in ideas
                ]
            }
            return {"success": True, "data": data}

        elif format == "csv":
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(["ID", "Title", "Description", "Category", "Status", "Created", "Updated", "Tags"])
            
            for idea in ideas:
                tags_str = ", ".join([tag.name for tag in idea.tags])
                writer.writerow([
                    idea.id,
                    idea.title,
                    idea.description or "",
                    idea.category,
                    idea.status,
                    idea.created_at.isoformat(),
                    idea.updated_at.isoformat(),
                    tags_str
                ])
            
            output.seek(0)
            return StreamingResponse(
                io.BytesIO(output.getvalue().encode()),
                media_type="text/csv",
                headers={"Content-Disposition": f"attachment; filename=ideas_export_{datetime.now().strftime('%Y%m%d')}.csv"}
            )

        elif format == "markdown":
            md_content = f"# Ideas Export\n\n*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
            md_content += f"Total Ideas: {len(ideas)}\n\n"
            
            for idea in ideas:
                tags_str = ", ".join([f"`{tag.name}`" for tag in idea.tags])
                md_content += f"## {idea.title}\n\n"
                md_content += f"**Category:** {idea.category}  \n"
                md_content += f"**Status:** {idea.status}  \n"
                md_content += f"**Created:** {idea.created_at.strftime('%Y-%m-%d')}  \n"
                md_content += f"**Tags:** {tags_str}  \n\n"
                
                if idea.description:
                    md_content += f"{idea.description}\n\n"
                
                if idea.content:
                    md_content += f"### Content\n\n{idea.content}\n\n"
                
                md_content += "---\n\n"
            
            return StreamingResponse(
                io.BytesIO(md_content.encode()),
                media_type="text/markdown",
                headers={"Content-Disposition": f"attachment; filename=ideas_export_{datetime.now().strftime('%Y%m%d')}.md"}
            )

        else:
            raise HTTPException(status_code=400, detail="Unsupported format")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export error: {str(e)}")

@router.get("/idea/{idea_id}/full")
async def export_full_idea(
    idea_id: int,
    format: str = Query("json", description="Export format (json, markdown, html)"),
    db: Session = Depends(get_db)
):
    """Export a complete idea with all related data."""
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    try:

        # Get related documents and action plans
        documents = db.query(Document).filter(Document.idea_id == idea_id).all()
        action_plans = db.query(ActionPlan).filter(ActionPlan.idea_id == idea_id).all()

        if format == "json":
            data = {
                "idea": {
                    "id": idea.id,
                    "title": idea.title,
                    "description": idea.description,
                    "content": idea.content,
                    "category": idea.category,
                    "status": idea.status,
                    "created_at": idea.created_at.isoformat(),
                    "updated_at": idea.updated_at.isoformat(),
                    "tags": [{"id": tag.id, "name": tag.name} for tag in idea.tags]
                },
                "documents": [
                    {
                        "id": doc.id,
                        "title": doc.title,
                        "content": doc.content,
                        "document_type": doc.document_type,
                        "created_at": doc.created_at.isoformat()
                    } for doc in documents
                ],
                "action_plans": [
                    {
                        "id": plan.id,
                        "title": plan.title,
                        "content": plan.content,
                        "timeline": plan.timeline,
                        "vision": plan.vision,
                        "resources": plan.resources,
                        "constraints": plan.constraints,
                        "priority": plan.priority,
                        "created_at": plan.created_at.isoformat()
                    } for plan in action_plans
                ]
            }
            return {"success": True, "data": data}

        elif format == "markdown":
            md_content = f"# {idea.title}\n\n"
            md_content += f"**Category:** {idea.category}  \n"
            md_content += f"**Status:** {idea.status}  \n"
            md_content += f"**Created:** {idea.created_at.strftime('%Y-%m-%d')}  \n"
            md_content += f"**Tags:** {', '.join([tag.name for tag in idea.tags])}  \n\n"
            
            if idea.description:
                md_content += f"## Description\n\n{idea.description}\n\n"
            
            if idea.content:
                md_content += f"## Content\n\n{idea.content}\n\n"
            
            if documents:
                md_content += "## Documents\n\n"
                for doc in documents:
                    md_content += f"### {doc.title}\n\n"
                    md_content += f"*Type: {doc.document_type}*\n\n"
                    md_content += f"{doc.content}\n\n"
            
            if action_plans:
                md_content += "## Action Plans\n\n"
                for plan in action_plans:
                    md_content += f"### {plan.title}\n\n"
                    md_content += f"**Timeline:** {plan.timeline}  \n"
                    md_content += f"**Priority:** {plan.priority}  \n"
                    md_content += f"**Vision:** {plan.vision}  \n"
                    md_content += f"**Resources:** {plan.resources}  \n"
                    md_content += f"**Constraints:** {plan.constraints}  \n\n"
                    md_content += f"{plan.content}\n\n"
            
            return StreamingResponse(
                io.BytesIO(md_content.encode()),
                media_type="text/markdown",
                headers={"Content-Disposition": f"attachment; filename=idea_{idea_id}_{datetime.now().strftime('%Y%m%d')}.md"}
            )

        elif format == "html":
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>{idea.title}</title>
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 40px; }}
                    .header {{ border-bottom: 2px solid #333; padding-bottom: 10px; }}
                    .section {{ margin: 20px 0; }}
                    .tag {{ background: #f0f0f0; padding: 2px 8px; border-radius: 12px; margin: 2px; }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>{idea.title}</h1>
                    <p><strong>Category:</strong> {idea.category} | <strong>Status:</strong> {idea.status}</p>
                    <p><strong>Created:</strong> {idea.created_at.strftime('%Y-%m-%d')}</p>
                    <p><strong>Tags:</strong> {', '.join([f'<span class="tag">{tag.name}</span>' for tag in idea.tags])}</p>
                </div>
            """
            
            if idea.description:
                html_content += f'<div class="section"><h2>Description</h2><p>{idea.description}</p></div>'
            
            if idea.content:
                html_content += f'<div class="section"><h2>Content</h2><p>{idea.content}</p></div>'
            
            if documents:
                html_content += '<div class="section"><h2>Documents</h2>'
                for doc in documents:
                    html_content += f'<h3>{doc.title}</h3><p><em>Type: {doc.document_type}</em></p><p>{doc.content}</p>'
                html_content += '</div>'
            
            if action_plans:
                html_content += '<div class="section"><h2>Action Plans</h2>'
                for plan in action_plans:
                    html_content += f'''
                    <h3>{plan.title}</h3>
                    <p><strong>Timeline:</strong> {plan.timeline} | <strong>Priority:</strong> {plan.priority}</p>
                    <p><strong>Vision:</strong> {plan.vision}</p>
                    <p><strong>Resources:</strong> {plan.resources}</p>
                    <p><strong>Constraints:</strong> {plan.constraints}</p>
                    <p>{plan.content}</p>
                    '''
                html_content += '</div>'
            
            html_content += '</body></html>'
            
            return StreamingResponse(
                io.BytesIO(html_content.encode()),
                media_type="text/html",
                headers={"Content-Disposition": f"attachment; filename=idea_{idea_id}_{datetime.now().strftime('%Y%m%d')}.html"}
            )

        else:
            raise HTTPException(status_code=400, detail="Unsupported format")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export error: {str(e)}")

@router.post("/import/ideas")
async def import_ideas(
    ideas_data: List[dict],
    db: Session = Depends(get_db)
):
    """Import ideas from JSON data."""
    try:
        imported_count = 0
        errors = []

        for idea_data in ideas_data:
            try:
                # Check for duplicates based on title
                existing = db.query(Idea).filter(Idea.title == idea_data.get("title")).first()
                if existing:
                    errors.append(f"Duplicate idea: {idea_data.get('title')}")
                    continue

                # Create new idea
                idea = Idea(
                    title=idea_data.get("title"),
                    description=idea_data.get("description"),
                    content=idea_data.get("content"),
                    category=idea_data.get("category", "general"),
                    status=idea_data.get("status", "seedling")
                )
                db.add(idea)
                db.flush()  # Get the ID

                # Add tags
                if "tags" in idea_data:
                    for tag_name in idea_data["tags"]:
                        tag = db.query(Tag).filter(Tag.name == tag_name).first()
                        if not tag:
                            tag = Tag(name=tag_name)
                            db.add(tag)
                        idea.tags.append(tag)

                imported_count += 1

            except Exception as e:
                errors.append(f"Error importing idea '{idea_data.get('title', 'Unknown')}': {str(e)}")

        db.commit()

        return {
            "success": True,
            "data": {
                "imported_count": imported_count,
                "total_attempted": len(ideas_data),
                "errors": errors
            },
            "message": f"Successfully imported {imported_count} ideas"
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Import error: {str(e)}") 