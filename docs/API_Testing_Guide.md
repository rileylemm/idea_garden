# 🧪 API Testing Guide

## Overview

This guide covers testing the Idea Garden API endpoints using Jest and Supertest. The test suite provides comprehensive coverage of all API functionality.

## Test Structure

```
backend/
├── tests/
│   ├── api.test.ts          # Comprehensive API tests
│   ├── basic.test.ts        # Basic functionality tests
│   ├── setup.ts             # Test setup configuration
│   └── utils.ts             # Test utilities
├── jest.config.js           # Jest configuration
└── package.json             # Test dependencies
```

## Running Tests

### Install Dependencies

```bash
cd backend
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

## Test Categories

### 1. Health Check Tests
- Verify API is running
- Check health endpoint response

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
- Document versioning

### 4. Action Plans Endpoint Tests
- Create action plans
- Retrieve action plans
- Update action plans
- Delete action plans

### 5. Categories and Tags Tests
- Get all categories
- Get all tags

### 6. Embeddings Tests
- Update all embeddings

### 7. Chat and AI Features Tests
- Project overview chat
- Document generation
- Template retrieval
- Conversation management

### 8. Error Handling Tests
- Invalid IDs
- Missing resources
- Malformed requests
- Server errors

## Test Utilities

The `tests/utils.ts` file provides helper functions:

```typescript
import { createTestApp, createTestIdea, cleanupTestData } from './utils';

// Create test app instance
const app = createTestApp();

// Create test data
const idea = await createTestIdea(app, {
  title: 'Test Idea',
  description: 'Test description',
  category: 'technology',
  status: 'seedling'
});

// Clean up after tests
await cleanupTestData(app, idea.id);
```

## Test Data Management

### Before Each Test
- Initialize database
- Set up test environment

### After Each Test
- Clean up created test data
- Reset database state

### Test Isolation
- Each test runs independently
- No shared state between tests
- Automatic cleanup after each test

## Coverage Reports

After running `npm run test:coverage`, you'll get:

- **Text Report**: Console output showing coverage percentages
- **HTML Report**: Detailed coverage report in `coverage/index.html`
- **LCOV Report**: Coverage data for CI/CD integration

### Coverage Targets

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 85%+
- **Lines**: 80%+

## Debugging Tests

### Running Individual Tests

```bash
# Run specific test file
npm test -- basic.test.ts

# Run specific test
npm test -- --testNamePattern="should create and retrieve an idea"
```

### Verbose Output

```bash
npm test -- --verbose
```

### Debug Mode

```bash
npm test -- --detectOpenHandles
```

## Common Test Patterns

### Testing Successful Responses

```typescript
it('should create a new idea', async () => {
  const response = await request(app)
    .post('/api/ideas')
    .send(ideaData)
    .expect(200);

  expect(response.body.success).toBe(true);
  expect(response.body.data.title).toBe(ideaData.title);
});
```

### Testing Error Responses

```typescript
it('should handle invalid idea ID', async () => {
  const response = await request(app)
    .get('/api/ideas/invalid')
    .expect(400);

  expect(response.body.success).toBe(false);
  expect(response.body.error).toBe('Invalid idea ID');
});
```

### Testing with Authentication (Future)

```typescript
// When authentication is implemented
const response = await request(app)
  .get('/api/ideas')
  .set('Authorization', `Bearer ${token}`)
  .expect(200);
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
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install
      - run: cd backend && npm test
      - run: cd backend && npm run test:coverage
```

### Coverage Badge

Add coverage badge to README:

```markdown
![Test Coverage](https://img.shields.io/badge/coverage-85%25-green)
```

## Performance Testing

### Load Testing (Optional)

```bash
# Install artillery for load testing
npm install -g artillery

# Run load test
artillery run load-test.yml
```

### Load Test Configuration

```yaml
# load-test.yml
config:
  target: 'http://localhost:4000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Load Test"
    requests:
      - get: "/api/health"
      - get: "/api/ideas"
      - post: "/api/ideas"
        json:
          title: "Load Test Idea"
          category: "technology"
          status: "seedling"
```

## Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Keep tests focused and atomic

### 2. Data Management
- Create fresh test data for each test
- Clean up after tests
- Use factories for complex test data

### 3. Assertions
- Test both success and error cases
- Verify response structure and content
- Check status codes and headers

### 4. Performance
- Keep tests fast and focused
- Use beforeAll/afterAll for expensive setup
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
   - Increase Jest timeout in config
   - Check for hanging promises
   - Verify async/await usage

3. **TypeScript Errors**
   - Install @types/jest and @types/supertest
   - Check tsconfig.json includes test files
   - Verify import statements

4. **Coverage Issues**
   - Check collectCoverageFrom in Jest config
   - Ensure all source files are included
   - Verify test file patterns

### Debug Commands

```bash
# Run tests with Node debugger
node --inspect-brk node_modules/.bin/jest

# Run specific test with console output
npm test -- --verbose --testNamePattern="should create idea"

# Check test environment
npm test -- --detectOpenHandles --forceExit
```

## Future Enhancements

### Planned Test Features

1. **Contract Testing**
   - API contract validation
   - Schema testing
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
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage
npm test -- --verbose      # Verbose output
```

### Coverage Thresholds
- Statements: 80%
- Branches: 75%
- Functions: 85%
- Lines: 80%

### Test Structure
```
describe('Feature', () => {
  beforeAll(() => { /* setup */ });
  afterAll(() => { /* cleanup */ });
  
  it('should do something', async () => {
    // test implementation
  });
});
``` 