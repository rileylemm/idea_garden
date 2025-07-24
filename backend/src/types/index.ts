export interface Idea {
  id?: number;
  title: string;
  description?: string;
  content?: string;
  category?: string;
  status: 'seedling' | 'growing' | 'mature';
  created_at?: string;
  updated_at?: string;
  tags?: Tag[];
}

export interface Tag {
  id?: number;
  name: string;
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

export interface CreateDocumentVersionRequest {
  document_id: number;
  content: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 