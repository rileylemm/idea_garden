import request from 'supertest';
import express from 'express';
import routes from '../src/routes';

export const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api', routes);
  return app;
};

export const createTestIdea = async (app: express.Application, ideaData: any) => {
  const response = await request(app)
    .post('/api/ideas')
    .send(ideaData);
  
  return response.body.data;
};

export const createTestDocument = async (app: express.Application, ideaId: number, documentData: any) => {
  const response = await request(app)
    .post(`/api/ideas/${ideaId}/documents`)
    .send(documentData);
  
  return response.body.data;
};

export const createTestActionPlan = async (app: express.Application, ideaId: number, actionPlanData: any) => {
  const response = await request(app)
    .post(`/api/ideas/${ideaId}/action-plans`)
    .send(actionPlanData);
  
  return response.body.data;
};

export const cleanupTestData = async (app: express.Application, ideaId: number) => {
  if (ideaId) {
    await request(app).delete(`/api/ideas/${ideaId}`);
  }
}; 