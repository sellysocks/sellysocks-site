interface CacheOptions {
  ttl?: number // Time to live in seconds
  staleWhileRevalidate?: number
}

class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  private isClient = typeof window !== "undefined"

  async get<T>(key: string, fetcher: () => Promise<T>, options: CacheOptions = {}): Promise<T> {
    const { ttl = 300, staleWhileRevalidate = 60 } = options // Default 5min cache, 1min stale
    const now = Date.now()
    const cached = this.cache.get(key)

    // Return fresh cache
    if (cached && now - cached.timestamp < cached.ttl * 1000) {
      return cached.data
    }

    // Return stale data while revalidating in background
    if (cached && now - cached.timestamp < (cached.ttl + staleWhileRevalidate) * 1000) {
      // Revalidate in background
      this.revalidate(key, fetcher, ttl).catch(console.error)
      return cached.data
    }

    // Fetch fresh data
    const data = await fetcher()
    this.cache.set(key, { data, timestamp: now, ttl })
    return data
  }

  private async revalidate<T>(key: string, fetcher: () => Promise<T>, ttl: number) {
    try {
      const data = await fetcher()
      this.cache.set(key, { data, timestamp: Date.now(), ttl })
    } catch (error) {
      console.error("Cache revalidation failed:", error)
    }
  }

  invalidate(key: string) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }
}

export const cache = new CacheManager()
