# Supabase Client Usage Guide

## Overview

Nino360 uses centralized Supabase client factories to ensure consistent configuration, proper singleton patterns, and better error handling.

## Server-Side Usage

### In Server Components

\`\`\`typescript
import { createServerClient } from '@/lib/supabase/server'

export default async function MyPage() {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
  
  return <div>{/* render data */}</div>
}
\`\`\`

### In Server Actions

\`\`\`typescript
'use server'

import { createServerClient } from '@/lib/supabase/server'

export async function myAction(formData: FormData) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('users')
    .insert({ name: formData.get('name') })
  
  return { success: !error }
}
\`\`\`

### In API Routes

\`\`\`typescript
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
  
  return Response.json({ data, error })
}
\`\`\`

### Helper Functions

\`\`\`typescript
import { getUser, getSession } from '@/lib/supabase/server'

// Get current user
const user = await getUser()

// Get current session
const session = await getSession()
\`\`\`

## Client-Side Usage

### In Client Components

\`\`\`typescript
'use client'

import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function MyComponent() {
  const [data, setData] = useState(null)
  const supabase = getSupabaseBrowserClient()
  
  useEffect(() => {
    async function loadData() {
      const { data } = await supabase
        .from('users')
        .select('*')
      setData(data)
    }
    loadData()
  }, [])
  
  return <div>{/* render data */}</div>
}
\`\`\`

### With Realtime Subscriptions

\`\`\`typescript
'use client'

import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

export function RealtimeComponent() {
  const supabase = getSupabaseBrowserClient()
  
  useEffect(() => {
    const channel = supabase
      .channel('users-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users'
      }, (payload) => {
        console.log('Change received!', payload)
      })
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  
  return <div>Listening for changes...</div>
}
\`\`\`

## Migration Guide

### Before (Inline Client Creation)

\`\`\`typescript
// ❌ Don't do this
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function myAction() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
  
  // ... use supabase
}
\`\`\`

### After (Centralized Client)

\`\`\`typescript
// ✅ Do this instead
import { createServerClient } from '@/lib/supabase/server'

export async function myAction() {
  const supabase = await createServerClient()
  
  // ... use supabase
}
\`\`\`

## Benefits

1. **Consistency**: All clients use the same configuration
2. **Performance**: Singleton pattern prevents unnecessary client creation
3. **Error Handling**: Centralized error logging and validation
4. **Maintainability**: Update configuration in one place
5. **Type Safety**: Better TypeScript support
6. **Testing**: Easier to mock for tests

## Best Practices

1. **Always use the centralized factories**
   - Server: `createServerClient()` from `@/lib/supabase/server`
   - Client: `getSupabaseBrowserClient()` from `@/lib/supabase/client`

2. **Don't create multiple clients**
   - The factories handle singleton patterns
   - Reuse the same client instance

3. **Handle errors properly**
   - Always check for errors in responses
   - Use the error handler utilities

4. **Use helper functions when available**
   - `getUser()` and `getSession()` for common operations

5. **Clean up subscriptions**
   - Always unsubscribe from realtime channels
   - Use cleanup functions in useEffect

## Environment Variables

Required environment variables:

\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

Optional (for service role operations):

\`\`\`bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

## Troubleshooting

### Error: "Supabase environment variables are not configured"

Make sure you have set the required environment variables in your `.env.local` file or Vercel project settings.

### Error: "Cannot read properties of null"

This usually means the client wasn't initialized properly. Check that:
1. Environment variables are set correctly
2. You're using the correct factory function
3. You're awaiting the server client creation

### Realtime subscriptions not working

Make sure:
1. Realtime is enabled in your Supabase project
2. RLS policies allow the subscription
3. You're properly cleaning up subscriptions

## Examples

See the following files for examples:
- Server actions: `app/(dashboard)/dashboard/actions.ts`
- Client components: `app/(dashboard)/admin/audit/page.tsx`
- API routes: `app/api/webhooks/stripe/route.ts`
\`\`\`
