import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { RequestAnalysis } from "../models/RequestAnalysis.js";
import type { ProviderRegistry } from "../registry/ProviderRegistry.js";
import { CapabilityMatcher } from "./CapabilityMatcher.js";
import { CostOptimizer } from "./CostOptimizer.js";
import { ProviderSelector } from "./ProviderSelector.js";
import type { RoutingDecision } from "./RoutingDecision.js";

type RoutingPolicy = {
  preferLocalModels: boolean;
  costSensitivity: number;
  qualitySensitivity: number;
  latencySensitivity: number;
  confidenceThreshold: number;
  qualityMargin: number;
};

export class DecisionEngine {
  private readonly capabilityMatcher = new CapabilityMatcher();
  private readonly costOptimizer = new CostOptimizer();
  private readonly providerSelector = new ProviderSelector();
  private readonly routingPolicy: RoutingPolicy;

  constructor(private readonly providerRegistry: ProviderRegistry) {
    this.routingPolicy = this.loadRoutingPolicy();
  }

  decide(requestAnalysis: RequestAnalysis): RoutingDecision {
    console.log("DecisionEngine Started");

    const providers = this.providerRegistry.listRecords();
    console.log("Providers Loaded");

    const candidates = this.capabilityMatcher.match(requestAnalysis, providers);
    console.log("Capability Matching Finished");

    const optimized = this.costOptimizer.optimize(candidates, requestAnalysis, this.routingPolicy);
    console.log("Cost Optimization Finished");

    const selected = this.providerSelector.select(optimized);
    console.log("Provider Selected");
    console.log("Decision Complete");

    return selected;
  }

  private loadRoutingPolicy(): RoutingPolicy {
    const filePath = resolve(process.cwd(), "config", "routingPolicy.json");
    const content = readFileSync(filePath, "utf8");
    return JSON.parse(content) as RoutingPolicy;
  }
}
