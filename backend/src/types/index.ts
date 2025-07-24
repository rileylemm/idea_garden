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
  created_at?: string;
  updated_at?: string;
}

export interface CreateDocumentRequest {
  title: string;
  content?: string;
}

export interface UpdateDocumentRequest {
  title?: string;
  content?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 