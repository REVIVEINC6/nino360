"use server"

type GenerateCsvInput = { headers: string[]; rows: any[] }

export async function generateCsv(input: GenerateCsvInput | any[], headers?: string[]): Promise<string> {
  let rowsData: any[] = []
  let hdrs: string[] = []

  if (Array.isArray(input) && headers) {
    rowsData = input
    hdrs = headers
  } else if (!Array.isArray(input) && (input as GenerateCsvInput).headers) {
    hdrs = (input as GenerateCsvInput).headers
    rowsData = (input as GenerateCsvInput).rows || []
  } else {
    // Fallback: try to treat input as rows and infer headers from first object
    rowsData = Array.isArray(input) ? input : []
    hdrs = headers || (rowsData[0] ? Object.keys(rowsData[0]) : [])
  }

  const lines = [hdrs.join(",")]

  for (const item of rowsData) {
    const row = hdrs.map((h) => {
      const value = item[h] ?? ""
      // Escape commas and quotes
      if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return String(value)
    })
    lines.push(row.join(","))
  }

  return lines.join("\n")
}
