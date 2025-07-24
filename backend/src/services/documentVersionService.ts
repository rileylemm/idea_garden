import { db, runQuery, runSingleQuery } from '../database';
import { DocumentVersion, CreateDocumentVersionRequest } from '../types';

export class DocumentVersionService {
  // Get all versions for a document
  async getDocumentVersions(documentId: number): Promise<DocumentVersion[]> {
    const sql = `
      SELECT id, document_id, version_number, content, created_at, created_by
      FROM document_versions 
      WHERE document_id = ?
      ORDER BY version_number DESC
    `;
    
    const versions = await runQuery(sql, [documentId]);
    return versions as DocumentVersion[];
  }

  // Get a specific version
  async getDocumentVersion(documentId: number, versionNumber: number): Promise<DocumentVersion | null> {
    const sql = `
      SELECT id, document_id, version_number, content, created_at, created_by
      FROM document_versions 
      WHERE document_id = ? AND version_number = ?
    `;
    
    const versions = await runQuery(sql, [documentId, versionNumber]);
    return versions.length > 0 ? versions[0] as DocumentVersion : null;
  }

  // Get the latest version number for a document
  async getLatestVersionNumber(documentId: number): Promise<number> {
    const sql = `
      SELECT MAX(version_number) as max_version
      FROM document_versions 
      WHERE document_id = ?
    `;
    
    const result = await runQuery(sql, [documentId]);
    return result.length > 0 && result[0].max_version ? result[0].max_version : 0;
  }

  // Create a new version
  async createDocumentVersion(versionData: CreateDocumentVersionRequest): Promise<DocumentVersion> {
    // Get the next version number
    const latestVersion = await this.getLatestVersionNumber(versionData.document_id);
    const nextVersion = latestVersion + 1;
    
    const sql = `
      INSERT INTO document_versions (document_id, version_number, content, created_by)
      VALUES (?, ?, ?, ?)
    `;
    
    const result = await runSingleQuery(sql, [
      versionData.document_id,
      nextVersion,
      versionData.content,
      versionData.created_by || 'user'
    ]);
    
    // Get the created version
    const createdVersion = await this.getDocumentVersion(versionData.document_id, nextVersion);
    if (!createdVersion) {
      throw new Error('Failed to create document version');
    }
    
    return createdVersion;
  }

  // Create initial version for a document (when document is first created)
  async createInitialVersion(documentId: number, content: string, createdBy: string = 'ai'): Promise<DocumentVersion> {
    const versionData: CreateDocumentVersionRequest = {
      document_id: documentId,
      content,
      created_by: createdBy
    };
    
    return this.createDocumentVersion(versionData);
  }

  // Check if document exists
  async documentExists(documentId: number): Promise<boolean> {
    const sql = `
      SELECT COUNT(*) as count
      FROM documents 
      WHERE id = ?
    `;
    
    const result = await runQuery(sql, [documentId]);
    return result.length > 0 && result[0].count > 0;
  }
} 