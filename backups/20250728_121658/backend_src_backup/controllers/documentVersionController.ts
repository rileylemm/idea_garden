import { Request, Response } from 'express';
import { DocumentVersionService } from '../services/documentVersionService';

export class DocumentVersionController {
  // Get all versions for a document
  static async getDocumentVersions(req: Request, res: Response): Promise<void> {
    try {
      const documentId = parseInt(req.params.documentId);
      
      if (isNaN(documentId)) {
        res.status(400).json({ success: false, error: 'Invalid document ID' });
        return;
      }

      const versionService = new DocumentVersionService();
      
      // Check if document exists
      const documentExists = await versionService.documentExists(documentId);
      if (!documentExists) {
        res.status(404).json({ success: false, error: 'Document not found' });
        return;
      }

      const versions = await versionService.getDocumentVersions(documentId);
      
      res.json({
        success: true,
        data: versions
      });
    } catch (error) {
      console.error('Error fetching document versions:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch document versions' 
      });
    }
  }

  // Get a specific version
  static async getDocumentVersion(req: Request, res: Response): Promise<void> {
    try {
      const documentId = parseInt(req.params.documentId);
      const versionNumber = parseInt(req.params.versionNumber);
      
      if (isNaN(documentId) || isNaN(versionNumber)) {
        res.status(400).json({ success: false, error: 'Invalid document ID or version number' });
        return;
      }

      const versionService = new DocumentVersionService();
      
      // Check if document exists
      const documentExists = await versionService.documentExists(documentId);
      if (!documentExists) {
        res.status(404).json({ success: false, error: 'Document not found' });
        return;
      }

      const version = await versionService.getDocumentVersion(documentId, versionNumber);
      
      if (!version) {
        res.status(404).json({ success: false, error: 'Version not found' });
        return;
      }

      res.json({
        success: true,
        data: version
      });
    } catch (error) {
      console.error('Error fetching document version:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch document version' 
      });
    }
  }
} 