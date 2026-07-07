/**
 * Shared contract for every AI provider TokenPilot can talk to.
 */
export interface Provider {
  /**
   * Human-readable provider name, such as OpenAI, Gemini, Ollama, or Claude.
   */
  name: string;

  /**
   * Default model identifier used by this provider.
   */
  model: string;

  /**
   * Generates a text response from the provided prompt.
   */
  generate(prompt: string): Promise<string>;
}
