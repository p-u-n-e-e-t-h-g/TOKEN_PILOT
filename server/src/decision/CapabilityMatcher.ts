import type { RequestAnalysis } from "../models/RequestAnalysis.js";
import type { ProviderRecord } from "../registry/ProviderRegistry.js";

export class CapabilityMatcher {
  match(requestAnalysis: RequestAnalysis, providerRecords: ProviderRecord[]): ProviderRecord[] {
    return providerRecords.filter((record) => {
      const { metadata } = record;

      if (requestAnalysis.needsVision && !metadata.supportsVision) {
        return false;
      }

      if (requestAnalysis.needsWeb && !metadata.supportsWeb) {
        return false;
      }

      if (requestAnalysis.requiresLongContext && metadata.maxContext < requestAnalysis.estimatedTokens) {
        return false;
      }

      if (requestAnalysis.requiresReasoning && !metadata.supportsReasoning) {
        return false;
      }

      return true;
    });
  }
}
