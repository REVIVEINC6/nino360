import { beforeAll, afterAll, beforeEach, afterEach } from "vitest"
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.test" })

// Test database client
let supabase: ReturnType<typeof createClient>

beforeAll(async () => {
  // Initialize test database connection
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials for testing")
  }

  supabase = createClient(supabaseUrl, supabaseKey)

  // Verify database connection
  const { error } = await supabase.from("core.tenants").select("count").limit(1)
  if (error) {
    console.error("Failed to connect to test database:", error)
  }
})

afterAll(async () => {
  // Cleanup test data if needed
  if (process.env.CLEANUP_TEST_DATA === "true") {
    console.log("Cleaning up test data...")
  }
})

beforeEach(async () => {
  // Setup for each test
})

afterEach(async () => {
  // Cleanup after each test
})

export { supabase }
