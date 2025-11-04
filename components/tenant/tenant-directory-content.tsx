"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Mail, Phone, MapPin, Building2, Download } from "lucide-react"
import { getEmployeeDirectory, searchEmployees } from "@/app/(app)/tenant/directory/actions"

export function TenantDirectoryContent() {
  const [employees, setEmployees] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      const data = await getEmployeeDirectory()
      setEmployees(data)
    } catch (error) {
      console.error("Error loading employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      loadEmployees()
      return
    }

    try {
      const data = await searchEmployees(query)
      setEmployees(data)
    } catch (error) {
      console.error("Error searching employees:", error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return <div className="p-8">Loading directory...</div>
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Employee Directory
          </h1>
          <p className="text-muted-foreground mt-1">Browse and search all employees in your organization</p>
        </div>
        <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Download className="h-4 w-4 mr-2" />
          Export Directory
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white/50 backdrop-blur-sm border-white/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, department, or title..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <Card
            key={employee.id}
            className="p-6 bg-white/50 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={employee.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-500 text-white">
                  {getInitials(employee.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{employee.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{employee.title}</p>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{employee.department}</span>
                  </div>

                  {employee.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${employee.email}`} className="truncate hover:text-blue-600">
                        {employee.email}
                      </a>
                    </div>
                  )}

                  {employee.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${employee.phone}`} className="truncate hover:text-blue-600">
                        {employee.phone}
                      </a>
                    </div>
                  )}

                  {employee.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{employee.location}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Badge variant={employee.status === "active" ? "default" : "secondary"}>{employee.status}</Badge>
                  {employee.employment_type && <Badge variant="outline">{employee.employment_type}</Badge>}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {employees.length === 0 && (
        <Card className="p-12 text-center bg-white/50 backdrop-blur-sm border-white/20">
          <p className="text-muted-foreground">No employees found</p>
        </Card>
      )}
    </div>
  )
}
