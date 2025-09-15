import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { rpa } from "@/lib/rpa/automation-service"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const fileContent = await file.text()
    const lines = fileContent.split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    const companies = []
    const errors = []

    // Process each row
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue

      try {
        const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim())
        const company: any = {}

        // Map CSV columns to database fields
        headers.forEach((header, index) => {
          const value = values[index]
          switch (header.toLowerCase()) {
            case "name":
              company.name = value
              break
            case "industry":
              company.industry = value
              break
            case "revenue range":
            case "revenue":
              company.revenue_range = value
              break
            case "employee count":
            case "employees":
              company.employee_count = value
              break
            case "website":
              company.website = value
              break
            case "phone":
              company.phone = value
              break
            case "email":
              company.email = value
              break
            case "status":
              company.status = value.toLowerCase()
              break
            case "owner":
              company.owner_name = value
              break
            case "hq city":
            case "city":
              company.hq_city = value
              break
            case "hq country":
            case "country":
              company.hq_country = value
              break
            case "description":
              company.description = value
              break
          }
        })

        // Validate required fields
        if (!company.name) {
          errors.push(`Row ${i + 1}: Company name is required`)
          continue
        }

        // Set defaults
        company.tenant_id = "550e8400-e29b-41d4-a716-446655440000" // Default tenant
        company.status = company.status || "prospect"
        company.engagement_score = 0
        company.created_at = new Date().toISOString()
        company.updated_at = new Date().toISOString()

        companies.push(company)
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : "Invalid data format"}`)
      }
    }

    if (companies.length === 0) {
      return NextResponse.json(
        {
          error: "No valid companies found in file",
          errors,
        },
        { status: 400 },
      )
    }

    // Insert companies in batches
    const batchSize = 100
    const insertedCompanies = []

    for (let i = 0; i < companies.length; i += batchSize) {
      const batch = companies.slice(i, i + batchSize)

      const { data, error } = await supabase.from("companies").insert(batch).select()

      if (error) {
        console.error("Batch insert error:", error)
        errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`)
      } else {
        insertedCompanies.push(...(data || []))
      }
    }

    // Create RPA automation task for post-import processing
    try {
      await rpa.createTask({
        name: "Company Import Post-Processing",
        type: "company_import_processing",
        priority: "normal",
        parameters: {
          importedCount: insertedCompanies.length,
          errorCount: errors.length,
          timestamp: new Date().toISOString(),
        },
      })
    } catch (rpaError) {
      console.error("RPA task creation failed:", rpaError)
    }

    return NextResponse.json({
      success: true,
      data: {
        imported: insertedCompanies.length,
        errors: errors.length,
        companies: insertedCompanies,
      },
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully imported ${insertedCompanies.length} companies${errors.length > 0 ? ` with ${errors.length} errors` : ""}`,
    })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json({ error: "Import failed" }, { status: 500 })
  }
}
