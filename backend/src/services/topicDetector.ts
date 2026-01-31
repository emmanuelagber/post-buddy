import { configManager } from '../config/configManager';

/**
 * Topic detection service
 * Automatically classifies user ideas into predefined topics
 * Uses keyword matching with scoring algorithm
 */
class TopicDetector {
  /**
   * Detect topic from user idea text
   * Returns the most likely topic or 'general' if no match
   */
  public detectTopic(idea: string): string {
    const lowerIdea = idea.toLowerCase();
    const allKeywords = configManager.getAllKeywords();
    const topicScores: { [topic: string]: number } = {};

    // Score each topic based on keyword matches
    for (const [topic, keywords] of Object.entries(allKeywords)) {
      let score = 0;
      
      for (const keyword of keywords) {
        const keywordLower = keyword.toLowerCase();
        
        // Exact word match (higher score)
        const wordBoundaryRegex = new RegExp(`\\b${this.escapeRegex(keywordLower)}\\b`, 'gi');
        const exactMatches = (lowerIdea.match(wordBoundaryRegex) || []).length;
        score += exactMatches * 10;
        
        // Partial match (lower score)
        if (exactMatches === 0 && lowerIdea.includes(keywordLower)) {
          score += 3;
        }
      }
      
      topicScores[topic] = score;
    }

    // Find topic with highest score
    let maxScore = 0;
    let detectedTopic = 'general';

    for (const [topic, score] of Object.entries(topicScores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedTopic = topic;
      }
    }

    // Require minimum score threshold to classify
    const MIN_SCORE_THRESHOLD = 10;
    if (maxScore < MIN_SCORE_THRESHOLD) {
      return 'general';
    }

    return detectedTopic;
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Get confidence score for topic detection (0-100)
   */
  public getConfidenceScore(idea: string, detectedTopic: string): number {
    if (detectedTopic === 'general') {
      return 0;
    }

    const keywords = configManager.getKeywords(detectedTopic);
    const lowerIdea = idea.toLowerCase();
    let matches = 0;

    for (const keyword of keywords) {
      if (lowerIdea.includes(keyword.toLowerCase())) {
        matches++;
      }
    }

    // Calculate confidence as percentage of keyword matches
    const confidence = Math.min(100, (matches / keywords.length) * 100 * 2);
    return Math.round(confidence);
  }
}

export const topicDetector = new TopicDetector();
