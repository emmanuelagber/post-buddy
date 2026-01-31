/**
 * API Service
 * Handles all communication with the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface GenerateRequest {
  idea: string;
  topic?: string;
}

export interface GenerateResponse {
  topic: string;
  topicConfidence?: number;
  posts: {
    x: string | null;
    linkedin: string | null;
    facebook: string | null;
  };
}

export interface TopicConfig {
  platforms: string[];
  rules: {
    [platform: string]: {
      tone: string;
      format: string;
      style: string;
    };
  };
}

export interface TopicsResponse {
  topics: string[];
  topicsConfig: {
    [topic: string]: TopicConfig;
  };
}

class ApiService {
  /**
   * Generate posts from an idea
   */
  async generatePosts(request: GenerateRequest): Promise<GenerateResponse> {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate posts');
    }

    return response.json();
  }

  /**
   * Get available topics and their configurations
   */
  async getTopics(): Promise<TopicsResponse> {
    const response = await fetch(`${API_BASE_URL}/topics`);

    if (!response.ok) {
      throw new Error('Failed to fetch topics');
    }

    return response.json();
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
}

export const apiService = new ApiService();
