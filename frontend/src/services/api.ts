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
}

export const apiService = new ApiService(); 