import { configManager, PlatformRule } from '../config/configManager';

/**
 * Prompt builder service
 * Creates optimized prompts for the LLM based on topic, platform, and rules
 */
class PromptBuilder {
  /**
   * Build a prompt for generating social media content
   */
  public buildPrompt(
    idea: string,
    topic: string,
    platform: string
  ): string | null {
    // Get platform rules for this topic
    const rules = configManager.getPlatformRules(topic, platform);
    
    if (!rules) {
      console.warn(`No rules found for topic "${topic}" and platform "${platform}"`);
      return null;
    }

    // Build structured prompt
    const prompt = this.constructPrompt(idea, topic, platform, rules);
    return prompt;
  }

  /**
   * Construct the actual prompt text
   */
  private constructPrompt(
    idea: string,
    topic: string,
    platform: string,
    rules: PlatformRule
  ): string {
    const platformDisplay = this.getPlatformDisplayName(platform);

    return `You are a skilled social media content creator with expertise in ${topic} topics.

Topic: ${topic}

Your task: Transform this idea into an engaging ${platformDisplay} post.

USER'S IDEA: "${idea}"

PLATFORM REQUIREMENTS:
- Platform: ${platformDisplay}
- Topic Category: ${topic}
- Tone: ${rules.tone}
- Format: ${rules.format}
- Style: ${rules.style}

CRITICAL INSTRUCTIONS:
1. Create ORIGINAL content based on the idea - don't just repeat or template the exact words
2. Make it sound natural and authentic, like a real person wrote it
3. ${this.getPlatformSpecificInstructions(platform)}
4. Strictly follow the tone, format, and style above
5. NO meta-commentary, NO explanations - ONLY the post content itself

Write the ${platformDisplay} post now:`;
  }

  /**
   * Get display name for platform
   */
  private getPlatformDisplayName(platform: string): string {
    const displayNames: { [key: string]: string } = {
      'x': 'X (Twitter)',
      'linkedin': 'LinkedIn',
      'facebook': 'Facebook'
    };
    return displayNames[platform] || platform;
  }

  /**
   * Get platform-specific instructions
   */
  private getPlatformSpecificInstructions(platform: string): string {
    const instructions: { [key: string]: string } = {
      'x': 'Keep it under 280 characters. Make every word count. Use line breaks for emphasis if needed.',
      'linkedin': 'Start with a compelling hook. Use short paragraphs. End with a clear takeaway or question to drive engagement.',
      'facebook': 'Write in a conversational, story-telling style. Make it relatable and encourage comments.'
    };
    return instructions[platform] || 'Create engaging content appropriate for this platform.';
  }

  /**
   * Build prompts for all allowed platforms for a topic
   */
  public buildAllPrompts(idea: string, topic: string): { [platform: string]: string } {
    const allowedPlatforms = configManager.getAllowedPlatforms(topic);
    const prompts: { [platform: string]: string } = {};

    for (const platform of allowedPlatforms) {
      const prompt = this.buildPrompt(idea, topic, platform);
      if (prompt) {
        prompts[platform] = prompt;
      }
    }

    return prompts;
  }
}

export const promptBuilder = new PromptBuilder();
