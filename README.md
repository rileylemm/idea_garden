# Idea Garden 🌱

A personal tool to capture, evolve, and connect your ideas — helping seedlings of thought grow into mature concepts. Built with a beautiful garden-themed interface that makes idea management feel natural and inspiring.

## Features

- **🌱 Idea Capture**: Create and organize ideas with rich descriptions and content
- **🏷️ Smart Tagging**: Tag ideas for easy categorization and discovery
- **📊 Growth Tracking**: Track idea progress through seedling → growing → mature stages
- **🔍 Powerful Search**: Find ideas by title, content, tags, or category
- **🤖 AI-Powered Connections**: Discover related ideas using semantic similarity with OpenAI embeddings
- **🎨 Beautiful UI**: Garden-themed interface with plant-based metaphors
- **💾 Persistent Storage**: SQLite database for reliable data storage
- **⚡ Real-time Updates**: Instant feedback and smooth interactions

## Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for beautiful, responsive styling
- **React Router** for seamless navigation
- **Lucide React** for consistent iconography

### Backend
- **Node.js** with Express for robust API
- **SQLite** for lightweight, reliable data storage
- **TypeScript** for type-safe server code
- **OpenAI API** for semantic embeddings and related ideas
- **CORS** enabled for frontend-backend communication

### Database Schema
- **Ideas**: Core idea data with titles, descriptions, content, and metadata
- **Tags**: Flexible tagging system for categorization
- **Categories**: Predefined categories (Technology, Business, Creative, etc.)
- **Relationships**: Many-to-many idea-tag relationships
- **Embeddings**: Vector embeddings for semantic similarity search

## Repository Structure

```
idea_garden/
├── frontend/          # React app with garden-themed UI
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── services/      # API service layer
│   │   └── utils/         # Utility functions
├── backend/           # Express API server
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API route definitions
│   │   └── types/         # TypeScript type definitions
├── db/                # Database files (SQLite)
└── scripts/           # Utility scripts
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key (for related ideas feature)

### Environment Setup

1. **Get OpenAI API Key**:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key for the next step

2. **Configure Backend Environment**:
   ```bash
   cd backend
   cp .env.example .env  # Create .env file from example
   ```
   
   Edit the `.env` file and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_actual_api_key_here
   PORT=4000
   NODE_ENV=development
   ```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Development

```bash
cd backend
npm install
npm run dev
```

The API will be available at `http://localhost:4000`

### Database Setup

The SQLite database is automatically created when you first run the backend. The schema includes:

- `ideas` table for storing idea data
- `tags` table for tag management  
- `idea_tags` table for many-to-many relationships
- `embeddings` table for semantic similarity search

## API Endpoints

### Ideas
- `GET /api/ideas` - Get all ideas with optional filtering
- `GET /api/ideas/:id` - Get specific idea
- `POST /api/ideas` - Create new idea
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `GET /api/ideas/search?q=query` - Search ideas
- `GET /api/ideas/:id/related` - Get related ideas using semantic similarity

### Categories & Tags
- `GET /api/categories` - Get all categories
- `GET /api/tags` - Get all tags

### Embeddings
- `POST /api/embeddings/update-all` - Update embeddings for all ideas

### Health Check
- `GET /api/health` - API health status

## Current Status

✅ **Frontend**: Complete garden-themed UI with React Router  
✅ **Backend**: Full Express API with CRUD operations  
✅ **Database**: SQLite with proper schema and relationships  
✅ **API Integration**: Real-time frontend-backend communication  
✅ **Search & Filtering**: Advanced search with multiple criteria  
✅ **Tag System**: Flexible tagging and categorization  
✅ **AI-Powered Related Ideas**: Semantic similarity using OpenAI embeddings  
✅ **Related Ideas UI**: Beautiful component showing AI-powered connections  
✅ **Responsive Design**: Works on desktop and mobile  
✅ **Type Safety**: Full TypeScript coverage  

## Development Workflow

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm run dev` (in new terminal)
3. **Access App**: Open `http://localhost:5173` in browser
4. **API Testing**: Backend available at `http://localhost:4000`

## Testing the Related Ideas Engine

The semantic similarity engine has been tested and verified:

```bash
# Test creating ideas
curl -X POST http://localhost:4000/api/ideas \
  -H "Content-Type: application/json" \
  -d '{"title": "AI-powered recipe recommendation app", "description": "An app that suggests recipes based on available ingredients", "category": "technology", "status": "seedling"}'

# Test related ideas endpoint
curl http://localhost:4000/api/ideas/2/related
```

**Test Results**: ✅ Successfully found 68% similarity between related AI/food technology ideas!

## Building for Production

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm run build
```

## License

This project is licensed under the MIT License with Attribution and Non-Commercial Use Restriction. See [LICENSE](LICENSE) for details.

**Key restrictions:**
- No commercial use without explicit permission
- Must credit Riley Lemm when using this software
- Derivative works must use the same license

## Contributing

This is a personal project, but contributions are welcome! Please ensure any contributions comply with the license terms.

## Future Enhancements

- [ ] AI-assisted idea suggestions and tagging
- [ ] Idea relationship mapping and visualization
- [ ] Export/import functionality
- [ ] Advanced analytics and insights
- [ ] Collaborative features
- [ ] Mobile app version
