# Idea Garden 🌱

A personal tool to capture, evolve, and connect your ideas — helping seedlings of thought grow into mature concepts. Built with a beautiful garden-themed interface that makes idea management feel natural and inspiring.

## 🚀 Migration Status

✅ **Successfully migrated from Node.js/Express to Python/FastAPI**  
✅ **All 106 tests passing**  
✅ **Enhanced error handling and response consistency**  
✅ **Improved performance and type safety**

## Features

- **🌱 Idea Capture**: Create and organize ideas with rich descriptions and content
- **🏷️ Smart Tagging**: Tag ideas for easy categorization and discovery
- **📊 Growth Tracking**: Track idea progress through seedling → growing → mature stages
- **🔍 Powerful Search**: Find ideas by title, content, tags, or category
- **🤖 AI-Powered Connections**: Discover related ideas using semantic similarity with OpenAI embeddings
- **🎨 Beautiful UI**: Garden-themed interface with plant-based metaphors
- **💾 Persistent Storage**: SQLite database for reliable data storage
- **⚡ Real-time Updates**: Instant feedback and smooth interactions
- **🖥️ Desktop Tray App**: Cross-platform Electron app with system tray integration
- **⚡ Quick Capture**: Global shortcut (`Cmd/Ctrl + Shift + I`) for instant idea capture
- **🌐 System-wide Access**: Capture ideas from anywhere without interrupting your workflow
- **🎯 Floating Modal**: Beautiful floating window that appears above all applications
- **📄 Document Management**: Upload and manage `.md` research documents for each idea
- **🎯 AI Action Planning**: Generate detailed, specific action plans using AI analysis of your research
- **✏️ Idea Editing**: Edit idea details including title, description, category, and tags
- **📈 Analytics**: Track usage patterns and growth insights
- **🔄 Workflows**: Automated actions and periodic reviews
- **📤 Export/Import**: Export ideas in multiple formats and import from JSON

## Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for beautiful, responsive styling
- **React Router** for seamless navigation
- **Lucide React** for consistent iconography

### Backend (Updated)
- **Python 3.12** with FastAPI for high-performance API
- **SQLAlchemy 2.0** for database ORM
- **Pydantic** for data validation and serialization
- **SQLite** for lightweight, reliable data storage
- **OpenAI API** for semantic embeddings and AI features
- **CORS** enabled for frontend-backend communication
- **Pytest** for comprehensive testing (106 tests passing)

### Desktop App
- **Electron** for cross-platform desktop application
- **System Tray Integration** for always-accessible quick capture
- **Global Shortcuts** for instant idea capture from anywhere
- **Floating Windows** that appear above all applications

### Database Schema
- **Ideas**: Core idea data with titles, descriptions, content, and metadata
- **Tags**: Flexible tagging system for categorization
- **Categories**: Predefined categories (Technology, Business, Creative, etc.)
- **Relationships**: Many-to-many idea-tag relationships
- **Embeddings**: Vector embeddings for semantic similarity search
- **Documents**: Research documents linked to ideas for reference and AI analysis
- **Action Plans**: AI-generated action plans with detailed tasks and timelines

## Repository Structure

```
idea_garden/
├── frontend/          # React app with garden-themed UI
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── services/      # API service layer
│   │   └── utils/         # Utility functions
├── api/               # Python FastAPI server
│   ├── app/
│   │   ├── routers/       # API route definitions
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── tests/             # Comprehensive test suite
│   └── requirements.txt    # Python dependencies
├── tray-app/          # Electron desktop app
│   ├── main.js         # Main Electron process
│   ├── preload.js      # Secure bridge to renderer
│   └── assets/         # App icons and resources
├── db/                # Database files (SQLite)
├── docs/              # API documentation
└── scripts/           # Utility scripts
```

## Getting Started

### Prerequisites
- Python 3.12+ (required for SQLAlchemy compatibility)
- Node.js 18+ 
- npm or yarn
- OpenAI API key (for related ideas feature)

### Quick Setup

We provide a convenient setup script to get the API backend running quickly:

```bash
# Setup API backend (Python 3.12 + dependencies)
cd api
./setup.sh
```

**Note**: The API requires Python 3.12 specifically due to SQLAlchemy compatibility issues with Python 3.13.

### Environment Setup

1. **Get OpenAI API Key**:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key for the next step

2. **Configure Backend Environment**:
   ```bash
   cd api
   cp .env.example .env  # Create .env file from example
   ```
   
   Edit the `.env` file and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_actual_api_key_here
   PORT=8000
   NODE_ENV=development
   ```

### Backend Development (Updated)

```bash
cd api

# Create Python 3.12 virtual environment
python3.12 -m venv venv_py312
source venv_py312/bin/activate  # On Windows: venv_py312\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
python main.py
```

The API will be available at `http://localhost:4000`

**Note**: We use Python 3.12 specifically due to SQLAlchemy compatibility issues with Python 3.13.

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Desktop App Development

```bash
cd tray-app
npm install
npm start
```

The desktop app will:
- Start the main Idea Garden window
- Create a system tray icon (menu bar on Mac, system tray on Windows/Linux)
- Register global shortcut `Cmd + Shift + I` (Mac) or `Ctrl + Shift + I` (Windows/Linux)
- Enable quick capture from anywhere on your system

### Database Setup

The SQLite database is automatically created when you first run the backend. The schema includes:

- `ideas` table for storing idea data
- `tags` table for tag management  
- `idea_tags` table for many-to-many relationships
- `embeddings` table for semantic similarity search
- `documents` table for research documents linked to ideas
- `action_plans` table for AI-generated action plans

## API Endpoints

### Core Ideas
- `GET /api/ideas` - Get all ideas with optional filtering
- `GET /api/ideas/:id` - Get specific idea
- `POST /api/ideas` - Create new idea
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `GET /api/ideas/search?q=query` - Search ideas
- `GET /api/ideas/:id/related` - Get related ideas using semantic similarity

### AI Features
- `POST /api/ai/generate-summary/:id` - Generate AI summary for idea
- `POST /api/ai/suggest-tags/:id` - Suggest tags using AI
- `POST /api/ai/improve-content/:id` - Improve idea content
- `POST /api/ai/research-suggestions/:id` - Get research suggestions
- `POST /api/ai/validate-action-plan/:id` - Validate action plan

### Analytics
- `GET /api/analytics/usage` - Get usage analytics
- `GET /api/analytics/ideas/:id/insights` - Get idea insights
- `GET /api/analytics/growth-patterns` - Get growth patterns

### Search
- `GET /api/search/semantic?q=query` - Semantic search
- `GET /api/search/ideas/filter` - Advanced filtering
- `GET /api/search/ideas/:id/recommendations` - Get recommendations

### Export/Import
- `GET /api/export/ideas?format=json` - Export ideas
- `GET /api/export/idea/:id/full` - Export full idea
- `POST /api/export/import/ideas` - Import ideas

### Workflows
- `POST /api/workflows/idea-matured` - Trigger maturity workflow
- `POST /api/workflows/periodic-review` - Trigger periodic review
- `POST /api/workflows/automation/rules` - Create automation rule
- `GET /api/workflows/workflows/status` - Get workflow status

### Categories & Tags
- `GET /api/categories` - Get all categories
- `GET /api/tags` - Get all tags

### Documents
- `GET /api/ideas/:id/documents` - Get documents for an idea
- `POST /api/ideas/:id/documents` - Create new document for an idea
- `PUT /api/ideas/:id/documents/:docId` - Update document
- `DELETE /api/ideas/:id/documents/:docId` - Delete document

### Action Plans
- `GET /api/ideas/:id/action-plan` - Get action plan for an idea
- `POST /api/ideas/:id/action-plans` - Create new action plan
- `PUT /api/ideas/:id/action-plans/:planId` - Update action plan
- `DELETE /api/ideas/:id/action-plans/:planId` - Delete action plan

### System
- `GET /api/system/preferences` - Get user preferences
- `PUT /api/system/preferences` - Update preferences
- `GET /api/system/health` - System health
- `GET /api/system/statistics` - System statistics
- `POST /api/system/backup` - Create backup

### Health Check
- `GET /health` - API health status

## Current Status

✅ **Backend**: Complete Python FastAPI with 106 passing tests  
✅ **Frontend**: Complete garden-themed UI with React Router  
✅ **Database**: SQLite with proper schema and relationships  
✅ **API Integration**: Real-time frontend-backend communication  
✅ **Search & Filtering**: Advanced search with multiple criteria  
✅ **Tag System**: Flexible tagging and categorization  
✅ **AI-Powered Related Ideas**: Semantic similarity using OpenAI embeddings  
✅ **Related Ideas UI**: Beautiful component showing AI-powered connections  
✅ **Responsive Design**: Works on desktop and mobile  
✅ **Type Safety**: Full TypeScript coverage  
✅ **Desktop Tray App**: Cross-platform Electron app with system tray integration  
✅ **Quick Capture**: Global shortcut for instant idea capture from anywhere  
✅ **Floating Modal**: System-wide floating window that doesn't interrupt workflow  
✅ **Focus Management**: Smart window management that doesn't steal focus  
✅ **Document Management**: Upload and manage `.md` research documents for ideas
✅ **AI Action Planning**: Generate detailed action plans using research analysis
✅ **Idea Editing**: Full CRUD operations for idea details and tags  
✅ **Analytics**: Usage tracking and growth insights
✅ **Workflows**: Automated actions and periodic reviews
✅ **Export/Import**: Multi-format export and JSON import
✅ **Error Handling**: Proper 404/400/500 error responses
✅ **Testing**: Comprehensive test suite with 100% coverage

## Development Workflow

### Web App Development
1. **Start Backend**: `cd api && uvicorn main:app --reload --host 0.0.0.0 --port 8000`
2. **Start Frontend**: `cd frontend && npm run dev` (in new terminal)
3. **Access App**: Open `http://localhost:5173` in browser
4. **API Testing**: Backend available at `http://localhost:8000`
5. **API Docs**: Swagger UI at `http://localhost:8000/docs`

### Desktop App Development
1. **Start Backend**: `cd api && uvicorn main:app --reload --host 0.0.0.0 --port 8000`
2. **Start Frontend**: `cd frontend && npm run dev` (in new terminal)
3. **Start Desktop App**: `cd tray-app && npm start`
4. **Test Quick Capture**: Press `Cmd + Shift + I` (Mac) or `Ctrl + Shift + I` (Windows/Linux)
5. **Access Tray Menu**: Right-click the tray icon for additional options

## Testing

The backend includes comprehensive test coverage:

```bash
# Run all tests
cd api
source venv/bin/activate
python -m pytest tests/ -v

# Run specific test modules
python -m pytest tests/test_ideas.py -v
python -m pytest tests/test_ai.py -v
python -m pytest tests/test_analytics.py -v

# Run with coverage
python -m pytest tests/ --cov=app --cov-report=html
```

**Test Results**: ✅ All 106 tests passing

## Desktop App Features

### Quick Capture
The desktop app provides **instant idea capture** from anywhere on your system:

- **Global Shortcut**: `Cmd + Shift + I` (Mac) or `Ctrl + Shift + I` (Windows/Linux)
- **Floating Window**: Beautiful modal that appears above all applications
- **Non-intrusive**: Doesn't interrupt your current workflow
- **Smart Focus**: Main app stays in background when quick capture closes

### System Tray Integration
- **Always Accessible**: Tray icon in menu bar (Mac) or system tray (Windows/Linux)
- **Quick Actions**: Right-click for menu with options
- **Main App Access**: Click tray icon to open full Idea Garden interface

### Cross-Platform Support
- **macOS**: Menu bar integration with native look and feel
- **Windows**: System tray with Windows-style interface
- **Linux**: System tray with Linux desktop integration

## Testing the Related Ideas Engine

The semantic similarity engine has been tested and verified:

```bash
# Test creating ideas
curl -X POST http://localhost:8000/api/ideas \
  -H "Content-Type: application/json" \
  -d '{"title": "AI-powered recipe recommendation app", "description": "An app that suggests recipes based on available ingredients", "category": "technology", "status": "seedling"}'

# Test related ideas endpoint
curl http://localhost:8000/api/ideas/2/related
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
cd api
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
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
- [ ] Advanced analytics and insights
- [ ] Collaborative features
- [ ] Mobile app version
- [ ] Voice input for quick capture (Whisper integration)
- [ ] Offline mode for capturing without active backend
- [ ] Auto-launch at system login
- [ ] Local-only mode for privacy-first users
- [ ] Real-time collaboration features
- [ ] Advanced AI features with GPT-4 integration
- [ ] Idea templates and frameworks
- [ ] Integration with external tools (Notion, Obsidian, etc.)
