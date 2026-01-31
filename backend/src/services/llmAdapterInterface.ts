/**
 * LLM Adapter Interface
 * Ensures all LLM adapters have a consistent API
 */
export interface LLMAdapter {
    /**
     * Generate text from a prompt
     * @param prompt Input text
     * @returns Generated output text
     */
    generate(prompt: string): Promise<string>;

    /**
     * Check if the adapter is properly configured and available
     */
    isAvailable(): boolean;
}
