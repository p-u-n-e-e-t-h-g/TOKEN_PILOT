import { RequestAnalyzerService } from "./RequestAnalyzerService.js";
import type { RequestAnalysis } from "../models/RequestAnalysis.js";

export type ChatResponse = {
  success: true;
  receivedPrompt: string;
  timestamp: string;
  analysis: RequestAnalysis;
};

export class ChatService {
  constructor(private readonly requestAnalyzerService: RequestAnalyzerService) {}

  async handleChat(prompt: string): Promise<ChatResponse> {
    const analysis = await this.requestAnalyzerService.analyze(prompt);

    return {
      success: true,
      receivedPrompt: prompt,
      timestamp: new Date().toISOString(),
      analysis
    };
  }
}
