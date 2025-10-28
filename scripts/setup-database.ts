/**
 * Database Setup Script
 *
 * This script helps you set up the Nino360 database schema in Supabase.
 *
 * Usage:
 *   npm run db:setup
 *
 * Or run individual scripts:
 *   npm run db:setup -- --script 01-create-tables
 */

import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { join } from "path"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing required environment variables:")
  console.error("   - SUPABASE_URL")
  console.error("   - SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const SCRIPTS_DIR = join(process.cwd(), "scripts")

// Scripts to run in order
const SCRIPT_ORDER = [
  "01-create-tables.sql",
  "02-enable-rls.sql",
  "03-seed-data.sql",
  "04-admin-module.sql",
  "05-tenant-admin.sql",
  "06-ats.sql",
  "07-bench.sql",
  "08-vms.sql",
  "09-rbac-fbac.sql",
  "10-finance.sql",
  "11-projects.sql",
  "12-reports.sql",
  "13-automation.sql",
  "14-hrms.sql",
  "15-crm.sql",
  "19-admin-enhancements.sql",
  "20-security-compliance.sql",
  "21-rbac-fbac-enhanced.sql",
  "22-rag-system.sql",
  "23-admin-governance.sql",
  "24-tenant-management.sql",
  "25-ats-talent.sql",
  "26-bench-management.sql",
  "27-finance-module.sql",
  "28-hrms-module.sql",
  "30-lead-billing-onboarding.sql",
  "31-user-settings.sql",
]

async function runScript(scriptName: string): Promise<boolean> {
  const scriptPath = join(SCRIPTS_DIR, scriptName)

  try {
    console.log(`\n📄 Running ${scriptName}...`)
    const sql = readFileSync(scriptPath, "utf-8")

    // Split by semicolons and run each statement
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"))

    for (const statement of statements) {
      const { error } = await supabase.rpc("exec_sql", { sql_query: statement })

      if (error) {
        // Ignore "already exists" errors
        if (error.message.includes("already exists") || error.message.includes("duplicate key")) {
          console.log(`   ⚠️  Skipping (already exists)`)
          continue
        }

        console.error(`   ❌ Error: ${error.message}`)
        return false
      }
    }

    console.log(`   ✅ Completed`)
    return true
  } catch (error) {
    console.error(`   ❌ Failed to read or execute script:`, error)
    return false
  }
}

async function verifySetup() {
  console.log("\n🔍 Verifying database setup...\n")

  // Check schemas
  const { data: schemas, error: schemasError } = await supabase.rpc("exec_sql", {
    sql_query: `
        SELECT schema_name FROM information_schema.schemata 
        WHERE schema_name IN ('core', 'sec', 'ai', 'app', 'ats', 'finance', 'bench', 'vms', 'hrms', 'crm', 'bill')
        ORDER BY schema_name
      `,
  })

  if (schemasError) {
    console.error("❌ Failed to verify schemas:", schemasError.message)
  } else {
    console.log("✅ Schemas created:", schemas?.length || 0)
  }

  // Check tables
  const { data: tables, error: tablesError } = await supabase.rpc("exec_sql", {
    sql_query: `
        SELECT table_schema, COUNT(*) as count
        FROM information_schema.tables 
        WHERE table_schema IN ('core', 'sec', 'ai', 'app', 'ats', 'finance', 'bench', 'vms', 'hrms', 'crm', 'bill')
        GROUP BY table_schema
        ORDER BY table_schema
      `,
  })

  if (tablesError) {
    console.error("❌ Failed to verify tables:", tablesError.message)
  } else {
    console.log("✅ Tables created:")
    tables?.forEach((row: any) => {
      console.log(`   - ${row.table_schema}: ${row.count} tables`)
    })
  }

  // Check functions
  const { data: functions, error: functionsError } = await supabase.rpc("exec_sql", {
    sql_query: `
        SELECT routine_schema, routine_name 
        FROM information_schema.routines 
        WHERE routine_schema IN ('sec', 'public')
          AND routine_name IN ('has_permission', 'has_feature', 'get_user_permissions', 'get_user_roles')
        ORDER BY routine_schema, routine_name
      `,
  })

  if (functionsError) {
    console.error("❌ Failed to verify functions:", functionsError.message)
  } else {
    console.log("✅ Functions created:", functions?.length || 0)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const specificScript = args.find((arg) => arg.startsWith("--script="))?.split("=")[1]

  console.log("🚀 Nino360 Database Setup\n")
  console.log(`📍 Supabase URL: ${supabaseUrl}`)
  console.log(`📁 Scripts directory: ${SCRIPTS_DIR}\n`)

  if (specificScript) {
    // Run specific script
    const success = await runScript(specificScript)
    process.exit(success ? 0 : 1)
  } else {
    // Run all scripts in order
    let successCount = 0
    let failCount = 0

    for (const script of SCRIPT_ORDER) {
      const success = await runScript(script)
      if (success) {
        successCount++
      } else {
        failCount++
        console.log("\n⚠️  Continuing with next script...")
      }
    }

    console.log("\n" + "=".repeat(60))
    console.log(`\n📊 Setup Summary:`)
    console.log(`   ✅ Successful: ${successCount}`)
    console.log(`   ❌ Failed: ${failCount}`)

    await verifySetup()

    console.log("\n" + "=".repeat(60))
    console.log("\n✨ Database setup complete!")
    console.log("\n📖 Next steps:")
    console.log("   1. Create your first tenant in the Supabase dashboard")
    console.log("   2. Sign up a user through the app")
    console.log("   3. Assign the user to the tenant with admin role")
    console.log("   4. Start using the application!\n")

    process.exit(failCount > 0 ? 1 : 0)
  }
}

main().catch(console.error)
