import request from 'supertest';
import express from 'express';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import routes from '../src/routes';
import { initializeDatabase } from '../src/database';

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('Idea Garden API - Basic Tests', () => {
  beforeAll(async () => {
    await initializeDatabase();
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

  describe('Ideas Endpoints', () => {
    let testIdeaId: number;

    afterAll(async () => {
      if (testIdeaId) {
        await request(app).delete(`/api/ideas/${testIdeaId}`);
      }
    });

    it('should create and retrieve an idea', async () => {
      // Create idea
      const ideaData = {
        title: 'Test Idea',
        description: 'A test idea for API testing',
        category: 'technology',
        status: 'seedling',
        tags: ['test', 'api']
      };

      const createResponse = await request(app)
        .post('/api/ideas')
        .send(ideaData)
        .expect(201); // Changed from 200 to 201 for creation

      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.data.title).toBe(ideaData.title);
      testIdeaId = createResponse.body.data.id;

      // Get idea by ID
      const getResponse = await request(app)
        .get(`/api/ideas/${testIdeaId}`)
        .expect(200);

      expect(getResponse.body.success).toBe(true);
      expect(getResponse.body.data.id).toBe(testIdeaId);
      expect(getResponse.body.data.title).toBe(ideaData.title);
    });

    it('should get all ideas', async () => {
      const response = await request(app)
        .get('/api/ideas')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should search ideas', async () => {
      const response = await request(app)
        .get('/api/ideas/search?q=test')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Categories and Tags', () => {
    it('should get categories', async () => {
      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should get tags', async () => {
      const response = await request(app)
        .get('/api/tags')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid idea ID', async () => {
      const response = await request(app)
        .get('/api/ideas/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid idea ID');
    });

    it('should handle non-existent idea', async () => {
      const response = await request(app)
        .get('/api/ideas/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Idea not found');
    });
  });
}); 