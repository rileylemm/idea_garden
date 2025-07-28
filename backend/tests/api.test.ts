import request from 'supertest';
import express from 'express';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import routes from '../src/routes';
import { initializeDatabase } from '../src/database';

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('Idea Garden API', () => {
  let testIdeaId: number;
  let testDocumentId: number;
  let testActionPlanId: number;

  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    // Clean up test data
    if (testIdeaId) {
      await request(app).delete(`/api/ideas/${testIdeaId}`);
    }
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'ok',
        message: 'Idea Garden API is running'
      });
    });
  });

  describe('Ideas', () => {
    describe('GET /api/ideas', () => {
      it('should get all ideas', async () => {
        const response = await request(app)
          .get('/api/ideas')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it('should filter ideas by category', async () => {
        const response = await request(app)
          .get('/api/ideas?category=technology')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it('should filter ideas by status', async () => {
        const response = await request(app)
          .get('/api/ideas?status=seedling')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it('should search ideas by query', async () => {
        const response = await request(app)
          .get('/api/ideas?q=app')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });

    describe('POST /api/ideas', () => {
      it('should create a new idea', async () => {
        const ideaData = {
          title: 'Test Idea',
          description: 'A test idea for API testing',
          content: 'Detailed content for the test idea',
          category: 'technology',
          status: 'seedling',
          tags: ['test', 'api']
        };

        const response = await request(app)
          .post('/api/ideas')
          .send(ideaData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(ideaData.title);
        expect(response.body.data.description).toBe(ideaData.description);
        expect(response.body.data.category).toBe(ideaData.category);
        expect(response.body.data.status).toBe(ideaData.status);
        expect(response.body.message).toBe('Idea created successfully');

        testIdeaId = response.body.data.id;
      });

      it('should require title', async () => {
        const response = await request(app)
          .post('/api/ideas')
          .send({
            description: 'Missing title'
          })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Title is required');
      });
    });

    describe('GET /api/ideas/:id', () => {
      it('should get idea by ID', async () => {
        const response = await request(app)
          .get(`/api/ideas/${testIdeaId}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(testIdeaId);
        expect(response.body.data.title).toBe('Test Idea');
      });

      it('should return 404 for non-existent idea', async () => {
        const response = await request(app)
          .get('/api/ideas/99999')
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Idea not found');
      });

      it('should return 400 for invalid ID', async () => {
        const response = await request(app)
          .get('/api/ideas/invalid')
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Invalid idea ID');
      });
    });

    describe('PUT /api/ideas/:id', () => {
      it('should update an idea', async () => {
        const updateData = {
          title: 'Updated Test Idea',
          description: 'Updated description',
          category: 'business',
          status: 'growing',
          tags: ['updated', 'test']
        };

        const response = await request(app)
          .put(`/api/ideas/${testIdeaId}`)
          .send(updateData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(updateData.title);
        expect(response.body.data.description).toBe(updateData.description);
        expect(response.body.data.category).toBe(updateData.category);
        expect(response.body.data.status).toBe(updateData.status);
        expect(response.body.message).toBe('Idea updated successfully');
      });
    });

    describe('DELETE /api/ideas/:id', () => {
      it('should delete an idea', async () => {
        const response = await request(app)
          .delete(`/api/ideas/${testIdeaId}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Idea deleted successfully');
      });
    });

    describe('GET /api/ideas/search', () => {
      it('should search ideas', async () => {
        const response = await request(app)
          .get('/api/ideas/search?q=test')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });

    describe('GET /api/ideas/:id/related', () => {
      it('should get related ideas', async () => {
        const response = await request(app)
          .get(`/api/ideas/${testIdeaId}/related`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it('should respect limit parameter', async () => {
        const response = await request(app)
          .get(`/api/ideas/${testIdeaId}/related?limit=3`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeLessThanOrEqual(3);
      });
    });
  });

  describe('Documents', () => {
    beforeEach(async () => {
      // Create a test idea for document tests
      const ideaData = {
        title: 'Document Test Idea',
        description: 'An idea for testing documents',
        category: 'technology',
        status: 'seedling',
        tags: ['test', 'documents']
      };

      const response = await request(app)
        .post('/api/ideas')
        .send(ideaData);

      testIdeaId = response.body.data.id;
    });

    describe('GET /api/ideas/:ideaId/documents', () => {
      it('should get documents for an idea', async () => {
        const response = await request(app)
          .get(`/api/ideas/${testIdeaId}/documents`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });

    describe('POST /api/ideas/:ideaId/documents', () => {
      it('should create a new document', async () => {
        const documentData = {
          title: 'Test Document',
          content: 'This is a test document content',
          document_type: 'uploaded'
        };

        const response = await request(app)
          .post(`/api/ideas/${testIdeaId}/documents`)
          .send(documentData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(documentData.title);
        expect(response.body.data.content).toBe(documentData.content);
        expect(response.body.data.document_type).toBe(documentData.document_type);
        expect(response.body.message).toBe('Document created successfully');

        testDocumentId = response.body.data.id;
      });
    });

    describe('GET /api/ideas/:ideaId/documents/:documentId', () => {
      it('should get a specific document', async () => {
        const response = await request(app)
          .get(`/api/ideas/${testIdeaId}/documents/${testDocumentId}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(testDocumentId);
        expect(response.body.data.title).toBe('Test Document');
      });
    });

    describe('PUT /api/ideas/:ideaId/documents/:documentId', () => {
      it('should update a document', async () => {
        const updateData = {
          title: 'Updated Test Document',
          content: 'Updated document content'
        };

        const response = await request(app)
          .put(`/api/ideas/${testIdeaId}/documents/${testDocumentId}`)
          .send(updateData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(updateData.title);
        expect(response.body.data.content).toBe(updateData.content);
        expect(response.body.message).toBe('Document updated successfully');
      });
    });

    describe('DELETE /api/ideas/:ideaId/documents/:documentId', () => {
      it('should delete a document', async () => {
        const response = await request(app)
          .delete(`/api/ideas/${testIdeaId}/documents/${testDocumentId}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Document deleted successfully');
      });
    });
  });

  describe('Document Versions', () => {
    beforeEach(async () => {
      // Create a test document for version tests
      const ideaData = {
        title: 'Version Test Idea',
        description: 'An idea for testing document versions',
        category: 'technology',
        status: 'seedling'
      };

      const ideaResponse = await request(app)
        .post('/api/ideas')
        .send(ideaData);

      testIdeaId = ideaResponse.body.data.id;

      const documentData = {
        title: 'Version Test Document',
        content: 'Original content',
        document_type: 'uploaded'
      };

      const documentResponse = await request(app)
        .post(`/api/ideas/${testIdeaId}/documents`)
        .send(documentData);

      testDocumentId = documentResponse.body.data.id;
    });

    describe('GET /api/documents/:documentId/versions', () => {
      it('should get document versions', async () => {
        const response = await request(app)
          .get(`/api/documents/${testDocumentId}/versions`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });

    describe('GET /api/documents/:documentId/versions/:versionNumber', () => {
      it('should get a specific document version', async () => {
        const response = await request(app)
          .get(`/api/documents/${testDocumentId}/versions/1`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.version_number).toBe(1);
      });
    });
  });

  describe('Action Plans', () => {
    beforeEach(async () => {
      // Create a test idea for action plan tests
      const ideaData = {
        title: 'Action Plan Test Idea',
        description: 'An idea for testing action plans',
        category: 'business',
        status: 'growing'
      };

      const response = await request(app)
        .post('/api/ideas')
        .send(ideaData);

      testIdeaId = response.body.data.id;
    });

    describe('GET /api/ideas/:ideaId/action-plan', () => {
      it('should get action plan for an idea', async () => {
        const response = await request(app)
          .get(`/api/ideas/${testIdeaId}/action-plan`)
          .expect(200);

        expect(response.body.success).toBe(true);
        // May be null if no action plan exists
        if (response.body.data) {
          expect(response.body.data.idea_id).toBe(testIdeaId);
        }
      });
    });

    describe('POST /api/ideas/:ideaId/action-plans', () => {
      it('should create a new action plan', async () => {
        const actionPlanData = {
          title: 'Test Action Plan',
          content: 'This is a test action plan',
          timeline: '3 months',
          vision: 'Long-term vision for the project',
          resources: 'Required resources for implementation',
          constraints: 'Known constraints and limitations',
          priority: 1
        };

        const response = await request(app)
          .post(`/api/ideas/${testIdeaId}/action-plans`)
          .send(actionPlanData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(actionPlanData.title);
        expect(response.body.data.content).toBe(actionPlanData.content);
        expect(response.body.data.timeline).toBe(actionPlanData.timeline);
        expect(response.body.data.vision).toBe(actionPlanData.vision);
        expect(response.body.data.resources).toBe(actionPlanData.resources);
        expect(response.body.data.constraints).toBe(actionPlanData.constraints);
        expect(response.body.data.priority).toBe(actionPlanData.priority);
        expect(response.body.message).toBe('Action plan created successfully');

        testActionPlanId = response.body.data.id;
      });
    });

    describe('GET /api/ideas/:ideaId/action-plans/:actionPlanId', () => {
      it('should get a specific action plan', async () => {
        const response = await request(app)
          .get(`/api/ideas/${testIdeaId}/action-plans/${testActionPlanId}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(testActionPlanId);
        expect(response.body.data.idea_id).toBe(testIdeaId);
      });
    });

    describe('PUT /api/ideas/:ideaId/action-plans/:actionPlanId', () => {
      it('should update an action plan', async () => {
        const updateData = {
          title: 'Updated Action Plan',
          content: 'Updated action plan content',
          timeline: '4 months',
          vision: 'Updated vision',
          resources: 'Updated resources',
          constraints: 'Updated constraints',
          priority: 2
        };

        const response = await request(app)
          .put(`/api/ideas/${testIdeaId}/action-plans/${testActionPlanId}`)
          .send(updateData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(updateData.title);
        expect(response.body.data.content).toBe(updateData.content);
        expect(response.body.data.timeline).toBe(updateData.timeline);
        expect(response.body.data.vision).toBe(updateData.vision);
        expect(response.body.data.resources).toBe(updateData.resources);
        expect(response.body.data.constraints).toBe(updateData.constraints);
        expect(response.body.data.priority).toBe(updateData.priority);
        expect(response.body.message).toBe('Action plan updated successfully');
      });
    });

    describe('DELETE /api/ideas/:ideaId/action-plans/:actionPlanId', () => {
      it('should delete an action plan', async () => {
        const response = await request(app)
          .delete(`/api/ideas/${testIdeaId}/action-plans/${testActionPlanId}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Action plan deleted successfully');
      });
    });
  });

  describe('Categories and Tags', () => {
    describe('GET /api/categories', () => {
      it('should get all categories', async () => {
        const response = await request(app)
          .get('/api/categories')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });

    describe('GET /api/tags', () => {
      it('should get all tags', async () => {
        const response = await request(app)
          .get('/api/tags')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });
  });

  describe('Embeddings', () => {
    describe('POST /api/embeddings/update-all', () => {
      it('should update all embeddings', async () => {
        const response = await request(app)
          .post('/api/embeddings/update-all')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Embeddings updated successfully');
      });
    });
  });

  describe('Chat and AI Features', () => {
    beforeEach(async () => {
      // Create a test idea for chat tests
      const ideaData = {
        title: 'Chat Test Idea',
        description: 'An idea for testing chat features',
        category: 'technology',
        status: 'seedling'
      };

      const response = await request(app)
        .post('/api/ideas')
        .send(ideaData);

      testIdeaId = response.body.data.id;
    });

    describe('GET /api/chat/template/:category', () => {
      it('should get category template', async () => {
        const response = await request(app)
          .get('/api/chat/template/technology')
          .expect(200);

        expect(response.body.template).toBeDefined();
        expect(typeof response.body.template).toBe('string');
      });
    });

    describe('POST /api/chat/save-conversation', () => {
      it('should save a chat conversation', async () => {
        const conversationData = {
          ideaId: testIdeaId,
          messages: [
            { role: 'user', content: 'Tell me about this idea' },
            { role: 'assistant', content: 'This is a great idea...' }
          ],
          generatedDocument: '# Project Overview\n\nThis is a test project...'
        };

        const response = await request(app)
          .post('/api/chat/save-conversation')
          .send(conversationData)
          .expect(200);

        expect(response.body.conversationId).toBeDefined();
      });
    });

    describe('GET /api/chat/conversation/:ideaId', () => {
      it('should load a chat conversation', async () => {
        const response = await request(app)
          .get(`/api/chat/conversation/${testIdeaId}`)
          .expect(200);

        // May be null if no conversation exists
        if (response.body.messages) {
          expect(Array.isArray(response.body.messages)).toBe(true);
        }
      });
    });

    describe('POST /api/chat/generate-document', () => {
      it('should generate a document with AI', async () => {
        const documentData = {
          messages: [
            { role: 'user', content: 'Tell me about this idea' }
          ],
          idea: {
            id: testIdeaId,
            title: 'Chat Test Idea',
            description: 'An idea for testing chat features'
          },
          documents: [
            {
              title: 'Research Notes',
              content: 'Some research content'
            }
          ],
          template: '# {projectTitle}\n\n## Overview\n\n{content}',
          tone: 'warm'
        };

        const response = await request(app)
          .post('/api/chat/generate-document')
          .send(documentData)
          .expect(200);

        expect(response.body.document).toBeDefined();
        expect(response.body.conversationId).toBeDefined();
        expect(response.body.aiDocumentId).toBeDefined();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid routes', async () => {
      const response = await request(app)
        .get('/api/invalid-route')
        .expect(404);
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/ideas')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
    });
  });
}); 