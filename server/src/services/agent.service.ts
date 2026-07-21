import type { DecisionEngine } from "../decision/DecisionEngine.js";
import type { ProviderRegistry } from "../registry/ProviderRegistry.js";
import { TaskType } from "../models/TaskType.js";
import { Difficulty } from "../models/Difficulty.js";

export type AgentEditRequest = {
  instruction: string;
  language: string;
  selection: string;
};

export type AgentEditResponse = {
  success: true;
  action: "replaceSelection";
  replacement: string;
};

export class AgentService {
  constructor(
    private readonly decisionEngine: DecisionEngine,
    private readonly providerRegistry: ProviderRegistry
  ) {}

  async edit(request: AgentEditRequest): Promise<AgentEditResponse> {
    const routingDecision = this.decisionEngine.decide({
      task: TaskType.CODING,
      language: request.language,
      difficulty: Difficulty.MEDIUM,
      needsWeb: false,
      needsVision: false,
      estimatedTokens: Math.max(50, Math.min(4000, request.selection.length * 2)),
      preferredCapabilities: ["code_generation", "reasoning"],
      requiresReasoning: true,
      requiresLongContext: request.selection.length > 4000,
      confidence: 0.9,
      reason: "Code editing request requires a local coding provider."
    });

    const provider = this.providerRegistry.getProviderByModel(routingDecision.model);
    if (!provider) {
      throw new Error(`No provider registered for model "${routingDecision.model}".`);
    }

    const systemPrompt = [
      "You are TokenPilot's code editor.",
      "",
      "You NEVER explain.",
      "",
      "You NEVER return markdown.",
      "",
      "You return ONLY replacement code."
    ].join("\n");

    const prompt = [
      systemPrompt,
      "",
      `Language: ${request.language}`,
      `Instruction: ${request.instruction}`,
      "",
      "Selection:",
      request.selection
    ].join("\n");

    const replacement = await provider.generate(prompt);

    return {
      success: true,
      action: "replaceSelection",
      replacement
    };
  }
}
