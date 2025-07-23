import { Request, Response } from 'express';
import { IdeaService } from '../services/ideaService';
import { ApiResponse, CreateIdeaRequest, UpdateIdeaRequest, SearchQuery, Idea } from '../types';

export class IdeaController {
  // Get all ideas with optional filtering
  static async getAllIdeas(req: Request, res: Response) {
    try {
      const query: SearchQuery = {
        q: req.query.q as string,
        category: req.query.category as string,
        status: req.query.status as string,
        tags: req.query.tags as string
      };

      const ideas = await IdeaService.getAllIdeas(query);
      
      const response: ApiResponse<Idea[]> = {
        success: true,
        data: ideas
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting ideas:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get ideas'
      });
    }
  }

  // Get idea by ID
  static async getIdeaById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid idea ID'
        });
      }

      const idea = await IdeaService.getIdeaById(id);
      
      if (!idea) {
        return res.status(404).json({
          success: false,
          error: 'Idea not found'
        });
      }

      const response: ApiResponse<Idea> = {
        success: true,
        data: idea
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting idea:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get idea'
      });
    }
  }

  // Create new idea
  static async createIdea(req: Request, res: Response) {
    try {
      const ideaData: CreateIdeaRequest = req.body;

      if (!ideaData.title) {
        return res.status(400).json({
          success: false,
          error: 'Title is required'
        });
      }

      const newIdea = await IdeaService.createIdea(ideaData);
      
      const response: ApiResponse<Idea> = {
        success: true,
        data: newIdea,
        message: 'Idea created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating idea:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create idea'
      });
    }
  }

  // Update idea
  static async updateIdea(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid idea ID'
        });
      }

      const ideaData: UpdateIdeaRequest = req.body;
      const updatedIdea = await IdeaService.updateIdea(id, ideaData);
      
      if (!updatedIdea) {
        return res.status(404).json({
          success: false,
          error: 'Idea not found'
        });
      }

      const response: ApiResponse<Idea> = {
        success: true,
        data: updatedIdea,
        message: 'Idea updated successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Error updating idea:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update idea'
      });
    }
  }

  // Delete idea
  static async deleteIdea(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid idea ID'
        });
      }

      const deleted = await IdeaService.deleteIdea(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Idea not found'
        });
      }

      const response: ApiResponse<null> = {
        success: true,
        message: 'Idea deleted successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Error deleting idea:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete idea'
      });
    }
  }

  // Search ideas
  static async searchIdeas(req: Request, res: Response) {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }

      const ideas = await IdeaService.searchIdeas(query);
      
      const response: ApiResponse<Idea[]> = {
        success: true,
        data: ideas
      };

      res.json(response);
    } catch (error) {
      console.error('Error searching ideas:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search ideas'
      });
    }
  }

  // Get categories
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await IdeaService.getCategories();
      
      const response: ApiResponse<string[]> = {
        success: true,
        data: categories
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting categories:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get categories'
      });
    }
  }

  // Get tags
  static async getTags(req: Request, res: Response) {
    try {
      const tags = await IdeaService.getTags();
      
      const response: ApiResponse<any[]> = {
        success: true,
        data: tags
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting tags:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get tags'
      });
    }
  }
} 