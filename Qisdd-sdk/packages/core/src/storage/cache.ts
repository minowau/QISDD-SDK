// QISDD-SDK Storage: Cache
export class Cache {
  [x: string]: any;
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor(config: any) {
    // Initialize cache (Redis, in-memory, etc.)
  }

  // Get a value from cache
  public get(key: string): any {
    return this.cache.get(key);
  }

  // Set a value in cache
  public set(key: string, value: any, ttl?: number): void {
    this.cache.set(key, value);
    if (ttl) {
      if (this.timeouts.has(key)) clearTimeout(this.timeouts.get(key));
      const timeout = setTimeout(() => {
        this.cache.delete(key);
        this.timeouts.delete(key);
      }, ttl * 1000);
      this.timeouts.set(key, timeout);
    }
  }

  // Delete a value from cache
  public delete(key: string): void {
    this.cache.delete(key);
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
      this.timeouts.delete(key);
    } else {
      this.console.error("has not deleted yet");
    }
  }
}
