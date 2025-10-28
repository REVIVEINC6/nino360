import { expect, afterEach } from "vitest"
import { cleanup } from "@testing-library/react"
import * as matchers from "@testing-library/jest-dom/matchers"

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key"
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key"
// No Redis/Upstash env required anymore
