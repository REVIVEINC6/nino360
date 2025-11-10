// Utility for CSV export functionality

export function convertToCSV<T extends Record<string, any>>(
  data: T[],
  columns?: { key: keyof T; label: string }[],
): string {
  if (!data.length) return ""

  // If columns not specified, use all keys from first object
  const cols = columns || Object.keys(data[0]).map((key) => ({ key, label: key }))

  // Create header row
  const header = cols.map((col) => col.label).join(",")

  // Create data rows
  const rows = data.map((row) => {
    return cols
      .map((col) => {
        const value = row[col.key]
        // Handle null/undefined
        if (value === null || value === undefined) return ""
        // Handle arrays and objects
        if (typeof value === "object") return JSON.stringify(value)
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(value)
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(",")
  })

  return [header, ...rows].join("\n")
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function parseCSV(csv: string): string[][] {
  const lines = csv.split("\n")
  const result: string[][] = []

  for (const line of lines) {
    if (!line.trim()) continue

    const row: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i++ // Skip next quote
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === "," && !inQuotes) {
        row.push(current)
        current = ""
      } else {
        current += char
      }
    }

    row.push(current)
    result.push(row)
  }

  return result
}
