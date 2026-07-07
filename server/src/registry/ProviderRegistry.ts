import type { Provider } from "../providers/Provider.js";

export class ProviderRegistry {
  private readonly providers = new Map<string, Provider>();

  register(provider: Provider): void {
    this.providers.set(provider.name, provider);
  }

  getProvider(name: string): Provider | undefined {
    return this.providers.get(name);
  }

  listProviders(): Provider[] {
    return [...this.providers.values()];
  }
}
