# Caching Strategy Guide

## Overview

Nino360 uses a multi-layered caching strategy to optimize performance:

1. **Server-side caching** with Next.js `unstable_cache`
2. **Client-side caching** with SWR
3. **Database query caching** with Supabase
4. **CDN caching** for static assets

## Server-Side Caching

### Using the cached wrapper

\`\`\`typescript
import { cached, CACHE_CONFIG, CACHE_TAGS } from '@/lib/cache'
import { createServerClient } from '@/lib/supabase/server'

const getUsers = cached(
  async (tenantId: string) => {
    const supabase = await createServerClient()
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('tenant_id', tenantId)
    return data
  },
  ['users', 'tenantId'], // Cache key parts
  {
    revalidate: CACHE_CONFIG.MEDIUM, // 5 minutes
    tags: [CACHE_TAGS.users] // For invalidation
  }
)
\`\`\`

### Cache durations

\`\`\`typescript
CACHE_CONFIG.SHORT      // 1 minute
CACHE_CONFIG.MEDIUM     // 5 minutes
CACHE_CONFIG.LONG       // 1 hour
CACHE_CONFIG.VERY_LONG  // 1 day
\`\`\`

### Cache invalidation

\`\`\`typescript
import { revalidateTag, revalidatePath } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache'

// In a server action after mutation
export async function createUser(data: FormData) {
  // ... create user
  
  // Invalidate users cache
  revalidateTag(CACHE_TAGS.users)
  
  // Or invalidate specific path
  revalidatePath('/dashboard/users')
}
\`\`\`

### Using cache helpers

\`\`\`typescript
import { getCachedUsers, invalidateUsers } from '@/lib/cache-helpers'

// Fetch cached data
const users = await getCachedUsers(tenantId)

// Invalidate after mutation
await invalidateUsers(tenantId)
\`\`\`

## Client-Side Caching

### Basic usage with SWR

\`\`\`typescript
'use client'

import { useCachedData } from '@/hooks/use-cached-data'
import { swrKeys } from '@/lib/cache'

export function UsersList() {
  const { data, error, isLoading } = useCachedData(
    swrKeys.users(tenantId)
  )
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading users</div>
  
  return <div>{/* render users */}</div>
}
\`\`\`

### With optimistic updates

\`\`\`typescript
'use client'

import { useCachedDataWithOptimistic } from '@/hooks/use-cached-data'
import { swrKeys } from '@/lib/cache'

export function UsersList() {
  const { data, optimisticUpdate } = useCachedDataWithOptimistic(
    swrKeys.users(tenantId)
  )
  
  const handleUpdate = async (userId: string, updates: any) => {
    // Optimistically update UI
    await optimisticUpdate((current) => 
      current?.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    )
    
    // Make actual API call
    await updateUser(userId, updates)
  }
  
  return <div>{/* render users */}</div>
}
\`\`\`

### Manual cache invalidation

\`\`\`typescript
import { mutate } from 'swr'
import { swrKeys } from '@/lib/cache'

// Invalidate specific key
mutate(swrKeys.users(tenantId))

// Invalidate all keys matching pattern
mutate(
  key => typeof key === 'string' && key.startsWith('users:'),
  undefined,
  { revalidate: true }
)
\`\`\`

## Cache Keys

### Server-side cache keys

\`\`\`typescript
import { getCacheKey } from '@/lib/cache'

const key = getCacheKey('users', tenantId, 'active')
// Result: "users:tenant-123:active"
\`\`\`

### Client-side cache keys

\`\`\`typescript
import { swrKeys } from '@/lib/cache'

swrKeys.users(tenantId)           // "users:tenant-123"
swrKeys.user(userId)              // "user:user-456"
swrKeys.candidates(tenantId, 'active') // "candidates:tenant-123:active"
\`\`\`

## Cache Tags

Use cache tags for bulk invalidation:

\`\`\`typescript
import { CACHE_TAGS } from '@/lib/cache'

CACHE_TAGS.users
CACHE_TAGS.tenants
CACHE_TAGS.clients
CACHE_TAGS.candidates
CACHE_TAGS.jobs
CACHE_TAGS.projects
CACHE_TAGS.invoices
// ... etc
\`\`\`

## Best Practices

1. **Choose appropriate cache durations**
   - Frequently changing data: SHORT (1 min)
   - Moderately changing data: MEDIUM (5 min)
   - Rarely changing data: LONG (1 hour)
   - Static data: VERY_LONG (1 day)

2. **Always invalidate after mutations**
   - Use `revalidateTag` for related data
   - Use `revalidatePath` for specific pages
   - Use SWR `mutate` for client-side updates

3. **Use optimistic updates for better UX**
   - Update UI immediately
   - Rollback on error
   - Revalidate after success

4. **Avoid over-caching**
   - Don't cache user-specific data too long
   - Don't cache sensitive data
   - Consider cache size and memory usage

5. **Monitor cache performance**
   - Track cache hit rates
   - Monitor cache invalidation frequency
   - Adjust durations based on usage patterns

## SWR Configuration

Global SWR configuration is set in \`components/providers/swr-provider.tsx\`:

\`\`\`typescript
{
  revalidateOnFocus: true,        // Revalidate when window regains focus
  revalidateOnReconnect: true,    // Revalidate when network reconnects
  dedupingInterval: 2000,         // Dedupe requests within 2 seconds
  focusThrottleInterval: 300000,  // Throttle focus revalidation to 5 minutes
  shouldRetryOnError: true,       // Retry on error
  errorRetryCount: 3,             // Retry up to 3 times
  errorRetryInterval: 5000,       // Wait 5 seconds between retries
}
\`\`\`

## Examples

### Server Component with Caching

\`\`\`typescript
import { getCachedUsers } from '@/lib/cache-helpers'

export default async function UsersPage() {
  const users = await getCachedUsers(tenantId)
  
  return <UsersList users={users} />
}
\`\`\`

### Server Action with Cache Invalidation

\`\`\`typescript
'use server'

import { invalidateUsers } from '@/lib/cache-helpers'

export async function createUser(data: FormData) {
  // Create user in database
  const user = await db.users.create(...)
  
  // Invalidate cache
  await invalidateUsers(user.tenantId)
  
  return { success: true }
}
\`\`\`

### Client Component with SWR

\`\`\`typescript
'use client'

import { useCachedData } from '@/hooks/use-cached-data'
import { swrKeys } from '@/lib/cache'

export function DashboardStats() {
  const { data, isLoading } = useCachedData(
    swrKeys.dashboard(tenantId)
  )
  
  return <Stats data={data} loading={isLoading} />
}
\`\`\`

## Troubleshooting

### Cache not invalidating

- Check that you're using the correct cache tag
- Verify revalidateTag/revalidatePath is being called
- Check that the cache key matches exactly

### Stale data showing

- Reduce cache duration
- Add manual revalidation triggers
- Check SWR configuration

### Performance issues

- Reduce cache durations for frequently changing data
- Use more specific cache keys
- Consider pagination for large datasets
\`\`\`
