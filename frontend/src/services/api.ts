/// <reference types="vite/client" />

/**
 * API Service
 * Handles all communication with the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface GenerateRequest {
  idea: string;
  topic?: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface GenerateResponse {
  topic: string;
  topicConfidence?: number;
  content: string; // Comprehensive intelligent content
  contentType: 'answer' | 'article' | 'guide' | 'explanation' | 'creative'; // Type of content generated
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
   * Generate intelligent content from an idea
   */
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate content');
    }

    return response.json();
  }

  /**
   * Generate posts from an idea (deprecated - use generate instead)
   */
  async generatePosts(request: GenerateRequest): Promise<GenerateResponse> {
    return this.generate(request);
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
