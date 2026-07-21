export interface RoutingDecision {
  providerName: string;
  model: string;
  score: number;
  estimatedCost: number;
  estimatedLatency: number;
  reason: string;
  confidence: number;
}
