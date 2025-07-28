import { runQuery, runSingleQuery } from '../database';
import { Idea, CreateIdeaRequest, UpdateIdeaRequest, SearchQuery, Tag } from '../types';

export class IdeaService {
  // Get all ideas with optional filtering
  static async getAllIdeas(query: SearchQuery = {}): Promise<Idea[]> {
    let sql = `
      SELECT DISTINCT i.*, GROUP_CONCAT(t.name) as tag_names
      FROM ideas i
      LEFT JOIN idea_tags it ON i.id = it.idea_id
      LEFT JOIN tags t ON it.tag_id = t.id
    `;

    const conditions: string[] = [];
    const params: any[] = [];

    if (query.q) {
      conditions.push(`(i.title LIKE ? OR i.description LIKE ? OR i.content LIKE ?)`);
      const searchTerm = `%${query.q}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (query.category) {
      conditions.push(`i.category = ?`);
      params.push(query.category);
    }

    if (query.status) {
      conditions.push(`i.status = ?`);
      params.push(query.status);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` GROUP BY i.id ORDER BY i.updated_at DESC`;

    const ideas = await runQuery(sql, params);
    
    return ideas.map((idea: any) => ({
      ...idea,
      tags: idea.tag_names ? idea.tag_names.split(',').map((name: string) => ({ name })) : []
    }));
  }

  // Get idea by ID
  static async getIdeaById(id: number): Promise<Idea | null> {
    const sql = `
      SELECT i.*, GROUP_CONCAT(t.name) as tag_names
      FROM ideas i
      LEFT JOIN idea_tags it ON i.id = it.idea_id
      LEFT JOIN tags t ON it.tag_id = t.id
      WHERE i.id = ?
      GROUP BY i.id
    `;

    const ideas = await runQuery(sql, [id]);
    
    if (ideas.length === 0) {
      return null;
    }

    const idea = ideas[0];
    return {
      ...idea,
      tags: idea.tag_names ? idea.tag_names.split(',').map((name: string) => ({ name })) : []
    };
  }

  // Create new idea
  static async createIdea(ideaData: CreateIdeaRequest): Promise<Idea> {
    const { tags, ...ideaFields } = ideaData;
    
    const sql = `
      INSERT INTO ideas (title, description, content, category, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await runSingleQuery(sql, [
      ideaFields.title,
      ideaFields.description || null,
      ideaFields.content || null,
      ideaFields.category || null,
      ideaFields.status || 'seedling'
    ]);

    const newIdeaId = result.id;

    // Add tags if provided
    if (tags && tags.length > 0) {
      await this.addTagsToIdea(newIdeaId, tags);
    }

    return this.getIdeaById(newIdeaId) as Promise<Idea>;
  }

  // Update idea
  static async updateIdea(id: number, ideaData: UpdateIdeaRequest): Promise<Idea | null> {
    const { tags, ...ideaFields } = ideaData;
    
    const updates: string[] = [];
    const params: any[] = [];

    if (ideaFields.title !== undefined) {
      updates.push('title = ?');
      params.push(ideaFields.title);
    }
    if (ideaFields.description !== undefined) {
      updates.push('description = ?');
      params.push(ideaFields.description);
    }
    if (ideaFields.content !== undefined) {
      updates.push('content = ?');
      params.push(ideaFields.content);
    }
    if (ideaFields.category !== undefined) {
      updates.push('category = ?');
      params.push(ideaFields.category);
    }
    if (ideaFields.status !== undefined) {
      updates.push('status = ?');
      params.push(ideaFields.status);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const sql = `UPDATE ideas SET ${updates.join(', ')} WHERE id = ?`;
    
    await runSingleQuery(sql, params);

    // Update tags if provided
    if (tags !== undefined) {
      await this.removeAllTagsFromIdea(id);
      if (tags.length > 0) {
        await this.addTagsToIdea(id, tags);
      }
    }

    return this.getIdeaById(id);
  }

  // Delete idea
  static async deleteIdea(id: number): Promise<boolean> {
    const sql = 'DELETE FROM ideas WHERE id = ?';
    const result = await runSingleQuery(sql, [id]);
    return result.changes > 0;
  }

  // Search ideas
  static async searchIdeas(query: string): Promise<Idea[]> {
    const sql = `
      SELECT DISTINCT i.*, GROUP_CONCAT(t.name) as tag_names
      FROM ideas i
      LEFT JOIN idea_tags it ON i.id = it.idea_id
      LEFT JOIN tags t ON it.tag_id = t.id
      WHERE i.title LIKE ? OR i.description LIKE ? OR i.content LIKE ?
      GROUP BY i.id
      ORDER BY i.updated_at DESC
    `;

    const searchTerm = `%${query}%`;
    const ideas = await runQuery(sql, [searchTerm, searchTerm, searchTerm]);
    
    return ideas.map((idea: any) => ({
      ...idea,
      tags: idea.tag_names ? idea.tag_names.split(',').map((name: string) => ({ name })) : []
    }));
  }

  // Get all categories
  static async getCategories(): Promise<string[]> {
    const sql = 'SELECT DISTINCT category FROM ideas WHERE category IS NOT NULL AND category != ""';
    const categories = await runQuery(sql);
    return categories.map((cat: any) => cat.category);
  }

  // Get all tags
  static async getTags(): Promise<Tag[]> {
    const sql = 'SELECT * FROM tags ORDER BY name';
    return runQuery(sql);
  }

  // Helper methods for tag management
  private static async addTagsToIdea(ideaId: number, tagNames: string[]): Promise<void> {
    for (const tagName of tagNames) {
      // Insert tag if it doesn't exist
      await runSingleQuery(
        'INSERT OR IGNORE INTO tags (name) VALUES (?)',
        [tagName]
      );

      // Get tag ID
      const tags = await runQuery('SELECT id FROM tags WHERE name = ?', [tagName]);
      const tagId = tags[0].id;

      // Add relationship
      await runSingleQuery(
        'INSERT OR IGNORE INTO idea_tags (idea_id, tag_id) VALUES (?, ?)',
        [ideaId, tagId]
      );
    }
  }

  private static async removeAllTagsFromIdea(ideaId: number): Promise<void> {
    await runSingleQuery('DELETE FROM idea_tags WHERE idea_id = ?', [ideaId]);
  }
} 