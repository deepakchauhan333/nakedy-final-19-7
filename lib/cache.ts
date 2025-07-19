// Ultra-fast in-memory cache with compression
class UltraCache {
  private cache = new Map<string, { data: any; timestamp: number; compressed?: boolean }>();
  private readonly TTL = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_SIZE = 1000;

  private compress(data: any): string {
    try {
      return JSON.stringify(data);
    } catch {
      return '';
    }
  }

  private decompress(data: string): any {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  set(key: string, data: any): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.MAX_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data: this.compress(data),
      timestamp: Date.now(),
      compressed: true
    });
  }

  get(key: string): any {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Check if expired
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.compressed ? this.decompress(cached.data) : cached.data;
  }

  clear(): void {
    this.cache.clear();
  }

  // Preload critical data
  async preload(keys: string[], fetcher: (key: string) => Promise<any>): Promise<void> {
    const promises = keys.map(async (key) => {
      if (!this.get(key)) {
        try {
          const data = await fetcher(key);
          this.set(key, data);
        } catch (error) {
          console.warn(`Preload failed for ${key}:`, error);
        }
      }
    });

    await Promise.allSettled(promises);
  }
}

export const ultraCache = new UltraCache();