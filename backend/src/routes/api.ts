import { Router, Request, Response } from 'express';
import { postGenerator, GenerateRequest } from '../services/postGenerator';
import { configManager } from '../config/configManager';

const router = Router();

/**
 * POST /api/generate
 * Generate social media posts from an idea
 * 
 * Request body:
 * {
 *   "idea": "Your idea text",
 *   "topic": "tech" (optional - will auto-detect if not provided)
 * }
 * 
 * Response:
 * {
 *   "topic": "tech",
 *   "topicConfidence": 85,
 *   "posts": {
 *     "x": "Generated X post...",
 *     "linkedin": "Generated LinkedIn post...",
 *     "facebook": "Generated Facebook post..."
 *   }
 * }
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { idea, topic } = req.body;

    // Validate request
    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'idea is required and must be a non-empty string'
      });
    }

    if (topic && typeof topic !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'topic must be a string'
      });
    }

    // Create request
    const request: GenerateRequest = {
      idea: idea.trim(),
      topic: topic?.trim()
    };

    // Generate posts
    const response = await postGenerator.generate(request);

    // Return response
    res.json(response);
  } catch (error: any) {
    console.error('Generation error:', error);
    res.status(500).json({
      error: 'Generation failed',
      message: error.message || 'An unexpected error occurred'
    });
  }
});

/**
 * GET /api/topics
 * Get list of available topics and their configurations
 * 
 * Response:
 * {
 *   "topics": ["tech", "politics", "football", ...],
 *   "topicsConfig": { ... }
 * }
 */
router.get('/topics', (req: Request, res: Response) => {
  try {
    const topics = configManager.getTopics();
    const topicsConfig: any = {};

    for (const topic of topics) {
      const config = configManager.getTopicConfig(topic);
      if (config) {
        topicsConfig[topic] = {
          platforms: config.platforms,
          rules: config.rules
        };
      }
    }

    res.json({
      topics,
      topicsConfig
    });
  } catch (error: any) {
    console.error('Error fetching topics:', error);
    res.status(500).json({
      error: 'Failed to fetch topics',
      message: error.message
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

export default router;
