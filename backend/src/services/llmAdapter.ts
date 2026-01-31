import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMAdapter } from './llmAdapterInterface';



/**
 * Gemini LLM Adapter
 */
class GeminiAdapter implements LLMAdapter {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private modelName = 'gemini-2.0-flash';
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
      throw new Error(`LLM generation failed: ${error.message}`);
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
