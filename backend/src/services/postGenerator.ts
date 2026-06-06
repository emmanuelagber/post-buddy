import { topicDetector } from './topicDetector';
import { promptBuilder } from './promptBuilder';
import { llmService } from './llmAdapter';
import { configManager } from '../config/configManager';

/**
 * Post generation request
 */
export interface GenerateRequest {
  idea: string;
  topic?: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

/**
 * Post generation response - now returns intelligent content
 */
export interface GenerateResponse {
  topic: string;
  topicConfidence?: number;
  content: string; // Single, comprehensive intelligent content
  contentType: 'answer' | 'article' | 'guide' | 'explanation' | 'creative'; // Type of content generated
}

/**
 * Post Generator Service
 * Orchestrates the entire post generation workflow
 */
class PostGenerator {
  /**
   * Generate intelligent content from idea (single API call)
   */
  public async generate(request: GenerateRequest): Promise<GenerateResponse> {
    // 1️⃣ Determine topic (use provided or auto-detect)
    let topic = request.topic;
    let topicConfidence: number | undefined;

    if (!topic) {
      topic = await topicDetector.detectTopic(request.idea);
      topicConfidence = topicDetector.getConfidenceScore(request.idea, topic);
      console.log(`Auto-detected topic: ${topic} (confidence: ${topicConfidence}%)`);
    } else {
      // Validate provided topic
      const availableTopics = configManager.getTopics();
      if (!availableTopics.includes(topic)) {
        throw new Error(
          `Invalid topic: ${topic}. Available topics: ${availableTopics.join(', ')}`
        );
      }
    }

    // 2️⃣ Build intelligent prompt (single API call instead of multiple platforms)
    const prompt = promptBuilder.buildIntelligentPrompt(request.idea, topic, request.history);
    console.log(`Generated intelligent prompt for topic: "${topic}"`);

    // 3️⃣ Generate content (SINGLE API CALL - this fixes the rate limit issue)
    try {
      const generatedContent = await llmService.generate(prompt);
      console.log(`✓ Successfully generated intelligent content`);

      // 4️⃣ Determine content type based on the request
      const contentType = this.detectContentType(request.idea, generatedContent);

      // 5️⃣ Return structured response
      const response: GenerateResponse = {
        topic,
        content: generatedContent,
        contentType
      };

      if (topicConfidence !== undefined) {
        response.topicConfidence = topicConfidence;
      }

      return response;
    } catch (error) {
      console.error(`❌ Failed to generate content:`, error);
      throw error;
    }
  }

  /**
   * Detect content type based on the idea and generated content
   */
  private detectContentType(idea: string, content: string): 'answer' | 'article' | 'guide' | 'explanation' | 'creative' {
    const lowerIdea = idea.toLowerCase();
    
    // Check for question marks
    if (lowerIdea.includes('?') || lowerIdea.includes('how') || lowerIdea.includes('what') || 
        lowerIdea.includes('why') || lowerIdea.includes('explain')) {
      return 'answer';
    }
    
    // Check for how-to/guide indicators
    if (lowerIdea.includes('how to') || lowerIdea.includes('tutorial') || lowerIdea.includes('guide')) {
      return 'guide';
    }
    
    // Check for explanation indicators
    if (lowerIdea.includes('explain') || lowerIdea.includes('understand')) {
      return 'explanation';
    }
    
    // Check for article indicators
    if (lowerIdea.includes('about') || lowerIdea.includes('discuss') || lowerIdea.includes('article')) {
      return 'article';
    }
    
    // Default to creative/general content
    return 'creative';
  }

}

// Singleton instance for use throughout the app
export const postGenerator = new PostGenerator();
