import type { RoutingDecision } from "./RoutingDecision.js";
import type { ScoredProviderRecord } from "./CostOptimizer.js";

export class ProviderSelector {
  select(sortedProviders: ScoredProviderRecord[]): RoutingDecision {
    const selected = sortedProviders[0];

    if (!selected) {
      throw new Error("No providers available after capability matching.");
    }

    const { metadata } = selected;

    return {
      providerName: metadata.providerName,
      model: metadata.model,
      score: selected.score,
      estimatedCost: selected.estimatedCost,
      estimatedLatency: selected.estimatedLatency,
      reason: "Local model satisfies required capabilities and routing policy prefers local execution.",
      confidence: 0.96
    };
  }
}
