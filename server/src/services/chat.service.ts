import type { RequestAnalysis } from "../models/RequestAnalysis.js";
import type { RoutingDecision } from "../decision/RoutingDecision.js";
import type { DecisionEngine } from "../decision/DecisionEngine.js";
import type { ProviderRegistry } from "../registry/ProviderRegistry.js";
import { RequestAnalyzerService } from "./RequestAnalyzerService.js";

export type ChatResponse = {
  success: true;
  receivedPrompt: string;
  timestamp: string;
  analysis: RequestAnalysis;
  routingDecision: RoutingDecision;
  answer: string;
};

export class ChatService {
  constructor(
    private readonly requestAnalyzerService: RequestAnalyzerService,
    private readonly decisionEngine: DecisionEngine,
    private readonly providerRegistry: ProviderRegistry
  ) {}

  async handleChat(prompt: string): Promise<ChatResponse> {
    console.log("Analyzer Started");
    const analysis = await this.requestAnalyzerService.analyze(prompt);
    console.log("Analyzer Finished");

    console.log("Routing Started");
    const routingDecision = this.decisionEngine.decide(analysis);
    console.log("Routing Finished");

    const provider = this.providerRegistry.getProviderByModel(routingDecision.model);
    if (!provider) {
      throw new Error(`No provider registered for model "${routingDecision.model}".`);
    }

    console.log(`Selected Provider: ${provider.name}`);
    console.log("Provider Execution Started");
    const answer = await provider.generate(prompt);
    console.log("Provider Execution Finished");

    return {
      success: true,
      receivedPrompt: prompt,
      timestamp: new Date().toISOString(),
      analysis,
      routingDecision,
      answer
    };
  }
}
