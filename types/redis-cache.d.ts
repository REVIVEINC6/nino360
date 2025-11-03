declare module "@/lib/cache/redis-cache" {
  export interface CacheOptions {
    ttl?: number
    tags?: string[]
  }

  export const cache: {
    get<T = any>(key: string): Promise<T | null>
    set<T = any>(key: string, value: T, options?: CacheOptions): Promise<void>
    delete(key: string): Promise<void>
    invalidateTag(tag: string): Promise<void>
    invalidateTags(tags: string[]): Promise<void>
    getOrSet<T = any>(key: string, fetcher: () => Promise<T>, options?: CacheOptions): Promise<T>
  }

  export function getCacheKey(tenantId: string, resource: string, id?: string): string

  export function withCache<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options: { keyGenerator: (...args: Parameters<T>) => string; ttl?: number; tags?: string[] },
  ): T
}
