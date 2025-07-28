import { Request, Response } from 'express';
import { ActionPlanService } from '../services/actionPlanService';
import { CreateActionPlanRequest, UpdateActionPlanRequest } from '../types';

const actionPlanService = new ActionPlanService();

export class ActionPlanController {
  // Get action plan for an idea
  static async getActionPlan(req: Request, res: Response) {
    try {
      const ideaId = parseInt(req.params.ideaId);
      
      if (isNaN(ideaId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid idea ID'
        });
      }

      // Check if idea exists
      const ideaExists = await actionPlanService.ideaExists(ideaId);
      if (!ideaExists) {
        return res.status(404).json({
          success: false,
          error: 'Idea not found'
        });
      }

      const actionPlan = await actionPlanService.getActionPlanByIdeaId(ideaId);
      
      res.json({
        success: true,
        data: actionPlan
      });
    } catch (error) {
      console.error('Error fetching action plan:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch action plan'
      });
    }
  }

  // Get a specific action plan
  static async getActionPlanById(req: Request, res: Response) {
    try {
      const ideaId = parseInt(req.params.ideaId);
      const actionPlanId = parseInt(req.params.actionPlanId);
      
      if (isNaN(ideaId) || isNaN(actionPlanId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid idea ID or action plan ID'
        });
      }

      const actionPlan = await actionPlanService.getActionPlanById(ideaId, actionPlanId);
      
      if (!actionPlan) {
        return res.status(404).json({
          success: false,
          error: 'Action plan not found'
        });
      }

      res.json({
        success: true,
        data: actionPlan
      });
    } catch (error) {
      console.error('Error fetching action plan:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch action plan'
      });
    }
  }

  // Create a new action plan
  static async createActionPlan(req: Request, res: Response) {
    try {
      const ideaId = parseInt(req.params.ideaId);
      const actionPlanData: CreateActionPlanRequest = req.body;
      
      if (isNaN(ideaId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid idea ID'
        });
      }

      if (!actionPlanData.title || actionPlanData.title.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Action plan title is required'
        });
      }

      if (!actionPlanData.content || actionPlanData.content.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Action plan content is required'
        });
      }

      // Check if idea exists
      const ideaExists = await actionPlanService.ideaExists(ideaId);
      if (!ideaExists) {
        return res.status(404).json({
          success: false,
          error: 'Idea not found'
        });
      }

      const actionPlan = await actionPlanService.createActionPlan(ideaId, actionPlanData);
      
      res.status(201).json({
        success: true,
        data: actionPlan,
        message: 'Action plan created successfully'
      });
    } catch (error) {
      console.error('Error creating action plan:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create action plan'
      });
    }
  }

  // Update an action plan
  static async updateActionPlan(req: Request, res: Response) {
    try {
      const ideaId = parseInt(req.params.ideaId);
      const actionPlanId = parseInt(req.params.actionPlanId);
      const actionPlanData: UpdateActionPlanRequest = req.body;
      
      if (isNaN(ideaId) || isNaN(actionPlanId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid idea ID or action plan ID'
        });
      }

      if (actionPlanData.title !== undefined && actionPlanData.title.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Action plan title cannot be empty'
        });
      }

      const actionPlan = await actionPlanService.updateActionPlan(ideaId, actionPlanId, actionPlanData);
      
      res.json({
        success: true,
        data: actionPlan,
        message: 'Action plan updated successfully'
      });
    } catch (error) {
      console.error('Error updating action plan:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update action plan'
      });
    }
  }

  // Delete an action plan
  static async deleteActionPlan(req: Request, res: Response) {
    try {
      const ideaId = parseInt(req.params.ideaId);
      const actionPlanId = parseInt(req.params.actionPlanId);
      
      if (isNaN(ideaId) || isNaN(actionPlanId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid idea ID or action plan ID'
        });
      }

      await actionPlanService.deleteActionPlan(ideaId, actionPlanId);
      
      res.json({
        success: true,
        message: 'Action plan deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting action plan:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete action plan'
      });
    }
  }
} 