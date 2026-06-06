import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMAdapter } from './llmAdapterInterface';



/**
 * Gemini LLM Adapter
 */
class GeminiAdapter implements LLMAdapter {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private modelName = 'gemini-2.5-flash';
  private apiKey = process.env.GEMINI_API_KEY;

  constructor() {
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
        },
      });
      console.log('✓ Gemini adapter initialized');
    }
  }

  public isAvailable(): boolean {
    return !!this.apiKey && !!this.model;
  }

  public async generate(prompt: string): Promise<string> {
    if (!this.isAvailable()) throw new Error('Gemini API key not configured.');

    try {
      const result = await this.model.generateContent(prompt);
      const text = await result.response.text();
      return text.trim();
    } catch (error: any) {
      console.error('Gemini generation error:', error);
      
      // Provide user-friendly error messages
      if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('Quota exceeded')) {
        throw new Error('The AI service is currently at its usage limit. Please try again in a few moments.');
      } else if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        throw new Error('The API key is invalid or has expired. Please check your configuration.');
      } else if (error.message?.includes('403') || error.message?.includes('permission')) {
        throw new Error('You don\'t have permission to use the AI service. Please check your API credentials.');
      } else if (error.message?.includes('timeout') || error.message?.includes('connection')) {
        throw new Error('The connection to the AI service timed out. Please try again.');
      } else {
        throw new Error('Unable to generate content. Please try again later.');
      }
    }
  }
}

/**
 * Mock adapter
 */
class MockAdapter implements LLMAdapter {
  public isAvailable(): boolean {
    return true;
  }

  public async generate(prompt: string): Promise<string> {
    return `[MOCK] ${prompt}`;
  }
}

/**
 * LLMService singleton
 */
class LLMService {
  private adapter: LLMAdapter;

  constructor() {
    const gemini = new GeminiAdapter();
    if (gemini.isAvailable()) {
      this.adapter = gemini;
    } else {
      console.warn('⚠ Gemini unavailable, using mock adapter');
      this.adapter = new MockAdapter();
    }
  }

  public async generate(prompt: string): Promise<string> {
    return this.adapter.generate(prompt);
  }

  public isAvailable(): boolean {
    return this.adapter.isAvailable();
  }

  public setAdapter(adapter: LLMAdapter): void {
    this.adapter = adapter;
  }
}

// ✅ Export the singleton
export const llmService = new LLMService();

// ✅ Also export adapters if you want to manually swap later
export { GeminiAdapter, MockAdapter };
