import { topicDetector } from './topicDetector';
import { promptBuilder } from './promptBuilder';
import { llmService } from './llmAdapter';
import { configManager } from '../config/configManager';

/**
 * Post generation request
 */
export interface GenerateRequest {
  idea: string;
  topic?: string; // Optional - auto-detect if not provided
}

/**
 * Post generation response
 */
export interface GenerateResponse {
  topic: string;
  topicConfidence?: number;
  posts: {
    x: string | null;
    linkedin: string | null;
    facebook: string | null;
  };
}

/**
 * Post Generator Service
 * Orchestrates the entire post generation workflow
 */
class PostGenerator {
  /**
   * Generate posts for all allowed platforms
   */
  public async generate(request: GenerateRequest): Promise<GenerateResponse> {
    // 1️⃣ Determine topic (use provided or auto-detect)
    let topic = request.topic;
    let topicConfidence: number | undefined;

    if (!topic) {
      topic = topicDetector.detectTopic(request.idea);
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

    // 2️⃣ Get allowed platforms for this topic
    const allowedPlatforms = configManager.getAllowedPlatforms(topic);
    console.log(`Allowed platforms for "${topic}":`, allowedPlatforms);

    // 3️⃣ Build prompts dynamically for allowed platforms
    const prompts: Record<string, string> = {};
    for (const platform of allowedPlatforms) {
      const prompt = promptBuilder.buildPrompt(request.idea, topic, platform);
      if (prompt) prompts[platform] = prompt;
    }

    // 4️⃣ Generate posts concurrently
    const posts: Record<string, string | null> = { x: null, linkedin: null, facebook: null };

    const generationPromises = Object.entries(prompts).map(async ([platform, prompt]) => {
      try {
        const generatedPost = await llmService.generate(prompt);
        posts[platform] = generatedPost;
        console.log(`✓ Generated post for ${platform}`);
      } catch (error) {
        console.error(`❌ Failed to generate post for ${platform}:`, error);
        posts[platform] = null;
      }
    });

    await Promise.all(generationPromises);

    // 5️⃣ Return structured response
    const response: GenerateResponse = {
      topic,
      posts: {
        x: posts.x || null,
        linkedin: posts.linkedin || null,
        facebook: posts.facebook || null
      }
    };

    if (topicConfidence !== undefined) {
      response.topicConfidence = topicConfidence;
    }

    return response;
  }

  /**
   * Generate post for a single platform
   */
  public async generateSingle(
    idea: string,
    topic: string,
    platform: string
  ): Promise<string> {
    // Validate platform
    if (!configManager.isPlatformAllowed(topic, platform)) {
      throw new Error(`Platform "${platform}" is not allowed for topic "${topic}"`);
    }

    // Build prompt
    const prompt = promptBuilder.buildPrompt(idea, topic, platform);
    if (!prompt) throw new Error(`Failed to build prompt for ${platform}`);

    // Generate post via LLMService
    try {
      const post = await llmService.generate(prompt);
      return post;
    } catch (error) {
      console.error(`❌ Failed to generate post for ${platform}:`, error);
      throw error;
    }
  }
}

// Singleton instance for use throughout the app
export const postGenerator = new PostGenerator();
