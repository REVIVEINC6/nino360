// Utility for advanced search and filtering

export interface FilterConfig {
  field: string
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "like" | "in" | "contains"
  value: any
}

export interface SortConfig {
  field: string
  direction: "asc" | "desc"
}

export interface PaginationConfig {
  page: number
  limit: number
}

export function buildFilterQuery(filters: FilterConfig[]) {
  return filters.map((filter) => {
    switch (filter.operator) {
      case "eq":
        return `${filter.field}.eq.${filter.value}`
      case "neq":
        return `${filter.field}.neq.${filter.value}`
      case "gt":
        return `${filter.field}.gt.${filter.value}`
      case "gte":
        return `${filter.field}.gte.${filter.value}`
      case "lt":
        return `${filter.field}.lt.${filter.value}`
      case "lte":
        return `${filter.field}.lte.${filter.value}`
      case "like":
        return `${filter.field}.ilike.%${filter.value}%`
      case "in":
        return `${filter.field}.in.(${Array.isArray(filter.value) ? filter.value.join(",") : filter.value})`
      case "contains":
        return `${filter.field}.cs.{${Array.isArray(filter.value) ? filter.value.join(",") : filter.value}}`
      default:
        return ""
    }
  })
}

export function applyFilters<T>(data: T[], filters: FilterConfig[]): T[] {
  return data.filter((item) => {
    return filters.every((filter) => {
      const value = (item as any)[filter.field]

      switch (filter.operator) {
        case "eq":
          return value === filter.value
        case "neq":
          return value !== filter.value
        case "gt":
          return value > filter.value
        case "gte":
          return value >= filter.value
        case "lt":
          return value < filter.value
        case "lte":
          return value <= filter.value
        case "like":
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase())
        case "in":
          return Array.isArray(filter.value) ? filter.value.includes(value) : value === filter.value
        case "contains":
          if (Array.isArray(value)) {
            return Array.isArray(filter.value)
              ? filter.value.some((v: any) => value.includes(v))
              : value.includes(filter.value)
          }
          return false
        default:
          return true
      }
    })
  })
}

export function applySort<T>(data: T[], sort: SortConfig): T[] {
  return [...data].sort((a, b) => {
    const aValue = (a as any)[sort.field]
    const bValue = (b as any)[sort.field]

    if (aValue === bValue) return 0

    const comparison = aValue < bValue ? -1 : 1
    return sort.direction === "asc" ? comparison : -comparison
  })
}

export function applyPagination<T>(
  data: T[],
  pagination: PaginationConfig,
): {
  data: T[]
  total: number
  page: number
  totalPages: number
} {
  const { page, limit } = pagination
  const start = (page - 1) * limit
  const end = start + limit

  return {
    data: data.slice(start, end),
    total: data.length,
    page,
    totalPages: Math.ceil(data.length / limit),
  }
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
