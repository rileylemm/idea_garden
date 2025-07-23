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
router.post('/ideas', IdeaController.createIdea);
router.put('/ideas/:id', IdeaController.updateIdea);
router.delete('/ideas/:id', IdeaController.deleteIdea);

// Categories and tags
router.get('/categories', IdeaController.getCategories);
router.get('/tags', IdeaController.getTags);

export default router;
