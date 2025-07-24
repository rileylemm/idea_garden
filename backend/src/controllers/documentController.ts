import { Request, Response } from 'express';
import { DocumentService } from '../services/documentService';
import { CreateDocumentRequest, UpdateDocumentRequest } from '../types';

const documentService = new DocumentService();

export class DocumentController {
  // Get all documents for an idea
  static async getDocuments(req: Request, res: Response) {
    try {
      const ideaId = parseInt(req.params.ideaId);
      
      if (isNaN(ideaId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid idea ID'
        });
      }

      // Check if idea exists
      const ideaExists = await documentService.ideaExists(ideaId);
      if (!ideaExists) {
        return res.status(404).json({
          success: false,
          error: 'Idea not found'
        });
      }

      const documents = await documentService.getDocumentsByIdeaId(ideaId);
      
      res.json({
        success: true,
        data: documents
      });
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch documents'
      });
    }
  }

  // Get a specific document
  static async getDocument(req: Request, res: Response) {
    try {
      const ideaId = parseInt(req.params.ideaId);
      const documentId = parseInt(req.params.documentId);
      
      if (isNaN(ideaId) || isNaN(documentId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid idea ID or document ID'
        });
      }

      const document = await documentService.getDocumentById(ideaId, documentId);
      
      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found'
        });
      }

      res.json({
        success: true,
        data: document
      });
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch document'
      });
    }
  }

  // Create a new document
  static async createDocument(req: Request, res: Response) {
    try {
      const ideaId = parseInt(req.params.ideaId);
      const documentData: CreateDocumentRequest = req.body;
      
      if (isNaN(ideaId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid idea ID'
        });
      }

      if (!documentData.title || documentData.title.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Document title is required'
        });
      }

      // Check if idea exists
      const ideaExists = await documentService.ideaExists(ideaId);
      if (!ideaExists) {
        return res.status(404).json({
          success: false,
          error: 'Idea not found'
        });
      }

      const document = await documentService.createDocument(ideaId, documentData);
      
      res.status(201).json({
        success: true,
        data: document,
        message: 'Document created successfully'
      });
    } catch (error) {
      console.error('Error creating document:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create document'
      });
    }
  }

  // Update a document
  static async updateDocument(req: Request, res: Response) {
    try {
      const ideaId = parseInt(req.params.ideaId);
      const documentId = parseInt(req.params.documentId);
      const documentData: UpdateDocumentRequest = req.body;
      
      if (isNaN(ideaId) || isNaN(documentId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid idea ID or document ID'
        });
      }

      if (documentData.title !== undefined && documentData.title.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Document title cannot be empty'
        });
      }

      const document = await documentService.updateDocument(ideaId, documentId, documentData);
      
      res.json({
        success: true,
        data: document,
        message: 'Document updated successfully'
      });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update document'
      });
    }
  }

  // Delete a document
  static async deleteDocument(req: Request, res: Response) {
    try {
      const ideaId = parseInt(req.params.ideaId);
      const documentId = parseInt(req.params.documentId);
      
      if (isNaN(ideaId) || isNaN(documentId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid idea ID or document ID'
        });
      }

      await documentService.deleteDocument(ideaId, documentId);
      
      res.json({
        success: true,
        message: 'Document deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete document'
      });
    }
  }
} 