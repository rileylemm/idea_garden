# 🌱 Idea Garden API Documentation

## Overview

The Idea Garden API provides a comprehensive REST API for managing ideas, documents, action plans, and AI-powered features. The API is built with Express.js and uses SQLite for data persistence.

**Base URL:** `http://localhost:4000/api`

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {...},
  "message": "Optional message",
  "error": "Error message (if success: false)"
}
```

## Endpoints

### Health Check

#### GET `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Idea Garden API is running"
}
```

---

## Ideas

### Get All Ideas

#### GET `/ideas`

Retrieve all ideas with optional filtering.

**Query Parameters:**
- `q` (string, optional): Search query
- `category` (string, optional): Filter by category
- `status` (string, optional): Filter by status (seedling, growing, mature)
- `tags` (string, optional): Filter by tags

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Flower Gifting App",
      "description": "An app for sharing digital flowers",
      "content": "Detailed content...",
      "category": "technology",
      "status": "seedling",
      "created_at": "2025-01-24T10:00:00Z",
      "updated_at": "2025-01-24T10:00:00Z",
      "tags": [
        { "id": 1, "name": "mobile" },
        { "id": 2, "name": "social" }
      ]
    }
  ]
}
```

### Get Idea by ID

#### GET `/ideas/:id`

Retrieve a specific idea by its ID.

**Parameters:**
- `id` (number): Idea ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Flower Gifting App",
    "description": "An app for sharing digital flowers",
    "content": "Detailed content...",
    "category": "technology",
    "status": "seedling",
    "created_at": "2025-01-24T10:00:00Z",
    "updated_at": "2025-01-24T10:00:00Z",
    "tags": [
      { "id": 1, "name": "mobile" },
      { "id": 2, "name": "social" }
    ]
  }
}
```

### Create Idea

#### POST `/ideas`

Create a new idea.

**Request Body:**
```json
{
  "title": "New Idea Title",
  "description": "Optional description",
  "content": "Optional detailed content",
  "category": "technology",
  "status": "seedling",
  "tags": ["mobile", "social"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "New Idea Title",
    "description": "Optional description",
    "content": "Optional detailed content",
    "category": "technology",
    "status": "seedling",
    "created_at": "2025-01-24T10:00:00Z",
    "updated_at": "2025-01-24T10:00:00Z",
    "tags": [
      { "id": 1, "name": "mobile" },
      { "id": 2, "name": "social" }
    ]
  },
  "message": "Idea created successfully"
}
```

### Update Idea

#### PUT `/ideas/:id`

Update an existing idea.

**Parameters:**
- `id` (number): Idea ID

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "content": "Updated content",
  "category": "business",
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
    "title": "Updated Title",
    "description": "Updated description",
    "content": "Updated content",
    "category": "business",
    "status": "growing",
    "created_at": "2025-01-24T10:00:00Z",
    "updated_at": "2025-01-24T11:00:00Z",
    "tags": [
      { "id": 3, "name": "updated" },
      { "id": 4, "name": "tags" }
    ]
  },
  "message": "Idea updated successfully"
}
```

### Delete Idea

#### DELETE `/ideas/:id`

Delete an idea and all associated data.

**Parameters:**
- `id` (number): Idea ID

**Response:**
```json
{
  "success": true,
  "message": "Idea deleted successfully"
}
```

### Search Ideas

#### GET `/ideas/search`

Search ideas by query string.

**Query Parameters:**
- `q` (string, required): Search query

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Flower Gifting App",
      "description": "An app for sharing digital flowers",
      "category": "technology",
      "status": "seedling"
    }
  ]
}
```

### Get Related Ideas

#### GET `/ideas/:id/related`

Get AI-powered related ideas using semantic similarity.

**Parameters:**
- `id` (number): Idea ID

**Query Parameters:**
- `limit` (number, optional): Number of related ideas to return (default: 5)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "idea_id": 2,
      "similarity": 0.85,
      "title": "Plant Care App",
      "description": "App for tracking plant health",
      "category": "technology",
      "status": "growing"
    }
  ]
}
```

---

## Documents

### Get Documents for Idea

#### GET `/ideas/:ideaId/documents`

Get all documents associated with an idea.

**Parameters:**
- `ideaId` (number): Idea ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "idea_id": 1,
      "title": "Research Notes",
      "content": "Document content...",
      "document_type": "uploaded",
      "created_at": "2025-01-24T10:00:00Z",
      "updated_at": "2025-01-24T10:00:00Z"
    }
  ]
}
```

### Get Document by ID

#### GET `/ideas/:ideaId/documents/:documentId`

Get a specific document.

**Parameters:**
- `ideaId` (number): Idea ID
- `documentId` (number): Document ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "idea_id": 1,
    "title": "Research Notes",
    "content": "Document content...",
    "document_type": "uploaded",
    "created_at": "2025-01-24T10:00:00Z",
    "updated_at": "2025-01-24T10:00:00Z"
  }
}
```

### Create Document

#### POST `/ideas/:ideaId/documents`

Create a new document for an idea.

**Parameters:**
- `ideaId` (number): Idea ID

**Request Body:**
```json
{
  "title": "New Document",
  "content": "Document content...",
  "document_type": "uploaded"
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
    "content": "Document content...",
    "document_type": "uploaded",
    "created_at": "2025-01-24T10:00:00Z",
    "updated_at": "2025-01-24T10:00:00Z"
  },
  "message": "Document created successfully"
}
```

### Update Document

#### PUT `/ideas/:ideaId/documents/:documentId`

Update an existing document.

**Parameters:**
- `ideaId` (number): Idea ID
- `documentId` (number): Document ID

**Request Body:**
```json
{
  "title": "Updated Document Title",
  "content": "Updated content..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "idea_id": 1,
    "title": "Updated Document Title",
    "content": "Updated content...",
    "document_type": "uploaded",
    "created_at": "2025-01-24T10:00:00Z",
    "updated_at": "2025-01-24T11:00:00Z"
  },
  "message": "Document updated successfully"
}
```

### Delete Document

#### DELETE `/ideas/:ideaId/documents/:documentId`

Delete a document.

**Parameters:**
- `ideaId` (number): Idea ID
- `documentId` (number): Document ID

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

## Document Versioning

### Get Document Versions

#### GET `/documents/:documentId/versions`

Get all versions of a document.

**Parameters:**
- `documentId` (number): Document ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "document_id": 1,
      "version_number": 1,
      "content": "Original content",
      "created_at": "2025-01-24T10:00:00Z",
      "created_by": "user"
    }
  ]
}
```

### Get Document Version

#### GET `/documents/:documentId/versions/:versionNumber`

Get a specific version of a document.

**Parameters:**
- `documentId` (number): Document ID
- `versionNumber` (number): Version number

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "document_id": 1,
    "version_number": 1,
    "content": "Original content",
    "created_at": "2025-01-24T10:00:00Z",
    "created_by": "user"
  }
}
```

---

## Action Plans

### Get Action Plan for Idea

#### GET `/ideas/:ideaId/action-plan`

Get the current action plan for an idea.

**Parameters:**
- `ideaId` (number): Idea ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "idea_id": 1,
    "title": "Development Plan",
    "content": "Action plan content...",
    "timeline": "2 months",
    "vision": "Long-term vision...",
    "resources": "Required resources...",
    "constraints": "Known constraints...",
    "priority": 1,
    "created_at": "2025-01-24T10:00:00Z",
    "updated_at": "2025-01-24T10:00:00Z"
  }
}
```

### Get Action Plan by ID

#### GET `/ideas/:ideaId/action-plans/:actionPlanId`

Get a specific action plan.

**Parameters:**
- `ideaId` (number): Idea ID
- `actionPlanId` (number): Action Plan ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "idea_id": 1,
    "title": "Development Plan",
    "content": "Action plan content...",
    "timeline": "2 months",
    "vision": "Long-term vision...",
    "resources": "Required resources...",
    "constraints": "Known constraints...",
    "priority": 1,
    "created_at": "2025-01-24T10:00:00Z",
    "updated_at": "2025-01-24T10:00:00Z"
  }
}
```

### Create Action Plan

#### POST `/ideas/:ideaId/action-plans`

Create a new action plan for an idea.

**Parameters:**
- `ideaId` (number): Idea ID

**Request Body:**
```json
{
  "title": "New Action Plan",
  "content": "Action plan content...",
  "timeline": "3 months",
  "vision": "Long-term vision...",
  "resources": "Required resources...",
  "constraints": "Known constraints...",
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
    "content": "Action plan content...",
    "timeline": "3 months",
    "vision": "Long-term vision...",
    "resources": "Required resources...",
    "constraints": "Known constraints...",
    "priority": 1,
    "created_at": "2025-01-24T10:00:00Z",
    "updated_at": "2025-01-24T10:00:00Z"
  },
  "message": "Action plan created successfully"
}
```

### Update Action Plan

#### PUT `/ideas/:ideaId/action-plans/:actionPlanId`

Update an existing action plan.

**Parameters:**
- `ideaId` (number): Idea ID
- `actionPlanId` (number): Action Plan ID

**Request Body:**
```json
{
  "title": "Updated Action Plan",
  "content": "Updated content...",
  "timeline": "4 months",
  "vision": "Updated vision...",
  "resources": "Updated resources...",
  "constraints": "Updated constraints...",
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
    "content": "Updated content...",
    "timeline": "4 months",
    "vision": "Updated vision...",
    "resources": "Updated resources...",
    "constraints": "Updated constraints...",
    "priority": 2,
    "created_at": "2025-01-24T10:00:00Z",
    "updated_at": "2025-01-24T11:00:00Z"
  },
  "message": "Action plan updated successfully"
}
```

### Delete Action Plan

#### DELETE `/ideas/:ideaId/action-plans/:actionPlanId`

Delete an action plan.

**Parameters:**
- `ideaId` (number): Idea ID
- `actionPlanId` (number): Action Plan ID

**Response:**
```json
{
  "success": true,
  "message": "Action plan deleted successfully"
}
```

---

## Categories and Tags

### Get Categories

#### GET `/categories`

Get all available categories.

**Response:**
```json
{
  "success": true,
  "data": [
    "technology",
    "business",
    "creative",
    "personal",
    "research",
    "innovation"
  ]
}
```

### Get Tags

#### GET `/tags`

Get all available tags.

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "mobile" },
    { "id": 2, "name": "social" },
    { "id": 3, "name": "ai" }
  ]
}
```

---

## Embeddings

### Update All Embeddings

#### POST `/embeddings/update-all`

Regenerate embeddings for all ideas (requires OpenAI API key).

**Response:**
```json
{
  "success": true,
  "message": "Embeddings updated successfully"
}
```

---

## Chat and AI Features

### Project Overview Chat

#### POST `/chat/project-overview`

Stream a conversational project overview chat.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Tell me about this idea" }
  ],
  "idea": {
    "id": 1,
    "title": "Flower Gifting App",
    "description": "An app for sharing digital flowers"
  },
  "documents": [
    {
      "title": "Research Notes",
      "content": "Document content..."
    }
  ],
  "tone": "warm"
}
```

**Response:** Streams text/plain content

### Get Category Template

#### GET `/chat/template/:category`

Get a category-specific document template.

**Parameters:**
- `category` (string): Category name

**Response:**
```json
{
  "template": "# {projectTitle}\n\n## Concept Overview\n..."
}
```

### Generate Document with AI

#### POST `/chat/generate-document`

Generate a document using AI based on chat conversation.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Tell me about this idea" }
  ],
  "idea": {
    "id": 1,
    "title": "Flower Gifting App",
    "description": "An app for sharing digital flowers"
  },
  "documents": [
    {
      "title": "Research Notes",
      "content": "Document content..."
    }
  ],
  "template": "# {projectTitle}\n\n## Concept Overview\n...",
  "tone": "warm"
}
```

**Response:**
```json
{
  "document": "# Flower Gifting App\n\n## Concept Overview\n...",
  "conversationId": "conv_123",
  "aiDocumentId": 5
}
```

### Save Chat Conversation

#### POST `/chat/save-conversation`

Save a chat conversation.

**Request Body:**
```json
{
  "ideaId": 1,
  "messages": [
    { "role": "user", "content": "Tell me about this idea" },
    { "role": "assistant", "content": "This is a great idea..." }
  ],
  "generatedDocument": "# Project Overview\n\n..."
}
```

**Response:**
```json
{
  "conversationId": "conv_123"
}
```

### Load Chat Conversation

#### GET `/chat/conversation/:ideaId`

Load a saved chat conversation.

**Parameters:**
- `ideaId` (number): Idea ID

**Response:**
```json
{
  "messages": [
    { "role": "user", "content": "Tell me about this idea" },
    { "role": "assistant", "content": "This is a great idea..." }
  ],
  "generatedDocument": "# Project Overview\n\n..."
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid idea ID"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Idea not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Data Types

### Idea
```typescript
interface Idea {
  id?: number;
  title: string;
  description?: string;
  content?: string;
  category?: string;
  status: 'seedling' | 'growing' | 'mature';
  created_at?: string;
  updated_at?: string;
  tags?: Tag[];
}
```

### Document
```typescript
interface Document {
  id?: number;
  idea_id: number;
  title: string;
  content?: string;
  document_type?: 'uploaded' | 'ai_generated';
  conversation_id?: string;
  created_at?: string;
  updated_at?: string;
}
```

### Action Plan
```typescript
interface ActionPlan {
  id?: number;
  idea_id: number;
  title: string;
  content: string;
  timeline: string;
  vision: string;
  resources: string;
  constraints: string;
  priority: number;
  created_at?: string;
  updated_at?: string;
}
```

### Tag
```typescript
interface Tag {
  id?: number;
  name: string;
}
```

---

## Rate Limiting

Currently, there are no rate limits implemented. However, for production use, consider implementing rate limiting for API endpoints.

## CORS

The API supports CORS and is configured to accept requests from any origin in development mode.

## Environment Variables

The following environment variables are used:

- `PORT`: Server port (default: 4000)
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `NODE_ENV`: Environment (development/production)

---

## Testing

See the `tests/` directory for comprehensive API tests covering all endpoints. 