import { configManager, PlatformRule } from '../config/configManager';

/**
 * Prompt builder service
 * Creates optimized prompts for the LLM based on topic and requirements
 */
class PromptBuilder {
  /**
   * Build an intelligent prompt for generating comprehensive content
   * This replaces the multi-platform approach with a single, smart prompt
   */
  public buildIntelligentPrompt(
    idea: string,
    topic: string,
    history?: Array<{ role: 'user' | 'assistant'; content: string }>
  ): string {
    const isFollowUp = history && history.length > 0;

    const conversationBlock = isFollowUp
      ? `\nCONVERSATION SO FAR:\n${history!
          .map(m => `${m.role === 'user' ? 'User' : 'You'}: ${m.content}`)
          .join('\n\n')}\n`
      : '';

    const taskLine = isFollowUp
      ? `You are continuing the conversation above. The user has sent a follow-up message.`
      : `Your task: Provide a comprehensive, intelligent response to the following request.`;

    return `You are an expert knowledge assistant with deep expertise in ${topic} topics.
${taskLine}
${conversationBlock}
User: "${idea}"

INSTRUCTIONS:
${isFollowUp
  ? `1. This is a follow-up — answer directly using the conversation above for context.
2. If the user asks about something you said earlier, quote or reference your exact words from the conversation history.
3. NEVER claim you don't have memory of this conversation — the full history is provided above, use it.`
  : `1. Analyze the request carefully to understand what the user needs.
2. If it's a question, provide a thorough, accurate answer.
3. If it's a topic for information, create educational and insightful content.`}
4. Be conversational yet professional.
5. Keep the tone appropriate for the ${topic} topic — ${this.getToneForTopic(topic)}.
6. Be concise but thorough — avoid fluff and unnecessary padding.
7. NO meta-commentary — just provide the response directly.

Your response:`;
  }

  /**
   * Get appropriate tone for a topic
   */
  private getToneForTopic(topic: string): string {
    const tones: { [key: string]: string } = {
      'tech': 'technical yet accessible, with practical examples',
      'general': 'informative and balanced',
      'business': 'professional and strategic',
      'health': 'informative and evidence-based',
      'sports': 'engaging and enthusiastic',
      'politics': 'balanced and analytical',
      'entertainment': 'entertaining and engaging',
      'education': 'educational and clear'
    };
    return tones[topic] || 'informative and helpful';
  }

  /**
   * Build a prompt for generating social media content (legacy - kept for backwards compatibility)
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
   * Construct the actual prompt text (legacy - kept for backwards compatibility)
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
   * Get platform-specific instructions (legacy - kept for backwards compatibility)
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
   * Build prompts for all allowed platforms for a topic (legacy - kept for backwards compatibility)
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
