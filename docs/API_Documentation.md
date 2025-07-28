# Idea Garden API Documentation

This document provides comprehensive documentation for the Idea Garden FastAPI backend API.

## Base URL
```
http://localhost:4000
```

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

## Endpoints

### Health Check

#### GET /health
Returns the health status of the API.

**Response:**
```json
{
  "status": "ok",
  "message": "Idea Garden API is running",
  "version": "1.0.0"
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

## Interactive Documentation

- **Swagger UI**: http://localhost:4000/docs
- **ReDoc**: http://localhost:4000/redoc 