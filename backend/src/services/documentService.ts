import { db, runQuery, runSingleQuery } from '../database';
import { Document, CreateDocumentRequest, UpdateDocumentRequest } from '../types';

export class DocumentService {
  // Get all documents for an idea
  async getDocumentsByIdeaId(ideaId: number): Promise<Document[]> {
    const sql = `
      SELECT id, idea_id, title, content, created_at, updated_at
      FROM documents 
      WHERE idea_id = ?
      ORDER BY created_at DESC
    `;
    
    const documents = await runQuery(sql, [ideaId]);
    return documents as Document[];
  }

  // Get a specific document
  async getDocumentById(ideaId: number, documentId: number): Promise<Document | null> {
    const sql = `
      SELECT id, idea_id, title, content, created_at, updated_at
      FROM documents 
      WHERE id = ? AND idea_id = ?
    `;
    
    const documents = await runQuery(sql, [documentId, ideaId]);
    return documents.length > 0 ? documents[0] as Document : null;
  }

  // Create a new document
  async createDocument(ideaId: number, documentData: CreateDocumentRequest): Promise<Document> {
    const sql = `
      INSERT INTO documents (idea_id, title, content)
      VALUES (?, ?, ?)
    `;
    
    const result = await runSingleQuery(sql, [
      ideaId,
      documentData.title,
      documentData.content || ''
    ]);
    
    // Get the created document
    const createdDocument = await this.getDocumentById(ideaId, result.id);
    if (!createdDocument) {
      throw new Error('Failed to create document');
    }
    
    return createdDocument;
  }

  // Update a document
  async updateDocument(ideaId: number, documentId: number, documentData: UpdateDocumentRequest): Promise<Document> {
    const updateFields: string[] = [];
    const params: any[] = [];
    
    if (documentData.title !== undefined) {
      updateFields.push('title = ?');
      params.push(documentData.title);
    }
    
    if (documentData.content !== undefined) {
      updateFields.push('content = ?');
      params.push(documentData.content);
    }
    
    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(documentId, ideaId);
    
    const sql = `
      UPDATE documents 
      SET ${updateFields.join(', ')}
      WHERE id = ? AND idea_id = ?
    `;
    
    await runSingleQuery(sql, params);
    
    // Get the updated document
    const updatedDocument = await this.getDocumentById(ideaId, documentId);
    if (!updatedDocument) {
      throw new Error('Document not found');
    }
    
    return updatedDocument;
  }

  // Delete a document
  async deleteDocument(ideaId: number, documentId: number): Promise<void> {
    const sql = `
      DELETE FROM documents 
      WHERE id = ? AND idea_id = ?
    `;
    
    const result = await runSingleQuery(sql, [documentId, ideaId]);
    
    if (result.changes === 0) {
      throw new Error('Document not found');
    }
  }

  // Check if idea exists (helper method)
  async ideaExists(ideaId: number): Promise<boolean> {
    const sql = 'SELECT id FROM ideas WHERE id = ?';
    const ideas = await runQuery(sql, [ideaId]);
    return ideas.length > 0;
  }
} 