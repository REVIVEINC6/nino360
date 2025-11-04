"use client"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface AutoVizProps {
  payload: {
    viz: string
    x?: string
    y?: string[]
    rows: any[]
    cols: string[]
  }
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export function AutoViz({ payload }: AutoVizProps) {
  const { viz, x, y, rows, cols } = payload

  if (!rows || rows.length === 0) {
    return <div className="text-muted-foreground text-sm">No data to display</div>
  }

  if (viz === "table" || !x || !y) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              {cols.map((col) => (
                <th key={col} className="p-2 text-left font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b">
                {cols.map((col) => (
                  <td key={col} className="p-2">
                    {row[col]?.toString() || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (viz === "line") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={x} fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          {y.map((key, i) => (
            <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    )
  }

  if (viz === "bar") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={x} fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          {y.map((key, i) => (
            <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return <div className="text-muted-foreground text-sm">Unsupported visualization type</div>
}
