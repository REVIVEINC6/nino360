import type { RawLead } from "./normalize"

function csvToRows(text: string): RawLead[] {
  // Simple CSV parser supporting commas and quoted values
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (!lines.length) return []
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, ""))
    .map((h) => h.toLowerCase())
  const rows: RawLead[] = []
  for (let i = 1; i < lines.length; i++) {
    const row = [] as string[]
    let cur = ""
    let inQuotes = false
    const line = lines[i]
    for (let c = 0; c < line.length; c++) {
      const ch = line[c]
      if (ch === '"') {
        if (inQuotes && line[c + 1] === '"') {
          cur += '"'; c++
        } else {
          inQuotes = !inQuotes
        }
      } else if (ch === "," && !inQuotes) {
        row.push(cur.trim())
        cur = ""
      } else {
        cur += ch
      }
    }
    row.push(cur.trim())
    const obj: any = {}
    headers.forEach((h, idx) => {
      obj[h] = (row[idx] || "").replace(/^"|"$/g, "")
    })
    rows.push(obj)
  }
  return rows
}

export async function parseCsv(buffer: Buffer): Promise<RawLead[]> {
  const text = buffer.toString("utf8")
  return csvToRows(text)
}

export async function parseTxt(buffer: Buffer): Promise<RawLead[]> {
  const text = buffer.toString("utf8")
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  // Heuristic: expect either CSV-looking lines or "Name - Company - Email"
  if (lines[0]?.includes(",")) return csvToRows(text)
  return lines.map((line) => {
    const parts = line.split(" - ")
    const [name, company, email] = parts
    const [first_name, ...rest] = (name || "").split(" ")
    const last_name = rest.join(" ")
    return { first_name, last_name, company, email }
  })
}

export async function parseXlsx(buffer: Buffer): Promise<RawLead[]> {
  try {
    const XLSX = await import("xlsx")
    const wb = XLSX.read(buffer, { type: "buffer" })
    const sheet = wb.Sheets[wb.SheetNames[0]]
  const json = XLSX.utils.sheet_to_json(sheet, { defval: "" })
  return json as unknown as RawLead[]
  } catch {
    // Fallback: try CSV
    return parseCsv(buffer)
  }
}

export async function parseDocx(buffer: Buffer): Promise<RawLead[]> {
  try {
    const mammoth = await import("mammoth")
    const { value } = await mammoth.extractRawText({ buffer })
    return await parseTxt(Buffer.from(value, "utf8"))
  } catch {
    return []
  }
}

export async function parsePdf(buffer: Buffer): Promise<RawLead[]> {
  try {
    const pdfParse = (await import("pdf-parse")).default as any
    const data = await pdfParse(buffer)
    return await parseTxt(Buffer.from(data.text || "", "utf8"))
  } catch {
    return []
  }
}
