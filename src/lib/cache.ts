/**
 * Simple in-memory cache for content
 */
class ContentCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Get an item from the cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if the item has expired
    if (Date.now() - item.timestamp > this.DEFAULT_TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  /**
   * Set an item in the cache
   */
  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Set up automatic expiration
    setTimeout(() => {
      this.cache.delete(key);
    }, ttl);
  }

  /**
   * Remove an item from the cache
   */
  remove(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
  }
}

// Export a singleton instance
export const contentCache = new ContentCache();