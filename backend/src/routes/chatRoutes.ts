import express from 'express';
import { ChatService } from '../services/chatService';

const router = express.Router();
const chatService = new ChatService();

// Project Overview Chat routes
router.post('/project-overview', async (req, res) => {
  try {
    const { messages, idea, documents } = req.body;
    
    // Set up streaming response
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
                    // Call chat service with streaming
        const tone = req.body.tone || 'warm';
        await chatService.streamProjectOverviewChat(messages, idea, documents, res, tone);
        
      } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
      }
    });

    // Get category-specific template
    router.get('/template/:category', async (req, res) => {
      try {
        const { category } = req.params;
        const template = chatService.getCategorySpecificDocumentTemplate(category);
        res.json({ template });
      } catch (error) {
        console.error('Template error:', error);
        res.status(500).json({ error: 'Failed to get template' });
      }
    });

    // Generate document with AI
    router.post('/generate-document', async (req, res) => {
      try {
        console.log('Received document generation request:', { 
          messagesCount: req.body.messages?.length, 
          ideaTitle: req.body.idea?.title,
          documentsCount: req.body.documents?.length,
          templateLength: req.body.template?.length,
          tone: req.body.tone
        });
        
        const { messages, idea, documents, template, tone } = req.body;
        const document = await chatService.generateDocumentWithAI(messages, idea, documents, template, tone);
        
        console.log('Document generated successfully, length:', document.length);
        res.json({ document });
      } catch (error) {
        console.error('Document generation error:', error);
        res.status(500).json({ error: 'Failed to generate document' });
      }
    });

    // Save chat conversation
    router.post('/save-conversation', async (req, res) => {
      try {
        const { ideaId, messages, generatedDocument } = req.body;
        const conversationId = await chatService.saveConversation(ideaId, messages, generatedDocument);
        res.json({ conversationId });
      } catch (error) {
        console.error('Save conversation error:', error);
        res.status(500).json({ error: 'Failed to save conversation' });
      }
    });

    // Load chat conversation
    router.get('/conversation/:ideaId', async (req, res) => {
      try {
        const { ideaId } = req.params;
        const conversation = await chatService.loadConversation(parseInt(ideaId));
        res.json(conversation);
      } catch (error) {
        console.error('Load conversation error:', error);
        res.status(500).json({ error: 'Failed to load conversation' });
      }
    });
    
    export default router; 