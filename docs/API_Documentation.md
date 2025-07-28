# Idea Garden API Documentation

This document provides comprehensive documentation for the Idea Garden FastAPI backend API.

## 🚀 Migration Status

✅ **Successfully migrated from Node.js/Express to Python/FastAPI**  
✅ **All 106 tests passing**  
✅ **Enhanced error handling and response consistency**  
✅ **Improved performance and type safety**

## Base URL
```
http://localhost:8000
```

## Tech Stack

### Backend (Updated)
- **Python 3.13** with FastAPI for high-performance API
- **SQLAlchemy 2.0** for database ORM
- **Pydantic** for data validation and serialization
- **SQLite** for lightweight, reliable data storage
- **OpenAI API** for semantic embeddings and AI features
- **CORS** enabled for frontend-backend communication
- **Pytest** for comprehensive testing (106 tests passing)

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for beautiful, responsive styling
- **React Router** for seamless navigation
- **Lucide React** for consistent iconography

## Authentication
Currently, the API does not require authentication. All endpoints are publicly accessible.

## Response Format
All API responses follow a consistent format:
```json
{
  "success": true,
  "data": {...},
  "message": "Optional message"
}
```

## Error Responses
```json
{
  "detail": "Error message"
}
```

## Interactive Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Endpoints

### Health Check

#### GET /health
Returns the health status of the API.

**Response:**
```json
{
  "status": "ok",
  "message": "Idea Garden API is running",
  "version": "2.0.0"
}
```

#### GET /
Root endpoint with API information.

**Response:**
```json
{
  "message": "Idea Garden API",
  "version": "2.0.0",
  "docs": "/docs"
}
```

### Ideas

#### GET /api/ideas
Get all ideas with optional filtering.

**Query Parameters:**
- `q` (optional): Search query to filter ideas by title or description
- `category` (optional): Filter by category
- `status` (optional): Filter by status
- `tags` (optional): Filter by tags

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Example Idea",
      "description": "A test idea",
      "content": null,
      "category": "technology",
      "status": "seedling",
      "created_at": "2025-07-28T10:37:08",
      "updated_at": "2025-07-28T10:37:08",
      "tags": [
        {
          "id": 1,
          "name": "test"
        }
      ]
    }
  ]
}
```

#### GET /api/ideas/search
Search ideas by query string.

**Query Parameters:**
- `q` (required): Search query

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Example Idea",
      "description": "A test idea",
      "content": null,
      "category": "technology",
      "status": "seedling",
      "created_at": "2025-07-28T10:37:08",
      "updated_at": "2025-07-28T10:37:08",
      "tags": []
    }
  ]
}
```

#### GET /api/ideas/{idea_id}
Get a specific idea by ID.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Example Idea",
    "description": "A test idea",
    "content": null,
    "category": "technology",
    "status": "seedling",
    "created_at": "2025-07-28T10:37:08",
    "updated_at": "2025-07-28T10:37:08",
    "tags": []
  }
}
```

#### POST /api/ideas
Create a new idea.

**Request Body:**
```json
{
  "title": "New Idea",
  "description": "Description of the idea",
  "content": "Detailed content",
  "category": "technology",
  "status": "seedling",
  "tags": ["tag1", "tag2"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "New Idea",
    "description": "Description of the idea",
    "content": "Detailed content",
    "category": "technology",
    "status": "seedling",
    "created_at": "2025-07-28T10:37:08",
    "updated_at": "2025-07-28T10:37:08",
    "tags": [
      {
        "id": 3,
        "name": "tag1"
      },
      {
        "id": 4,
        "name": "tag2"
      }
    ]
  },
  "message": "Idea created successfully"
}
```

#### PUT /api/ideas/{idea_id}
Update an existing idea.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Request Body:**
```json
{
  "title": "Updated Idea",
  "description": "Updated description",
  "status": "growing",
  "tags": ["updated", "tags"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Idea",
    "description": "Updated description",
    "content": null,
    "category": "technology",
    "status": "growing",
    "created_at": "2025-07-28T10:37:08",
    "updated_at": "2025-07-28T10:43:12",
    "tags": [
      {
        "id": 5,
        "name": "updated"
      },
      {
        "id": 6,
        "name": "tags"
      }
    ]
  },
  "message": "Idea updated successfully"
}
```

#### DELETE /api/ideas/{idea_id}
Delete an idea.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Response:**
```json
{
  "success": true,
  "message": "Idea deleted successfully"
}
```

#### GET /api/ideas/{idea_id}/related
Get AI-powered related ideas using semantic similarity.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Query Parameters:**
- `limit` (optional, default: 5): Number of related ideas to return

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "idea_id": 2,
      "similarity": 0.8,
      "title": "Related Idea",
      "description": "A related idea",
      "category": "technology",
      "status": "seedling"
    }
  ]
}
```

### Documents

#### GET /api/ideas/{idea_id}/documents
Get all documents for an idea.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "idea_id": 1,
      "title": "Research Document",
      "content": "Document content",
      "document_type": "uploaded",
      "conversation_id": null,
      "created_at": "2025-07-28T10:43:12",
      "updated_at": "2025-07-28T10:43:12"
    }
  ]
}
```

#### GET /api/ideas/{idea_id}/documents/{document_id}
Get a specific document.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea
- `document_id` (integer): The ID of the document

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "idea_id": 1,
    "title": "Research Document",
    "content": "Document content",
    "document_type": "uploaded",
    "conversation_id": null,
    "created_at": "2025-07-28T10:43:12",
    "updated_at": "2025-07-28T10:43:12"
  }
}
```

#### POST /api/ideas/{idea_id}/documents
Create a new document for an idea.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Request Body:**
```json
{
  "title": "New Document",
  "content": "Document content",
  "document_type": "uploaded",
  "conversation_id": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "idea_id": 1,
    "title": "New Document",
    "content": "Document content",
    "document_type": "uploaded",
    "conversation_id": null,
    "created_at": "2025-07-28T10:43:12",
    "updated_at": "2025-07-28T10:43:12"
  },
  "message": "Document created successfully"
}
```

#### PUT /api/ideas/{idea_id}/documents/{document_id}
Update a document.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea
- `document_id` (integer): The ID of the document

**Request Body:**
```json
{
  "title": "Updated Document",
  "content": "Updated content"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "idea_id": 1,
    "title": "Updated Document",
    "content": "Updated content",
    "document_type": "uploaded",
    "conversation_id": null,
    "created_at": "2025-07-28T10:43:12",
    "updated_at": "2025-07-28T10:43:12"
  },
  "message": "Document updated successfully"
}
```

#### DELETE /api/ideas/{idea_id}/documents/{document_id}
Delete a document.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea
- `document_id` (integer): The ID of the document

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

### Action Plans

#### GET /api/ideas/{idea_id}/action-plan
Get action plan for an idea.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "idea_id": 1,
    "title": "Action Plan",
    "content": "Plan content",
    "timeline": "2 weeks",
    "vision": "Future vision",
    "resources": "Required resources",
    "constraints": "Project constraints",
    "priority": 1,
    "created_at": "2025-07-28T10:43:30",
    "updated_at": "2025-07-28T10:43:30"
  }
}
```

#### GET /api/ideas/{idea_id}/action-plans/{action_plan_id}
Get a specific action plan.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea
- `action_plan_id` (integer): The ID of the action plan

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "idea_id": 1,
    "title": "Action Plan",
    "content": "Plan content",
    "timeline": "2 weeks",
    "vision": "Future vision",
    "resources": "Required resources",
    "constraints": "Project constraints",
    "priority": 1,
    "created_at": "2025-07-28T10:43:30",
    "updated_at": "2025-07-28T10:43:30"
  }
}
```

#### POST /api/ideas/{idea_id}/action-plans
Create a new action plan for an idea.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Request Body:**
```json
{
  "title": "New Action Plan",
  "content": "Plan content",
  "timeline": "2 weeks",
  "vision": "Future vision",
  "resources": "Required resources",
  "constraints": "Project constraints",
  "priority": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "idea_id": 1,
    "title": "New Action Plan",
    "content": "Plan content",
    "timeline": "2 weeks",
    "vision": "Future vision",
    "resources": "Required resources",
    "constraints": "Project constraints",
    "priority": 1,
    "created_at": "2025-07-28T10:43:30",
    "updated_at": "2025-07-28T10:43:30"
  },
  "message": "Action plan created successfully"
}
```

#### PUT /api/ideas/{idea_id}/action-plans/{action_plan_id}
Update an action plan.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea
- `action_plan_id` (integer): The ID of the action plan

**Request Body:**
```json
{
  "title": "Updated Action Plan",
  "content": "Updated content",
  "priority": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "idea_id": 1,
    "title": "Updated Action Plan",
    "content": "Updated content",
    "timeline": "2 weeks",
    "vision": "Future vision",
    "resources": "Required resources",
    "constraints": "Project constraints",
    "priority": 2,
    "created_at": "2025-07-28T10:43:30",
    "updated_at": "2025-07-28T10:43:12"
  },
  "message": "Action plan updated successfully"
}
```

#### DELETE /api/ideas/{idea_id}/action-plans/{action_plan_id}
Delete an action plan.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea
- `action_plan_id` (integer): The ID of the action plan

**Response:**
```json
{
  "success": true,
  "message": "Action plan deleted successfully"
}
```

### Categories & Tags

#### GET /api/categories
Get all available categories.

**Response:**
```json
{
  "success": true,
  "data": ["technology", "personal", "business", "innovation"]
}
```

#### GET /api/tags
Get all available tags.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "test"
    },
    {
      "id": 2,
      "name": "api"
    }
  ]
}
```

#### POST /api/embeddings/update-all
Update all embeddings (placeholder).

**Response:**
```json
{
  "success": true,
  "message": "Embedding update initiated",
  "note": "This endpoint is a placeholder for future implementation"
}
```

### AI Features

#### POST /api/ai/generate-summary/{idea_id}
Generate an AI-powered summary for an idea.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "AI-generated summary of the idea",
    "key_points": ["Point 1", "Point 2", "Point 3"],
    "recommendations": ["Recommendation 1", "Recommendation 2"]
  }
}
```

#### POST /api/ai/suggest-tags/{idea_id}
Suggest tags for an idea using AI analysis.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Response:**
```json
{
  "success": true,
  "data": {
    "suggested_tags": ["tag1", "tag2", "tag3"],
    "confidence_scores": [0.9, 0.8, 0.7]
  }
}
```

#### POST /api/ai/improve-content/{idea_id}
Suggest improvements for idea content.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Query Parameters:**
- `improvement_type` (optional): "clarity", "structure", or "completeness"

**Response:**
```json
{
  "success": true,
  "data": {
    "improved_content": "Enhanced content with improvements",
    "suggestions": ["Suggestion 1", "Suggestion 2"],
    "improvement_type": "clarity"
  }
}
```

#### POST /api/ai/research-suggestions/{idea_id}
Suggest research topics and resources for an idea.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Response:**
```json
{
  "success": true,
  "data": {
    "research_topics": ["Topic 1", "Topic 2"],
    "resources": ["Resource 1", "Resource 2"],
    "next_steps": ["Step 1", "Step 2"]
  }
}
```

#### POST /api/ai/validate-action-plan/{action_plan_id}
Validate action plan feasibility and suggest improvements.

**Path Parameters:**
- `action_plan_id` (integer): The ID of the action plan

**Response:**
```json
{
  "success": true,
  "data": {
    "feasibility_score": 0.85,
    "suggestions": ["Suggestion 1", "Suggestion 2"],
    "risks": ["Risk 1", "Risk 2"],
    "improvements": ["Improvement 1", "Improvement 2"]
  }
}
```

### Analytics

#### GET /api/analytics/usage
Get usage analytics for the specified period.

**Query Parameters:**
- `period` (optional): "day", "week", "month", or "year"

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "start_date": "2025-06-28T10:37:08",
    "end_date": "2025-07-28T10:37:08",
    "ideas_created": 15,
    "categories": [{"category": "technology", "count": 8}],
    "statuses": [{"status": "seedling", "count": 10}],
    "total_ideas": 25,
    "total_documents": 12,
    "total_action_plans": 8
  }
}
```

#### GET /api/analytics/ideas/{idea_id}/insights
Get detailed insights for a specific idea.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Response:**
```json
{
  "success": true,
  "data": {
    "idea_id": 1,
    "growth_progress": 0.75,
    "document_count": 3,
    "action_plan_count": 1,
    "time_in_current_stage": 15,
    "related_ideas": 5
  }
}
```

#### GET /api/analytics/growth-patterns
Get growth patterns and trends.

**Response:**
```json
{
  "success": true,
  "data": {
    "category_growth": [{"category": "technology", "growth": 0.25}],
    "monthly_trends": [{"month": "2025-07", "ideas": 15}],
    "stage_averages": [{"stage": "seedling", "avg_days": 12}]
  }
}
```

### Search

#### GET /api/search/semantic
Perform semantic search across ideas using AI embeddings.

**Query Parameters:**
- `q` (required): Search query
- `limit` (optional): Number of results to return

**Response:**
```json
{
  "success": true,
  "data": {
    "query": "technology",
    "results": [
      {
        "id": 1,
        "title": "AI-powered app",
        "description": "An AI-powered application",
        "category": "technology",
        "status": "seedling",
        "relevance_score": 0.85,
        "tags": [{"id": 1, "name": "ai"}]
      }
    ],
    "total_results": 5
  }
}
```

#### GET /api/search/ideas/filter
Advanced filtering and sorting for ideas.

**Query Parameters:**
- `q` (optional): Search query
- `category` (optional): Filter by category
- `status` (optional): Filter by status
- `tags` (optional): Comma-separated tags
- `date_from` (optional): Start date (YYYY-MM-DD)
- `date_to` (optional): End date (YYYY-MM-DD)
- `sort_by` (optional): Sort field
- `sort_order` (optional): "asc" or "desc"
- `limit` (optional): Number of results
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "ideas": [
      {
        "id": 1,
        "title": "Example Idea",
        "description": "A test idea",
        "category": "technology",
        "status": "seedling",
        "created_at": "2025-07-28T10:37:08",
        "updated_at": "2025-07-28T10:37:08",
        "tags": [{"id": 1, "name": "test"}]
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 50,
      "offset": 0,
      "has_more": false
    },
    "filters_applied": {
      "query": null,
      "category": null,
      "status": null,
      "tags": null,
      "date_from": null,
      "date_to": null
    }
  }
}
```

#### GET /api/search/ideas/{idea_id}/recommendations
Get AI-powered recommendations for related ideas.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Query Parameters:**
- `limit` (optional): Number of recommendations

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": 2,
        "title": "Related Idea",
        "description": "A related idea",
        "similarity_score": 0.85,
        "reasoning": "Similar technology focus"
      }
    ],
    "total_recommendations": 5
  }
}
```

### Export

#### GET /api/export/ideas
Export ideas in various formats.

**Query Parameters:**
- `format` (optional): "json", "csv", or "markdown"
- `category` (optional): Filter by category
- `status` (optional): Filter by status
- `tags` (optional): Comma-separated tags

**Response (JSON):**
```json
{
  "success": true,
  "data": {
    "export_date": "2025-07-28T10:37:08",
    "total_ideas": 25,
    "ideas": [
      {
        "id": 1,
        "title": "Example Idea",
        "description": "A test idea",
        "content": "Detailed content",
        "category": "technology",
        "status": "seedling",
        "created_at": "2025-07-28T10:37:08",
        "updated_at": "2025-07-28T10:37:08",
        "tags": [{"id": 1, "name": "test"}]
      }
    ]
  }
}
```

#### GET /api/export/idea/{idea_id}/full
Export a complete idea with all related data.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Query Parameters:**
- `format` (optional): "json", "markdown", or "html"

**Response (JSON):**
```json
{
  "success": true,
  "data": {
    "idea": {
      "id": 1,
      "title": "Example Idea",
      "description": "A test idea",
      "content": "Detailed content",
      "category": "technology",
      "status": "seedling",
      "created_at": "2025-07-28T10:37:08",
      "updated_at": "2025-07-28T10:37:08",
      "tags": [{"id": 1, "name": "test"}]
    },
    "documents": [
      {
        "id": 1,
        "title": "Research Document",
        "content": "Document content",
        "document_type": "uploaded",
        "created_at": "2025-07-28T10:43:12"
      }
    ],
    "action_plans": [
      {
        "id": 1,
        "title": "Action Plan",
        "content": "Plan content",
        "timeline": "2 weeks",
        "vision": "Future vision",
        "resources": "Required resources",
        "constraints": "Project constraints",
        "priority": 1,
        "created_at": "2025-07-28T10:43:30"
      }
    ]
  }
}
```

#### POST /api/export/import/ideas
Import ideas from JSON data.

**Request Body:**
```json
[
  {
    "title": "Imported Idea",
    "description": "An imported idea",
    "category": "technology",
    "status": "seedling",
    "tags": ["imported", "test"]
  }
]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "imported_count": 1,
    "total_attempted": 1,
    "errors": []
  },
  "message": "Successfully imported 1 ideas"
}
```

### Workflows

#### POST /api/workflows/idea-matured
Trigger actions when an idea reaches 'mature' status.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Response:**
```json
{
  "success": true,
  "data": {
    "idea_id": 1,
    "idea_title": "Mature Idea",
    "actions_taken": ["Created auto-generated action plan"],
    "suggestions": [
      "Review and refine the implementation strategy",
      "Identify key stakeholders and team members"
    ],
    "workflow_completed": true
  }
}
```

#### POST /api/workflows/periodic-review
Trigger periodic review for ideas that haven't been updated recently.

**Query Parameters:**
- `days_old` (optional): Number of days to consider stale (default: 30)

**Response:**
```json
{
  "success": true,
  "data": {
    "stale_ideas_count": 5,
    "reviewed_ideas": [
      {
        "id": 1,
        "title": "Stale Idea",
        "days_since_update": 45
      }
    ],
    "actions_taken": ["Sent reminder notifications"]
  }
}
```

#### POST /api/workflows/automation/rules
Create an automation rule.

**Request Body:**
```json
{
  "name": "Auto-tag technology ideas",
  "trigger_type": "idea_created",
  "conditions": {"category": "technology"},
  "actions": ["add_tag:tech", "set_priority:high"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "rule_id": "rule_1",
    "name": "Auto-tag technology ideas",
    "trigger_type": "idea_created",
    "conditions": {"category": "technology"},
    "actions": ["add_tag:tech", "set_priority:high"],
    "active": true
  }
}
```

#### GET /api/workflows/automation/rules
List all automation rules.

**Response:**
```json
{
  "success": true,
  "data": {
    "rules": [
      {
        "id": "rule_1",
        "name": "Auto-tag technology ideas",
        "trigger_type": "idea_created",
        "conditions": {"category": "technology"},
        "actions": ["add_tag:tech"],
        "active": true
      }
    ],
    "total_rules": 1
  }
}
```

#### POST /api/workflows/workflows/trigger
Trigger a custom workflow.

**Request Body:**
```json
{
  "trigger_type": "idea_updated",
  "idea_id": 1,
  "metadata": {"new_status": "growing"}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trigger_type": "idea_updated",
    "idea_id": 1,
    "idea_title": "Updated Idea",
    "actions_executed": ["Growth milestone reached"],
    "metadata": {"new_status": "growing"}
  }
}
```

#### GET /api/workflows/workflows/status
Get the status of all workflows and automation rules.

**Response:**
```json
{
  "success": true,
  "data": {
    "workflow_statistics": {
      "total_ideas": 25,
      "mature_ideas": 5,
      "growing_ideas": 10,
      "seedling_ideas": 10,
      "recent_activity": 8
    },
    "automation_status": {
      "active_rules": 3,
      "last_execution": "2025-07-28T10:37:08",
      "next_scheduled": "2025-07-29T10:37:08"
    }
  }
}
```

### System

#### GET /api/system/preferences
Get user preferences.

**Response:**
```json
{
  "success": true,
  "data": {
    "theme": "light",
    "default_category": "technology",
    "auto_save": true,
    "notifications": true
  }
}
```

#### PUT /api/system/preferences
Update user preferences.

**Request Body:**
```json
{
  "theme": "dark",
  "default_category": "business",
  "auto_save": true,
  "notifications": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "updated_preferences": {
      "theme": "dark",
      "default_category": "business",
      "auto_save": true,
      "notifications": false
    }
  },
  "message": "Preferences updated successfully"
}
```

#### GET /api/system/health
Get system health information.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "database": "connected",
    "api_version": "2.0.0",
    "uptime": "2 days, 3 hours",
    "memory_usage": "45.2 MB"
  }
}
```

#### GET /api/system/statistics
Get system statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_ideas": 25,
    "total_documents": 12,
    "total_action_plans": 8,
    "active_users": 1,
    "storage_used": "2.5 MB",
    "api_requests_today": 150
  }
}
```

#### GET /api/system/configuration
Get system configuration.

**Response:**
```json
{
  "success": true,
  "data": {
    "environment": "development",
    "database_url": "sqlite:///./idea_garden.db",
    "cors_origins": ["http://localhost:5173"],
    "max_file_size": "10MB",
    "rate_limit": "disabled"
  }
}
```

#### POST /api/system/backup
Create a system backup.

**Response:**
```json
{
  "success": true,
  "data": {
    "backup_id": "backup_20250728_103708",
    "backup_path": "/backups/backup_20250728_103708.zip",
    "backup_size": "1.2 MB",
    "created_at": "2025-07-28T10:37:08"
  },
  "message": "Backup created successfully"
}
```

#### GET /api/system/backups
List all system backups.

**Response:**
```json
{
  "success": true,
  "data": {
    "backups": [
      {
        "backup_id": "backup_20250728_103708",
        "backup_path": "/backups/backup_20250728_103708.zip",
        "backup_size": "1.2 MB",
        "created_at": "2025-07-28T10:37:08"
      }
    ],
    "total_backups": 1
  }
}
```

### Chat (Placeholder Endpoints)

#### POST /api/chat/project-overview
Stream a conversational project overview chat.

**Response:**
```json
{
  "message": "Project overview chat endpoint - TODO"
}
```

#### GET /api/chat/template/{category}
Get a category-specific document template.

**Path Parameters:**
- `category` (string): The category name

**Response:**
```json
{
  "message": "Category template endpoint - TODO"
}
```

#### POST /api/chat/generate-document
Generate a document using AI.

**Response:**
```json
{
  "message": "Generate document endpoint - TODO"
}
```

#### POST /api/chat/save-conversation
Save a chat conversation.

**Response:**
```json
{
  "message": "Save conversation endpoint - TODO"
}
```

#### GET /api/chat/conversation/{idea_id}
Load a saved chat conversation.

**Path Parameters:**
- `idea_id` (integer): The ID of the idea

**Response:**
```json
{
  "message": "Load conversation endpoint - TODO"
}
```

## Error Codes

- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

Currently, there is no rate limiting implemented.

## CORS

The API allows CORS from all origins for development purposes.

## Testing

The API includes comprehensive test coverage with 106 tests:

```bash
# Run all tests
cd api
source venv/bin/activate
python -m pytest tests/ -v

# Run specific test modules
python -m pytest tests/test_ideas.py -v
python -m pytest tests/test_ai.py -v
python -m pytest tests/test_analytics.py -v
```

## Development

### Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Testing
```bash
# Run tests
python -m pytest tests/ -v

# Run with coverage
python -m pytest tests/ --cov=app --cov-report=html
```

### Database
```bash
# Create database tables
python -c "from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine)"
``` 