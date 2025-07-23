import { Router } from 'express';
import { IdeaController } from '../controllers/ideaController';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Idea Garden API is running' });
});

// Ideas routes
router.get('/ideas', IdeaController.getAllIdeas);
router.get('/ideas/search', IdeaController.searchIdeas);
router.get('/ideas/:id', IdeaController.getIdeaById);
router.get('/ideas/:id/related', IdeaController.getRelatedIdeas);
router.post('/ideas', IdeaController.createIdea);
router.put('/ideas/:id', IdeaController.updateIdea);
router.delete('/ideas/:id', IdeaController.deleteIdea);

// Embeddings routes
router.post('/embeddings/update-all', IdeaController.updateAllEmbeddings);

// Categories and tags
router.get('/categories', IdeaController.getCategories);
router.get('/tags', IdeaController.getTags);

export default router;
