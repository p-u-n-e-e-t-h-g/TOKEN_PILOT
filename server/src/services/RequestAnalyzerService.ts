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
      throw new Error(
        [
          "RequestAnalyzerService could not parse provider JSON response.",
          `Reason: ${(error as Error).message}`,
          `Raw response: ${rawResponse}`
        ].join(" ")
      );
    }

    if (env.DEBUG_MODE) {
      console.error("==================================");
      console.error("RAW LLM RESPONSE");
      console.error("==================================");
      console.error("");
      console.error(rawResponse);
      console.error("");
      console.error("==================================");
      console.error("CLEANED RESPONSE");
      console.error("==================================");
      console.error("");
      console.error(cleanedResponse);
      console.error("");
      console.error("==================================");
      console.error("PARSED JSON");
      console.error("==================================");
      console.error("");
      console.error(parsed);
      console.error("");
    }

    try {
      validateRequestAnalysis(parsed);
    } catch (error) {
      if (env.DEBUG_MODE) {
        this.logValidationFailure(parsed, error);
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

  private logValidationFailure(value: unknown, error: unknown): void {
    const candidate = value as Record<string, unknown> | null;
    const missingFields = this.getMissingFields(candidate);
    const emptyArrays = this.getEmptyArrays(candidate);
    const invalidEnumValues = this.getInvalidEnumValues(candidate);

    console.error("==================================");
    console.error("VALIDATION FAILED");
    console.error("==================================");
    console.error("");
    console.error((error as Error).message);
    console.error("");
    console.error("Missing fields");
    console.error(missingFields.length > 0 ? missingFields : ["<none>"]);
    console.error("");
    console.error("Empty arrays");
    console.error(emptyArrays.length > 0 ? emptyArrays : ["<none>"]);
    console.error("");
    console.error("Invalid enum values");
    console.error(invalidEnumValues.length > 0 ? invalidEnumValues : ["<none>"]);
  }

  private getMissingFields(candidate: Record<string, unknown> | null): string[] {
    const fields = [
      "task",
      "language",
      "difficulty",
      "needsWeb",
      "needsVision",
      "estimatedTokens",
      "preferredCapabilities",
      "requiresReasoning",
      "requiresLongContext",
      "confidence",
      "reason"
    ];

    if (!candidate) {
      return fields;
    }

    return fields.filter((field) => !(field in candidate));
  }

  private getEmptyArrays(candidate: Record<string, unknown> | null): string[] {
    if (!candidate) {
      return [];
    }

    return ["preferredCapabilities"].filter((field) => {
      const value = candidate[field];
      return Array.isArray(value) && value.length === 0;
    });
  }

  private getInvalidEnumValues(candidate: Record<string, unknown> | null): string[] {
    if (!candidate) {
      return ["task", "difficulty"];
    }

    const invalid: string[] = [];
    const task = candidate.task;
    const difficulty = candidate.difficulty;

    const allowedTasks = ["coding", "translation", "summarization", "creative_writing", "mathematics", "reasoning", "general"];
    const allowedDifficulties = ["easy", "medium", "hard"];

    if (typeof task !== "string" || !allowedTasks.includes(task)) {
      invalid.push(`task=${String(task)}`);
    }

    if (typeof difficulty !== "string" || !allowedDifficulties.includes(difficulty)) {
      invalid.push(`difficulty=${String(difficulty)}`);
    }

    return invalid;
  }

}
