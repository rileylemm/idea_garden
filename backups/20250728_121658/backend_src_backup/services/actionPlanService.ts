import { db, runQuery, runSingleQuery } from '../database';
import { ActionPlan, CreateActionPlanRequest, UpdateActionPlanRequest } from '../types';

export class ActionPlanService {
  // Get action plan for an idea
  async getActionPlanByIdeaId(ideaId: number): Promise<ActionPlan | null> {
    const sql = `
      SELECT id, idea_id, title, content, timeline, vision, resources, constraints, priority, created_at, updated_at
      FROM action_plans 
      WHERE idea_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const actionPlans = await runQuery(sql, [ideaId]);
    return actionPlans.length > 0 ? actionPlans[0] as ActionPlan : null;
  }

  // Get a specific action plan
  async getActionPlanById(ideaId: number, actionPlanId: number): Promise<ActionPlan | null> {
    const sql = `
      SELECT id, idea_id, title, content, timeline, vision, resources, constraints, priority, created_at, updated_at
      FROM action_plans 
      WHERE id = ? AND idea_id = ?
    `;
    
    const actionPlans = await runQuery(sql, [actionPlanId, ideaId]);
    return actionPlans.length > 0 ? actionPlans[0] as ActionPlan : null;
  }

  // Create a new action plan
  async createActionPlan(ideaId: number, actionPlanData: CreateActionPlanRequest): Promise<ActionPlan> {
    const sql = `
      INSERT INTO action_plans (idea_id, title, content, timeline, vision, resources, constraints, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await runSingleQuery(sql, [
      ideaId,
      actionPlanData.title,
      actionPlanData.content,
      actionPlanData.timeline,
      actionPlanData.vision,
      actionPlanData.resources,
      actionPlanData.constraints,
      actionPlanData.priority
    ]);
    
    // Get the created action plan
    const createdActionPlan = await this.getActionPlanById(ideaId, result.id);
    if (!createdActionPlan) {
      throw new Error('Failed to create action plan');
    }
    
    return createdActionPlan;
  }

  // Update an action plan
  async updateActionPlan(ideaId: number, actionPlanId: number, actionPlanData: UpdateActionPlanRequest): Promise<ActionPlan> {
    const updateFields: string[] = [];
    const params: any[] = [];
    
    if (actionPlanData.title !== undefined) {
      updateFields.push('title = ?');
      params.push(actionPlanData.title);
    }
    
    if (actionPlanData.content !== undefined) {
      updateFields.push('content = ?');
      params.push(actionPlanData.content);
    }
    
    if (actionPlanData.timeline !== undefined) {
      updateFields.push('timeline = ?');
      params.push(actionPlanData.timeline);
    }
    
    if (actionPlanData.vision !== undefined) {
      updateFields.push('vision = ?');
      params.push(actionPlanData.vision);
    }
    
    if (actionPlanData.resources !== undefined) {
      updateFields.push('resources = ?');
      params.push(actionPlanData.resources);
    }
    
    if (actionPlanData.constraints !== undefined) {
      updateFields.push('constraints = ?');
      params.push(actionPlanData.constraints);
    }
    
    if (actionPlanData.priority !== undefined) {
      updateFields.push('priority = ?');
      params.push(actionPlanData.priority);
    }
    
    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(actionPlanId, ideaId);
    
    const sql = `
      UPDATE action_plans 
      SET ${updateFields.join(', ')}
      WHERE id = ? AND idea_id = ?
    `;
    
    await runSingleQuery(sql, params);
    
    // Get the updated action plan
    const updatedActionPlan = await this.getActionPlanById(ideaId, actionPlanId);
    if (!updatedActionPlan) {
      throw new Error('Action plan not found');
    }
    
    return updatedActionPlan;
  }

  // Delete an action plan
  async deleteActionPlan(ideaId: number, actionPlanId: number): Promise<void> {
    const sql = `
      DELETE FROM action_plans 
      WHERE id = ? AND idea_id = ?
    `;
    
    const result = await runSingleQuery(sql, [actionPlanId, ideaId]);
    
    if (result.changes === 0) {
      throw new Error('Action plan not found');
    }
  }

  // Check if idea exists (helper method)
  async ideaExists(ideaId: number): Promise<boolean> {
    const sql = 'SELECT id FROM ideas WHERE id = ?';
    const ideas = await runQuery(sql, [ideaId]);
    return ideas.length > 0;
  }
} 