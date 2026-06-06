import { configManager } from '../config/configManager';
import { llmService } from './llmAdapter';

class TopicDetector {
  /**
   * Detect topic using LLM reasoning, with keyword matching as fallback.
   */
  public async detectTopic(idea: string): Promise<string> {
    const availableTopics = configManager.getTopics(); // includes 'general'
    const allKeywords = configManager.getAllKeywords();

    // Build a description for each non-general topic from its keywords
    const topicDescriptions = Object.entries(allKeywords)
      .map(([topic, keywords]) => `- ${topic}: ${keywords.slice(0, 8).join(', ')}`)
      .join('\n');

    const topicList = availableTopics.join(', ');

    const prompt = `You are a topic classifier. Determine which topic best fits the user's idea.

Available topics: ${topicList}

Topic domains (examples of what belongs in each):
${topicDescriptions}
- general: anything that doesn't clearly fit the above

USER IDEA: "${idea}"

Think briefly: what domain or field does this idea belong to? Then pick the single best topic.

Respond in this exact format:
REASONING: <one sentence explaining your choice>
TOPIC: <single topic name from the list>`;

    try {
      const response = await llmService.generate(prompt);
      const topicMatch = response.match(/TOPIC:\s*(\w+)/i);

      if (topicMatch) {
        const detected = topicMatch[1].toLowerCase();
        if (availableTopics.includes(detected)) {
          console.log(`LLM topic reasoning → "${detected}"`);
          return detected;
        }
      }
      console.warn(`LLM returned unrecognised topic, falling back to keywords. Response: ${response}`);
    } catch (error) {
      console.warn('LLM topic detection failed, falling back to keywords:', error);
    }

    return this.detectTopicByKeywords(idea);
  }

  /**
   * Keyword-based fallback detector.
   */
  private detectTopicByKeywords(idea: string): string {
    const lowerIdea = idea.toLowerCase();
    const allKeywords = configManager.getAllKeywords();
    const topicScores: { [topic: string]: number } = {};

    for (const [topic, keywords] of Object.entries(allKeywords)) {
      let score = 0;
      for (const keyword of keywords) {
        const keywordLower = keyword.toLowerCase();
        const wordBoundaryRegex = new RegExp(`\\b${this.escapeRegex(keywordLower)}\\b`, 'gi');
        const exactMatches = (lowerIdea.match(wordBoundaryRegex) || []).length;
        score += exactMatches * 10;
        if (exactMatches === 0 && lowerIdea.includes(keywordLower)) {
          score += 3;
        }
      }
      topicScores[topic] = score;
    }

    let maxScore = 0;
    let detectedTopic = 'general';
    for (const [topic, score] of Object.entries(topicScores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedTopic = topic;
      }
    }

    const MIN_SCORE_THRESHOLD = 10;
    return maxScore >= MIN_SCORE_THRESHOLD ? detectedTopic : 'general';
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Confidence score — high (85) for LLM-detected topics, keyword-based otherwise.
   */
  public getConfidenceScore(idea: string, detectedTopic: string): number {
    if (detectedTopic === 'general') return 0;

    const keywords = configManager.getKeywords(detectedTopic);
    if (!keywords.length) return 85; // LLM detected a topic with no keyword list

    const lowerIdea = idea.toLowerCase();
    let matches = 0;
    for (const keyword of keywords) {
      if (lowerIdea.includes(keyword.toLowerCase())) matches++;
    }

    const keywordConfidence = Math.min(100, (matches / keywords.length) * 100 * 2);
    // Blend: if keywords matched, use them; otherwise assume LLM was right
    return matches > 0 ? Math.round(keywordConfidence) : 85;
  }
}

export const topicDetector = new TopicDetector();
