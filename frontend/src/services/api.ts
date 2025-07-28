const API_BASE_URL = 'http://localhost:4000/api';

export interface Idea {
  id?: number;
  title: string;
  description?: string;
  content?: string;
  category?: string;
  status: 'seedling' | 'growing' | 'mature';
  created_at?: string;
  updated_at?: string;
  tags?: { name: string }[];
}

export interface RelatedIdea {
  idea_id: number;
  similarity: number;
  title: string;
  description?: string;
  category?: string;
  status: string;
}

export interface CreateIdeaRequest {
  title: string;
  description?: string;
  content?: string;
  category?: string;
  status?: 'seedling' | 'growing' | 'mature';
  tags?: string[];
}

export interface UpdateIdeaRequest {
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  status?: 'seedling' | 'growing' | 'mature';
  tags?: string[];
}

export interface SearchQuery {
  q?: string;
  category?: string;
  status?: string;
  tags?: string;
}

export interface Document {
  id?: number;
  idea_id: number;
  title: string;
  content?: string;
  document_type?: 'uploaded' | 'ai_generated';
  conversation_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDocumentRequest {
  title: string;
  content?: string;
  document_type?: 'uploaded' | 'ai_generated';
  conversation_id?: string;
}

export interface UpdateDocumentRequest {
  title?: string;
  content?: string;
}

export interface DocumentVersion {
  id?: number;
  document_id: number;
  version_number: number;
  content: string;
  created_at?: string;
  created_by?: string;
}

export interface ActionPlan {
  id?: number;
  idea_id: number;
  title: string;
  content: string;
  timeline: string;
  vision: string;
  resources: string;
  constraints: string;
  priority: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateActionPlanRequest {
  title: string;
  content: string;
  timeline: string;
  vision: string;
  resources: string;
  constraints: string;
  priority: number;
}

export interface UpdateActionPlanRequest {
  title?: string;
  content?: string;
  timeline?: string;
  vision?: string;
  resources?: string;
  constraints?: string;
  priority?: number;
}

// Analytics interfaces
export interface UsageAnalytics {
  period: string;
  start_date: string;
  end_date: string;
  ideas_created: number;
  categories: Array<{category: string, count: number}>;
  statuses: Array<{status: string, count: number}>;
  total_ideas: number;
  total_documents: number;
  total_action_plans: number;
}

export interface IdeaInsights {
  idea_id: number;
  growth_progress: number;
  document_count: number;
  action_plan_count: number;
  time_in_current_stage: number;
  related_ideas: number;
}

export interface GrowthPatterns {
  category_growth: Array<{category: string, growth: number}>;
  monthly_trends: Array<{month: string, ideas: number}>;
  stage_averages: Array<{stage: string, avg_days: number}>;
}

// Search interfaces
export interface SearchResult {
  id: number;
  title: string;
  description?: string;
  category: string;
  status: string;
  relevance_score: number;
  tags: Array<{id: number, name: string}>;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total_results: number;
}

export interface FilteredIdeasResponse {
  ideas: Idea[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
  filters_applied: {
    query?: string;
    category?: string;
    status?: string;
    tags?: string;
    date_from?: string;
    date_to?: string;
  };
}

// AI interfaces
export interface AISummary {
  summary: string;
  key_points: string[];
  recommendations: string[];
}

export interface TagSuggestion {
  suggested_tags: string[];
  confidence_scores: number[];
}

export interface ContentImprovement {
  improved_content: string;
  suggestions: string[];
  improvement_type: string;
}

export interface ResearchSuggestions {
  research_topics: string[];
  resources: string[];
  next_steps: string[];
}

export interface ActionPlanValidation {
  feasibility_score: number;
  suggestions: string[];
  risks: string[];
  improvements: string[];
}

// Export interfaces
export interface ExportData {
  export_date: string;
  total_ideas: number;
  ideas: Idea[];
}

export interface FullIdeaExport {
  idea: Idea;
  documents: Document[];
  action_plans: ActionPlan[];
}

// System interfaces
export interface SystemPreferences {
  theme: string;
  default_category: string;
  auto_save: boolean;
  notifications: boolean;
}

export interface SystemHealth {
  status: string;
  timestamp: string;
  database: {
    status: string;
    total_ideas: number;
    total_documents: number;
    total_action_plans: number;
    size_mb: number;
  };
  system: {
    memory_usage_percent: number;
    memory_available_gb: number;
    cpu_usage_percent: number;
    disk_usage_percent: number;
    disk_free_gb: number;
  };
  api: {
    version: string;
    uptime: string;
    endpoints_available: boolean;
  };
}

export interface SystemStatistics {
  overview: {
    total_ideas: number;
    total_documents: number;
    total_action_plans: number;
    recent_ideas: number;
    avg_ideas_per_day: number;
  };
  distribution: {
    categories: Array<{category: string, count: number}>;
    statuses: Array<{status: string, count: number}>;
  };
  performance: {
    memory_usage_percent: number;
    cpu_usage_percent: number;
    response_time_ms: number;
  };
  growth: {
    ideas_this_week: number;
    ideas_this_month: number;
    growth_rate: string;
  };
}

export interface SystemConfiguration {
  api: {
    version: string;
    environment: string;
    port: number;
    debug: boolean;
  };
  database: {
    type: string;
    path: string;
    backup_enabled: boolean;
    auto_backup_interval_hours: number;
  };
  features: {
    ai_enabled: boolean;
    export_enabled: boolean;
    analytics_enabled: boolean;
    workflows_enabled: boolean;
  };
  limits: {
    max_ideas_per_user: number;
    max_documents_per_idea: number;
    max_action_plans_per_idea: number;
    max_tags_per_idea: number;
  };
  security: {
    cors_enabled: boolean;
    rate_limiting: boolean;
    authentication: boolean;
  };
}

export interface BackupInfo {
  id: string;
  timestamp: string;
  type: string;
  size_mb: number;
  status: string;
}

// Workflow interfaces
export interface WorkflowRule {
  id: string;
  name: string;
  trigger_type: string;
  conditions: Record<string, unknown>;
  actions: string[];
  active: boolean;
}

export interface WorkflowStatus {
  workflow_statistics: {
    total_ideas: number;
    mature_ideas: number;
    growing_ideas: number;
    seedling_ideas: number;
    recent_activity: number;
  };
  automation_status: {
    active_rules: number;
    last_execution: string;
    next_scheduled: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error - please check if the backend is running',
      };
    }
  }

  // Ideas
  async getAllIdeas(query: SearchQuery = {}): Promise<Idea[]> {
    const queryParams = new URLSearchParams();
    if (query.q) queryParams.append('q', query.q);
    if (query.category) queryParams.append('category', query.category);
    if (query.status) queryParams.append('status', query.status);
    if (query.tags) queryParams.append('tags', query.tags);

    const endpoint = `/ideas${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.request<Idea[]>(endpoint);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch ideas');
  }

  async getIdeaById(id: number): Promise<Idea> {
    const response = await this.request<Idea>(`/ideas/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch idea');
  }

  async createIdea(ideaData: CreateIdeaRequest): Promise<Idea> {
    const response = await this.request<Idea>('/ideas', {
      method: 'POST',
      body: JSON.stringify(ideaData),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to create idea');
  }

  async updateIdea(id: number, ideaData: UpdateIdeaRequest): Promise<Idea> {
    const response = await this.request<Idea>(`/ideas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ideaData),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to update idea');
  }

  async deleteIdea(id: number): Promise<void> {
    const response = await this.request(`/ideas/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete idea');
    }
  }

  async searchIdeas(query: string): Promise<Idea[]> {
    const response = await this.request<Idea[]>(`/ideas/search?q=${encodeURIComponent(query)}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to search ideas');
  }

  // Related Ideas
  async getRelatedIdeas(id: number, limit: number = 5): Promise<RelatedIdea[]> {
    const response = await this.request<RelatedIdea[]>(`/ideas/${id}/related?limit=${limit}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch related ideas');
  }

  // Categories and Tags
  async getCategories(): Promise<string[]> {
    const response = await this.request<string[]>('/categories');
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch categories');
  }

  async getTags(): Promise<{ id: number; name: string }[]> {
    const response = await this.request<{ id: number; name: string }[]>('/tags');
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch tags');
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    const response = await this.request('/health');
    return response.success;
  }

  // Documents
  async getDocumentsByIdeaId(ideaId: number): Promise<Document[]> {
    const response = await this.request<Document[]>(`/ideas/${ideaId}/documents`);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch documents');
  }

  async getDocumentById(ideaId: number, documentId: number): Promise<Document> {
    const response = await this.request<Document>(`/ideas/${ideaId}/documents/${documentId}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch document');
  }

  async createDocument(ideaId: number, documentData: CreateDocumentRequest): Promise<Document> {
    const response = await this.request<Document>(`/ideas/${ideaId}/documents`, {
      method: 'POST',
      body: JSON.stringify(documentData),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to create document');
  }

  async updateDocument(ideaId: number, documentId: number, documentData: UpdateDocumentRequest): Promise<Document> {
    const response = await this.request<Document>(`/ideas/${ideaId}/documents/${documentId}`, {
      method: 'PUT',
      body: JSON.stringify(documentData),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to update document');
  }

  async deleteDocument(ideaId: number, documentId: number): Promise<void> {
    const response = await this.request<void>(`/ideas/${ideaId}/documents/${documentId}`, {
      method: 'DELETE',
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete document');
    }
  }

  // Document Versioning
  async getDocumentVersions(documentId: number): Promise<DocumentVersion[]> {
    const response = await this.request<DocumentVersion[]>(`/documents/${documentId}/versions`);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch document versions');
  }

  async getDocumentVersion(documentId: number, versionNumber: number): Promise<DocumentVersion> {
    const response = await this.request<DocumentVersion>(`/documents/${documentId}/versions/${versionNumber}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch document version');
  }

  // Action Plans
  async getActionPlanByIdeaId(ideaId: number): Promise<ActionPlan | null> {
    const response = await this.request<ActionPlan>(`/ideas/${ideaId}/action-plan`);
    
    if (response.success && response.data) {
      return response.data;
    }
    return null; // No action plan exists yet
  }

  async getActionPlanById(ideaId: number, actionPlanId: number): Promise<ActionPlan> {
    const response = await this.request<ActionPlan>(`/ideas/${ideaId}/action-plans/${actionPlanId}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch action plan');
  }

  async createActionPlan(ideaId: number, actionPlanData: CreateActionPlanRequest): Promise<ActionPlan> {
    const response = await this.request<ActionPlan>(`/ideas/${ideaId}/action-plans`, {
      method: 'POST',
      body: JSON.stringify(actionPlanData),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to create action plan');
  }

  async updateActionPlan(ideaId: number, actionPlanId: number, actionPlanData: UpdateActionPlanRequest): Promise<ActionPlan> {
    const response = await this.request<ActionPlan>(`/ideas/${ideaId}/action-plans/${actionPlanId}`, {
      method: 'PUT',
      body: JSON.stringify(actionPlanData),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to update action plan');
  }

  async deleteActionPlan(ideaId: number, actionPlanId: number): Promise<void> {
    const response = await this.request<void>(`/ideas/${ideaId}/action-plans/${actionPlanId}`, {
      method: 'DELETE',
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete action plan');
    }
  }

  // Analytics
  async getUsageAnalytics(period: string = 'month'): Promise<UsageAnalytics> {
    const response = await this.request<UsageAnalytics>(`/analytics/usage?period=${period}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch usage analytics');
  }

  async getIdeaInsights(ideaId: number): Promise<IdeaInsights> {
    const response = await this.request<IdeaInsights>(`/analytics/ideas/${ideaId}/insights`);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch idea insights');
  }

  async getGrowthPatterns(): Promise<GrowthPatterns> {
    const response = await this.request<GrowthPatterns>('/analytics/growth-patterns');
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch growth patterns');
  }

  // Search
  async semanticSearch(query: string, limit: number = 10): Promise<SearchResponse> {
    const response = await this.request<SearchResponse>(`/search/semantic?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to perform semantic search');
  }

  async filterIdeas(params: {
    q?: string;
    category?: string;
    status?: string;
    tags?: string;
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<FilteredIdeasResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/search/ideas/filter${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.request<FilteredIdeasResponse>(endpoint);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to filter ideas');
  }

  async getRecommendations(ideaId: number, limit: number = 5): Promise<SearchResult[]> {
    const response = await this.request<{recommendations: SearchResult[]}>(`/search/ideas/${ideaId}/recommendations?limit=${limit}`);
    
    if (response.success && response.data) {
      return response.data.recommendations;
    }
    throw new Error(response.error || 'Failed to fetch recommendations');
  }

  // AI Features
  async generateSummary(ideaId: number): Promise<AISummary> {
    const response = await this.request<AISummary>(`/ai/generate-summary/${ideaId}`, {
      method: 'POST',
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to generate summary');
  }

  async suggestTags(ideaId: number): Promise<TagSuggestion> {
    const response = await this.request<TagSuggestion>(`/ai/suggest-tags/${ideaId}`, {
      method: 'POST',
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to suggest tags');
  }

  async improveContent(ideaId: number, improvementType: string = 'clarity'): Promise<ContentImprovement> {
    const response = await this.request<ContentImprovement>(`/ai/improve-content/${ideaId}?improvement_type=${improvementType}`, {
      method: 'POST',
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to improve content');
  }

  async getResearchSuggestions(ideaId: number): Promise<ResearchSuggestions> {
    const response = await this.request<ResearchSuggestions>(`/ai/research-suggestions/${ideaId}`, {
      method: 'POST',
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get research suggestions');
  }

  async validateActionPlan(actionPlanId: number): Promise<ActionPlanValidation> {
    const response = await this.request<ActionPlanValidation>(`/ai/validate-action-plan/${actionPlanId}`, {
      method: 'POST',
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to validate action plan');
  }

  // Export
  async exportIdeas(params: {
    format?: 'json' | 'csv' | 'markdown';
    category?: string;
    status?: string;
    tags?: string;
  }): Promise<ExportData | Blob> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/export/ideas${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    if (params.format === 'csv') {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      return response.blob();
    } else {
      const response = await this.request<ExportData>(endpoint);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to export ideas');
    }
  }

  async exportFullIdea(ideaId: number, format: 'json' | 'markdown' | 'html' = 'json'): Promise<FullIdeaExport | string> {
    const endpoint = `/export/idea/${ideaId}/full?format=${format}`;
    
    if (format === 'json') {
      const response = await this.request<FullIdeaExport>(endpoint);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to export idea');
    } else {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      return response.text();
    }
  }

  async importIdeas(ideasData: Record<string, unknown>[]): Promise<{imported_count: number; total_attempted: number; errors: string[]}> {
    const response = await this.request<{imported_count: number; total_attempted: number; errors: string[]}>(`/export/import/ideas`, {
      method: 'POST',
      body: JSON.stringify(ideasData),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to import ideas');
  }

  // System
  async getSystemPreferences(): Promise<SystemPreferences> {
    const response = await this.request<SystemPreferences>('/system/preferences');
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch system preferences');
  }

  async updateSystemPreferences(preferences: Partial<SystemPreferences>): Promise<SystemPreferences> {
    const response = await this.request<{updated_preferences: SystemPreferences}>('/system/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
    
    if (response.success && response.data) {
      return response.data.updated_preferences;
    }
    throw new Error(response.error || 'Failed to update system preferences');
  }

  async getSystemHealth(): Promise<SystemHealth> {
    const response = await this.request<SystemHealth>('/system/health');
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch system health');
  }

  async getSystemStatistics(): Promise<SystemStatistics> {
    const response = await this.request<SystemStatistics>('/system/stats');
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch system statistics');
  }

  async getSystemConfiguration(): Promise<SystemConfiguration> {
    const response = await this.request<SystemConfiguration>('/system/config');
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch system configuration');
  }

  async createBackup(): Promise<BackupInfo> {
    const response = await this.request<BackupInfo>('/system/maintenance/backup', {
      method: 'POST',
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to create backup');
  }

  async getBackups(): Promise<{backups: BackupInfo[]; total_backups: number}> {
    const response = await this.request<{backups: BackupInfo[]; total_backups: number}>('/system/maintenance/backups');
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch backups');
  }

  // Workflows
  async triggerIdeaMatured(ideaId: number): Promise<{
    idea_id: number;
    idea_title: string;
    actions_taken: string[];
    suggestions: string[];
    workflow_completed: boolean;
  }> {
    const response = await this.request<{
      idea_id: number;
      idea_title: string;
      actions_taken: string[];
      suggestions: string[];
      workflow_completed: boolean;
    }>(`/workflows/idea-matured`, {
      method: 'POST',
      body: JSON.stringify({idea_id: ideaId}),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to trigger idea matured workflow');
  }

  async triggerPeriodicReview(daysOld: number = 30): Promise<{
    stale_ideas_count: number;
    reviewed_ideas: Array<{id: number; title: string; days_since_update: number}>;
    actions_taken: string[];
  }> {
    const response = await this.request<{
      stale_ideas_count: number;
      reviewed_ideas: Array<{id: number; title: string; days_since_update: number}>;
      actions_taken: string[];
    }>(`/workflows/periodic-review?days_old=${daysOld}`, {
      method: 'POST',
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to trigger periodic review');
  }

  async createAutomationRule(rule: {
    name: string;
    trigger_type: string;
    conditions: Record<string, unknown>;
    actions: string[];
  }): Promise<WorkflowRule> {
    const response = await this.request<WorkflowRule>('/workflows/automation/rules', {
      method: 'POST',
      body: JSON.stringify(rule),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to create automation rule');
  }

  async getAutomationRules(): Promise<{rules: WorkflowRule[]; total_rules: number}> {
    const response = await this.request<{rules: WorkflowRule[]; total_rules: number}>('/workflows/automation/rules');
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch automation rules');
  }

  async triggerCustomWorkflow(trigger: {
    trigger_type: string;
    idea_id?: number;
    metadata?: Record<string, unknown>;
  }): Promise<{
    trigger_type: string;
    idea_id?: number;
    idea_title?: string;
    actions_executed: string[];
    metadata?: Record<string, unknown>;
  }> {
    const response = await this.request<{
      trigger_type: string;
      idea_id?: number;
      idea_title?: string;
      actions_executed: string[];
      metadata?: Record<string, unknown>;
    }>('/workflows/workflows/trigger', {
      method: 'POST',
      body: JSON.stringify(trigger),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to trigger custom workflow');
  }

  async getWorkflowStatus(): Promise<WorkflowStatus> {
    const response = await this.request<WorkflowStatus>('/workflows/workflows/status');
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch workflow status');
  }
}

export const apiService = new ApiService(); 