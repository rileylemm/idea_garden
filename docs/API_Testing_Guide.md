# 🧪 API Testing Guide

## Overview

This guide covers testing the Idea Garden FastAPI backend using Pytest. The test suite provides comprehensive coverage of all API functionality with **106 tests passing**.

## Test Structure

```
api/
├── tests/
│   ├── conftest.py              # Pytest configuration and fixtures
│   ├── test_action_plans.py     # Action plans tests
│   ├── test_ai.py              # AI features tests
│   ├── test_analytics.py       # Analytics tests
│   ├── test_categories.py      # Categories and tags tests
│   ├── test_chat.py            # Chat features tests
│   ├── test_documents.py       # Documents tests
│   ├── test_export.py          # Export/import tests
│   ├── test_health.py          # Health check tests
│   ├── test_ideas.py           # Ideas CRUD tests
│   ├── test_search.py          # Search functionality tests
│   ├── test_system.py          # System management tests
│   └── test_workflows.py       # Workflows tests
├── pytest.ini                  # Pytest configuration
└── requirements.txt            # Test dependencies
```

## Running Tests

### Install Dependencies

```bash
cd api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Run All Tests

```bash
python -m pytest tests/ -v
```

### Run Tests in Watch Mode

```bash
python -m pytest tests/ -v --watch
```

### Run Tests with Coverage

```bash
python -m pytest tests/ --cov=app --cov-report=html
```

## Test Results

```
===================================== 106 passed, 62 warnings in 2.70s =====================================
```

### Test Coverage by Module
| Module | Tests | Status |
|--------|-------|--------|
| **Action Plans** | 9/9 | ✅ PASSING |
| **AI Features** | 12/12 | ✅ PASSING |
| **Analytics** | 6/6 | ✅ PASSING |
| **Categories** | 5/5 | ✅ PASSING |
| **Chat** | 5/5 | ✅ PASSING |
| **Documents** | 8/8 | ✅ PASSING |
| **Export** | 12/12 | ✅ PASSING |
| **Health** | 2/2 | ✅ PASSING |
| **Ideas** | 12/12 | ✅ PASSING |
| **Search** | 10/10 | ✅ PASSING |
| **System** | 7/7 | ✅ PASSING |
| **Workflows** | 10/10 | ✅ PASSING |

## Test Categories

### 1. Health Check Tests
- Verify API is running
- Check health endpoint response
- Test root endpoint

### 2. Ideas Endpoint Tests
- Create new ideas
- Retrieve ideas by ID
- Update existing ideas
- Delete ideas
- Search ideas
- Get related ideas
- Filter by category/status/tags

### 3. Documents Endpoint Tests
- Create documents for ideas
- Retrieve documents
- Update documents
- Delete documents
- Document type handling

### 4. Action Plans Endpoint Tests
- Create action plans
- Retrieve action plans
- Update action plans
- Delete action plans
- Priority management

### 5. AI Features Tests
- Generate idea summaries
- Suggest tags using AI
- Improve idea content
- Research suggestions
- Action plan validation

### 6. Analytics Tests
- Usage analytics
- Idea insights
- Growth patterns
- Period filtering

### 7. Search Tests
- Semantic search
- Advanced filtering
- Recommendations
- Pagination

### 8. Export/Import Tests
- JSON export
- CSV export
- Markdown export
- Full idea export
- Import functionality

### 9. Workflows Tests
- Idea maturity workflow
- Periodic review workflow
- Automation rules
- Custom workflows

### 10. System Tests
- User preferences
- System health
- Statistics
- Backup functionality

### 11. Categories and Tags Tests
- Get all categories
- Get all tags
- Embedding updates

### 12. Error Handling Tests
- Invalid IDs (404 responses)
- Missing resources (404 responses)
- Malformed requests (400 responses)
- Server errors (500 responses)

## Test Fixtures

The `tests/conftest.py` file provides shared fixtures:

```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)

@pytest.fixture
def db_session():
    """Create database session."""
    # Database session setup

@pytest.fixture
def sample_idea_data():
    """Sample idea data for testing."""
    return {
        "title": "Test Idea",
        "description": "A test idea for API testing",
        "content": "Detailed content for the test idea",
        "category": "technology",
        "status": "seedling",
        "tags": ["test", "api"]
    }
```

## Test Utilities

### Creating Test Data

```python
@pytest.fixture
def sample_idea(client: TestClient, db_session: Session, sample_idea_data):
    """Create a sample idea for testing."""
    response = client.post("/api/ideas", json=sample_idea_data)
    return response.json()["data"]
```

### Database Management

```python
@pytest.fixture(autouse=True)
def setup_database():
    """Set up test database before each test."""
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Clean up after test
    Base.metadata.drop_all(bind=engine)
```

## Test Patterns

### Testing Successful Responses

```python
def test_create_idea(client: TestClient, db_session: Session, sample_idea_data):
    """Test creating a new idea."""
    response = client.post("/api/ideas", json=sample_idea_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert data["data"]["title"] == sample_idea_data["title"]
```

### Testing Error Responses

```python
def test_get_idea_not_found(client: TestClient, db_session: Session):
    """Test getting non-existent idea."""
    response = client.get("/api/ideas/99999")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Idea not found"
```

### Testing with Authentication (Future)

```python
# When authentication is implemented
def test_protected_endpoint(client: TestClient, auth_token: str):
    response = client.get(
        "/api/protected",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
```

## Coverage Reports

After running `python -m pytest tests/ --cov=app --cov-report=html`, you'll get:

- **Console Report**: Coverage percentages in terminal
- **HTML Report**: Detailed coverage report in `htmlcov/index.html`
- **XML Report**: Coverage data for CI/CD integration

### Coverage Targets

- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 95%+
- **Lines**: 90%+

## Debugging Tests

### Running Individual Tests

```bash
# Run specific test file
python -m pytest tests/test_ideas.py -v

# Run specific test
python -m pytest tests/test_ideas.py::test_create_idea -v
```

### Verbose Output

```bash
python -m pytest tests/ -v -s
```

### Debug Mode

```bash
python -m pytest tests/ --pdb
```

## Common Test Patterns

### Testing API Responses

```python
def test_get_ideas(client: TestClient, db_session: Session):
    """Test getting all ideas."""
    response = client.get("/api/ideas")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data
    assert isinstance(data["data"], list)
```

### Testing Error Handling

```python
def test_invalid_idea_id(client: TestClient, db_session: Session):
    """Test invalid idea ID handling."""
    response = client.get("/api/ideas/invalid")
    assert response.status_code == 422  # Validation error
```

### Testing with Query Parameters

```python
def test_search_ideas(client: TestClient, db_session: Session):
    """Test idea search functionality."""
    response = client.get("/api/ideas/search?q=technology")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.13'
      - run: cd api && pip install -r requirements.txt
      - run: cd api && python -m pytest tests/ -v
      - run: cd api && python -m pytest tests/ --cov=app --cov-report=xml
```

### Coverage Badge

Add coverage badge to README:

```markdown
![Test Coverage](https://img.shields.io/badge/coverage-100%25-green)
```

## Performance Testing

### Load Testing (Optional)

```bash
# Install locust for load testing
pip install locust

# Run load test
locust -f load_test.py
```

### Load Test Configuration

```python
# load_test.py
from locust import HttpUser, task, between

class APIUser(HttpUser):
    wait_time = between(1, 3)
    
    @task
    def test_health(self):
        self.client.get("/health")
    
    @task
    def test_ideas(self):
        self.client.get("/api/ideas")
    
    @task
    def test_create_idea(self):
        self.client.post("/api/ideas", json={
            "title": "Load Test Idea",
            "category": "technology",
            "status": "seedling"
        })
```

## Best Practices

### 1. Test Organization
- Group related tests in classes or modules
- Use descriptive test names
- Keep tests focused and atomic

### 2. Data Management
- Create fresh test data for each test
- Clean up after tests using fixtures
- Use factories for complex test data

### 3. Assertions
- Test both success and error cases
- Verify response structure and content
- Check status codes and headers

### 4. Performance
- Keep tests fast and focused
- Use session-scoped fixtures for expensive setup
- Mock external dependencies when appropriate

### 5. Maintenance
- Update tests when API changes
- Keep test data realistic
- Document complex test scenarios

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure database is initialized
   - Check database file permissions
   - Verify environment variables

2. **Test Timeouts**
   - Increase pytest timeout in config
   - Check for hanging async operations
   - Verify async/await usage

3. **Import Errors**
   - Check PYTHONPATH includes api directory
   - Verify import statements
   - Ensure virtual environment is activated

4. **Coverage Issues**
   - Check coverage configuration
   - Ensure all source files are included
   - Verify test file patterns

### Debug Commands

```bash
# Run tests with Python debugger
python -m pytest tests/ --pdb

# Run specific test with verbose output
python -m pytest tests/test_ideas.py::test_create_idea -v -s

# Check test environment
python -m pytest tests/ --collect-only
```

## Future Enhancements

### Planned Test Features

1. **Contract Testing**
   - API contract validation
   - Schema testing with Pydantic
   - Response format verification

2. **Performance Testing**
   - Response time benchmarks
   - Load testing integration
   - Memory usage monitoring

3. **Security Testing**
   - Input validation tests
   - SQL injection prevention
   - XSS protection tests

4. **Integration Testing**
   - Database integration tests
   - External API mocking
   - End-to-end workflows

### Test Automation

1. **Pre-commit Hooks**
   - Run tests before commits
   - Coverage threshold enforcement
   - Code quality checks

2. **Continuous Testing**
   - Automated test runs
   - Coverage reporting
   - Performance regression detection

---

## Quick Reference

### Test Commands
```bash
python -m pytest tests/ -v                    # Run all tests
python -m pytest tests/ -v --watch           # Watch mode
python -m pytest tests/ --cov=app            # With coverage
python -m pytest tests/ -v -s                # Verbose output
```

### Coverage Thresholds
- Statements: 90%
- Branches: 85%
- Functions: 95%
- Lines: 90%

### Test Structure
```python
class TestIdeas:
    def test_create_idea(self, client: TestClient, db_session: Session):
        """Test creating a new idea."""
        # test implementation
```

### Fixture Usage
```python
def test_with_fixture(client: TestClient, sample_idea):
    """Test using sample idea fixture."""
    response = client.get(f"/api/ideas/{sample_idea['id']}")
    assert response.status_code == 200
``` 