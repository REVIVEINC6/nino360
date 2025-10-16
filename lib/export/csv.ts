"use server"

export async function generateCsv(data: any[], headers: string[]): Promise<string> {
  const rows = [headers.join(",")]

  for (const item of data) {
    const row = headers.map((h) => {
      const value = item[h] ?? ""
      // Escape commas and quotes
      if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    })
    rows.push(row.join(","))
  }

  return rows.join("\n")
}
