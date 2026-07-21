import type { Provider } from "../providers/Provider.js";

export interface ProviderMetadata {
  providerName: string;
  model: string;
  supportsVision: boolean;
  supportsReasoning: boolean;
  supportsLongContext: boolean;
  supportsWeb: boolean;
  isLocal: boolean;
  estimatedLatencyMs: number;
  estimatedCostPerMillionTokens: number;
  maxContext: number;
}

export type ProviderRecord = {
  provider: Provider;
  metadata: ProviderMetadata;
};

export class ProviderRegistry {
  private readonly providers = new Map<string, ProviderRecord>();

  register(provider: Provider, metadata: ProviderMetadata): void {
    this.providers.set(provider.name, { provider, metadata });
  }

  getProvider(name: string): Provider | undefined {
    return this.providers.get(name)?.provider;
  }

  getProviderByModel(model: string): Provider | undefined {
    for (const record of this.providers.values()) {
      if (record.metadata.model === model) {
        return record.provider;
      }
    }

    return undefined;
  }

  getRecord(name: string): ProviderRecord | undefined {
    return this.providers.get(name);
  }

  listProviders(): Provider[] {
    return [...this.providers.values()].map((record) => record.provider);
  }

  listRecords(): ProviderRecord[] {
    return [...this.providers.values()];
  }
}
