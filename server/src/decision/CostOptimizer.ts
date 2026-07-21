import type { RequestAnalysis } from "../models/RequestAnalysis.js";
import type { ProviderRecord } from "../registry/ProviderRegistry.js";

export type ScoredProviderRecord = ProviderRecord & {
  score: number;
  estimatedCost: number;
  estimatedLatency: number;
};

export class CostOptimizer {
  optimize(
    candidates: ProviderRecord[],
    requestAnalysis: RequestAnalysis,
    policy: {
      preferLocalModels: boolean;
      costSensitivity: number;
      qualitySensitivity: number;
      latencySensitivity: number;
      confidenceThreshold: number;
      qualityMargin: number;
    }
  ): ScoredProviderRecord[] {
    const taskBoost = this.getTaskBoost(requestAnalysis.task);

    return candidates
      .map((record) => {
        const { metadata } = record;
        const qualityScore = this.getQualityScore(requestAnalysis, metadata);
        const costScore = 1 - this.normalizeCost(metadata.estimatedCostPerMillionTokens);
        const latencyScore = 1 - this.normalizeLatency(metadata.estimatedLatencyMs);
        const localityScore = metadata.isLocal ? 1 : 0;
        const estimatedCost =
          (requestAnalysis.estimatedTokens / 1_000_000) * metadata.estimatedCostPerMillionTokens;

        const score =
          qualityScore * policy.qualitySensitivity * 100 +
          costScore * policy.costSensitivity * 100 +
          latencyScore * policy.latencySensitivity * 100 +
          localityScore * (policy.preferLocalModels ? 8 : 0) +
          taskBoost;

        return {
          ...record,
          score: Math.round(score),
          estimatedCost,
          estimatedLatency: metadata.estimatedLatencyMs
        };
      })
      .sort((left, right) => right.score - left.score);
  }

  private getQualityScore(
    requestAnalysis: RequestAnalysis,
    metadata: ProviderRecord["metadata"]
  ): number {
    let score = 0.5;

    if (requestAnalysis.requiresReasoning && metadata.supportsReasoning) {
      score += 0.2;
    }

    if (requestAnalysis.requiresLongContext && metadata.maxContext >= requestAnalysis.estimatedTokens) {
      score += 0.15;
    }

    if (requestAnalysis.needsVision && metadata.supportsVision) {
      score += 0.15;
    }

    if (requestAnalysis.needsWeb && metadata.supportsWeb) {
      score += 0.1;
    }

    return Math.min(score, 1);
  }

  private normalizeCost(costPerMillionTokens: number): number {
    return Math.min(costPerMillionTokens / 20, 1);
  }

  private normalizeLatency(latencyMs: number): number {
    return Math.min(latencyMs / 5000, 1);
  }

  private getTaskBoost(task: RequestAnalysis["task"]): number {
    switch (task) {
      case "coding":
        return 6;
      case "reasoning":
        return 7;
      case "mathematics":
        return 6;
      case "translation":
        return 4;
      case "summarization":
        return 3;
      case "creative_writing":
        return 2;
      default:
        return 0;
    }
  }
}
