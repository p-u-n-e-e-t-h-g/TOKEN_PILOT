export type ClassificationResult = unknown;

export type RoutingDecision = {
  provider: string;
  model: string;
  reason: string;
  estimatedCost: number;
  confidence: number;
};

export class DecisionEngine {
  decide(_classification: ClassificationResult): RoutingDecision {
    return {
      provider: "ollama",
      model: "qwen2.5:3b",
      reason: "Complex prompt required semantic classification",
      estimatedCost: 0,
      confidence: 0.94
    };
  }
}
