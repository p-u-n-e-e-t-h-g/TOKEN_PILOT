import type { Provider } from "../providers/Provider.js";
import { buildRequestAnalyzerPrompt } from "../prompts/requestAnalyzer.prompt.js";
import type { RequestAnalysis } from "../models/RequestAnalysis.js";
import { validateRequestAnalysis } from "../utils/RequestAnalysisValidator.js";
import { env } from "../config/env.js";

export class RequestAnalyzerService {
  constructor(private readonly provider: Provider) {}

  async analyze(prompt: string): Promise<RequestAnalysis> {
    const userPrompt = prompt.trim();
    if (!userPrompt) {
      throw new Error("RequestAnalyzerService.analyze requires a non-empty prompt.");
    }

    console.log("RequestAnalyzer Started");
    const builtPrompt = buildRequestAnalyzerPrompt(userPrompt);
    console.log("Prompt Built");

    let rawResponse: string;
    try {
      console.log("Prompt Sent");
      rawResponse = await this.provider.generate(builtPrompt);
    } catch (error) {
      throw new Error(`RequestAnalyzerService failed to generate analysis: ${(error as Error).message}`);
    }

    console.log("Response Received");
    console.log("Cleaning Response");
    const cleanedResponse = this.cleanResponse(rawResponse);

    let parsed: unknown;
    try {
      console.log("Parsing JSON");
      parsed = JSON.parse(cleanedResponse);
    } catch (error) {
      if (env.DEBUG_MODE) {
        console.error("Raw LLM response:", rawResponse);
        console.error("Cleaned response:", cleanedResponse);
        console.error("Validation error:", (error as Error).message);
      }
      throw new Error(
        [
          "RequestAnalyzerService could not parse provider JSON response.",
          `Reason: ${(error as Error).message}`,
          `Raw response: ${rawResponse}`
        ].join(" ")
      );
    }

    try {
      validateRequestAnalysis(parsed);
    } catch (error) {
      if (env.DEBUG_MODE) {
        console.error("Raw LLM response:", rawResponse);
        console.error("Cleaned response:", cleanedResponse);
        console.error("Validation error:", (error as Error).message);
      }
      throw error;
    }
    console.log("Validation Passed");
    console.log("Analyzer Finished");

    return parsed as RequestAnalysis;
  }

  private cleanResponse(rawResponse: string): string {
    const stripped = rawResponse
      .trim()
      .replace(/```json\s*/gi, "")
      .replace(/```/g, "")
      .trim();

    const firstBrace = stripped.indexOf("{");
    const lastBrace = stripped.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      return stripped;
    }

    return stripped.slice(firstBrace, lastBrace + 1).trim();
  }
}
