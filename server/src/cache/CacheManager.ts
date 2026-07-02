export class CacheManager<T> {
  private store = new Map<string, T>();

  get(key: string) {
    return this.store.get(key);
  }

  set(key: string, value: T) {
    this.store.set(key, value);
  }

  clear() {
    this.store.clear();
  }
}

