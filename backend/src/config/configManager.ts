import * as fs from 'fs';
import * as path from 'path';

/**
 * Topic configuration structure
 */
export interface PlatformRule {
  tone: string;
  format: string;
  style: string;
}

export interface TopicConfig {
  platforms: string[];
  rules: {
    [platform: string]: PlatformRule;
  };
}

export interface TopicsConfig {
  topics: {
    [topic: string]: TopicConfig;
  };
  keywords: {
    [topic: string]: string[];
  };
}

/**
 * Configuration manager - loads and provides access to topics and platform rules
 * Designed to be easily extensible for future enhancements
 */
class ConfigManager {
  private config: TopicsConfig;
  private configPath: string;

  constructor() {
    this.configPath = path.join(__dirname, 'topics.json');
    this.config = this.loadConfig();
  }

  /**
   * Load configuration from JSON file
   */
  private loadConfig(): TopicsConfig {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf-8');
      return JSON.parse(configData);
    } catch (error) {
      console.error('Failed to load topics configuration:', error);
      throw new Error('Configuration file not found or invalid');
    }
  }

  /**
   * Reload configuration (useful for runtime updates)
   */
  public reloadConfig(): void {
    this.config = this.loadConfig();
  }

  /**
   * Get all available topics
   */
  public getTopics(): string[] {
    return Object.keys(this.config.topics);
  }

  /**
   * Get configuration for a specific topic
   */
  public getTopicConfig(topic: string): TopicConfig | null {
    return this.config.topics[topic] || null;
  }

  /**
   * Get allowed platforms for a topic
   */
  public getAllowedPlatforms(topic: string): string[] {
    const topicConfig = this.getTopicConfig(topic);
    return topicConfig ? topicConfig.platforms : [];
  }

  /**
   * Get platform rules for a specific topic and platform
   */
  public getPlatformRules(topic: string, platform: string): PlatformRule | null {
    const topicConfig = this.getTopicConfig(topic);
    if (!topicConfig || !topicConfig.platforms.includes(platform)) {
      return null;
    }
    return topicConfig.rules[platform] || null;
  }

  /**
   * Get keywords for topic detection
   */
  public getKeywords(topic: string): string[] {
    return this.config.keywords[topic] || [];
  }

  /**
   * Get all keywords for all topics
   */
  public getAllKeywords(): { [topic: string]: string[] } {
    return this.config.keywords;
  }

  /**
   * Check if a platform is allowed for a topic
   */
  public isPlatformAllowed(topic: string, platform: string): boolean {
    const allowedPlatforms = this.getAllowedPlatforms(topic);
    return allowedPlatforms.includes(platform);
  }
}

// Export singleton instance
export const configManager = new ConfigManager();
