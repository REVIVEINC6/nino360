"use server"

import { createServerClient } from "@/lib/supabase/server"
import { sha256Hex } from "@/lib/hash"

/**
 * Generate EDI 834 file (stub implementation)
 * In production, this would generate a proper EDI 834 file format
 */
export async function generateEdi834(input: {
  carrierId: string
  periodFrom: string
  periodTo: string
}) {
  const supabase = await createServerClient()

  // Get carrier details
  const { data: carrier, error: carrierError } = await supabase
    .from("carriers")
    .select("*")
    .eq("id", input.carrierId)
    .single()

  if (carrierError || !carrier) {
    throw new Error("Carrier not found")
  }

  // Get enrollments in the period
  const { data: enrollments, error: enrollError } = await supabase
    .from("enrollments")
    .select(`
      *,
      employee:employees(*),
      plan:plans(*),
      option:plan_options(*),
      lines:enrollment_lines(*, dependent:dependents(*))
    `)
    .eq("plan.carrier_id", input.carrierId)
    .gte("coverage_start", input.periodFrom)
    .lte("coverage_start", input.periodTo)
    .eq("status", "APPROVED")

  if (enrollError) {
    throw new Error("Failed to fetch enrollments")
  }

  // Generate EDI 834 content (stub)
  const controlNo = `834${Date.now()}`
  const ediContent = generateEdi834Content({
    carrier,
    enrollments: enrollments || [],
    controlNo,
    periodFrom: input.periodFrom,
    periodTo: input.periodTo,
  })

  // Compute hash
  const fileHash = sha256Hex(ediContent)

  // In production, upload to blob storage
  const fileUrl = `https://storage.example.com/edi/${controlNo}.txt`

  // Create EDI run record
  const { data: run, error: runError } = await supabase
    .from("edi_runs")
    .insert({
      tenant_id: carrier.tenant_id,
      carrier_id: input.carrierId,
      file_url: fileUrl,
      control_no: controlNo,
      period_from: input.periodFrom,
      period_to: input.periodTo,
      status: "GENERATED",
      sha256: fileHash,
    })
    .select()
    .single()

  if (runError) {
    throw new Error("Failed to create EDI run")
  }

  return {
    success: true,
    runId: run.id,
    controlNo,
    fileUrl,
    sha256: fileHash,
  }
}

/**
 * Generate EDI 834 content (stub)
 */
function generateEdi834Content(input: {
  carrier: any
  enrollments: any[]
  controlNo: string
  periodFrom: string
  periodTo: string
}): string {
  const lines: string[] = []

  // ISA segment (Interchange Control Header)
  lines.push(
    `ISA*00*          *00*          *ZZ*${input.carrier.edi_sender_id?.padEnd(15) || "SENDER".padEnd(15)}*ZZ*${input.carrier.edi_sender_id?.padEnd(15) || "RECEIVER".padEnd(15)}*${new Date().toISOString().slice(0, 10).replace(/-/g, "")}*${new Date().toTimeString().slice(0, 5).replace(/:/g, "")}*U*00401*${input.controlNo}*0*P*>~`,
  )

  // GS segment (Functional Group Header)
  lines.push(
    `GS*BE*${input.carrier.edi_sender_id || "SENDER"}*RECEIVER*${new Date().toISOString().slice(0, 10).replace(/-/g, "")}*${new Date().toTimeString().slice(0, 5).replace(/:/g, "")}*1*X*004010~`,
  )

  // ST segment (Transaction Set Header)
  lines.push(`ST*834*0001~`)

  // BGN segment (Beginning Segment)
  lines.push(
    `BGN*00*${input.controlNo}*${new Date().toISOString().slice(0, 10).replace(/-/g, "")}*${new Date().toTimeString().slice(0, 5).replace(/:/g, "")}~`,
  )

  // Add enrollment data (simplified)
  for (const enrollment of input.enrollments) {
    // INS segment (Member Level Detail)
    lines.push(`INS*Y*18*021*20*A***FT~`)

    // REF segment (Member Identification)
    lines.push(`REF*0F*${enrollment.employee.id}~`)

    // NM1 segment (Member Name)
    lines.push(
      `NM1*IL*1*${enrollment.employee.last_name}*${enrollment.employee.first_name}****MI*${enrollment.employee.id}~`,
    )

    // HD segment (Health Coverage)
    lines.push(`HD*021**${enrollment.plan.type}*${enrollment.option.coverage_tier}~`)

    // DTP segment (Coverage Dates)
    lines.push(`DTP*348*D8*${enrollment.coverage_start.replace(/-/g, "")}~`)
  }

  // SE segment (Transaction Set Trailer)
  lines.push(`SE*${lines.length + 2}*0001~`)

  // GE segment (Functional Group Trailer)
  lines.push(`GE*1*1~`)

  // IEA segment (Interchange Control Trailer)
  lines.push(`IEA*1*${input.controlNo}~`)

  return lines.join("\n")
}

/**
 * Parse EDI 997 acknowledgment (stub)
 */
export async function parseEdi997Ack(runId: string, ackContent: string) {
  const supabase = await createServerClient()

  // Parse acknowledgment (stub - in production, parse actual EDI 997)
  const accepted = ackContent.includes("AK5*A") || ackContent.includes("accepted")
  const status = accepted ? "ACK_ACCEPTED" : "ACK_REJECTED"

  // Update run status
  const { error } = await supabase
    .from("edi_runs")
    .update({
      status,
      ack_notes: ackContent.slice(0, 500),
      updated_at: new Date().toISOString(),
    })
    .eq("id", runId)

  if (error) {
    throw new Error("Failed to update EDI run")
  }

  return { success: true, status }
}
