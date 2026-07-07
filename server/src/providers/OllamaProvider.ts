import type { Provider } from "./Provider.js";

export class OllamaProvider implements Provider {
  public readonly name = "Ollama";
  public readonly model: string;
  private readonly baseUrl: string;

  constructor(model = "qwen2.5:3b", baseUrl = "http://localhost:11434") {
    this.model = model;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async generate(prompt: string): Promise<string> {
    const endpoint = `${this.baseUrl}/api/generate`;

    let response: Response;

    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false
        })
      });
    } catch (error) {
      throw new Error(
        `Ollama is unavailable: ${(error as Error).message}`
      );
    }

    if (!response.ok) {
      throw new Error(
        `Ollama request failed with status ${response.status} ${response.statusText}`
      );
    }

    let payload: unknown;

    try {
      payload = await response.json();
    } catch (error) {
      throw new Error(
        `Invalid Ollama response format: ${(error as Error).message}`
      );
    }

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof (payload as Record<string, unknown>).response !== "string"
    ) {
      throw new Error("Invalid Ollama response format: missing response text.");
    }

    return (payload as Record<string, string>).response;
  }
}
