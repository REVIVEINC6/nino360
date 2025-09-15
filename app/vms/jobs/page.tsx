"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Briefcase, MapPin, Clock, DollarSign, Users, Search, Filter, Plus } from "lucide-react"

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: "Full-time" | "Part-time" | "Contract" | "Remote"
  salary: string
  posted: string
  applicants: number
  status: "Open" | "Closed" | "Draft"
  description: string
}

export default function VMSJobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [jobs] = useState<Job[]>([
    {
      id: "1",
      title: "Senior Sustainability Analyst",
      company: "GreenTech Solutions",
      location: "New York, NY",
      type: "Full-time",
      salary: "$85,000 - $110,000",
      posted: "2024-01-15",
      applicants: 24,
      status: "Open",
      description: "Lead sustainability analysis and reporting initiatives for our environmental team.",
    },
    {
      id: "2",
      title: "Sustainability Consultant",
      company: "EcoConsulting Group",
      location: "San Francisco, CA",
      type: "Contract",
      salary: "$120/hour",
      posted: "2024-01-14",
      applicants: 18,
      status: "Open",
      description: "Provide expert sustainability consulting services to enterprise clients.",
    },
    {
      id: "3",
      title: "Environmental Compliance Manager",
      company: "CleanEnergy Corp",
      location: "Remote",
      type: "Remote",
      salary: "$95,000 - $125,000",
      posted: "2024-01-13",
      applicants: 31,
      status: "Open",
      description: "Ensure environmental compliance across all company operations.",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800"
      case "Closed":
        return "bg-red-100 text-red-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "bg-blue-100 text-blue-800"
      case "Part-time":
        return "bg-purple-100 text-purple-800"
      case "Contract":
        return "bg-orange-100 text-orange-800"
      case "Remote":
        return "bg-teal-100 text-teal-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return "Invalid date"
    }
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Management</h1>
          <p className="text-muted-foreground">Manage job postings and applications</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Post New Job
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Briefcase className="mr-1 h-3 w-3" />
                      {job.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      Posted {formatDate(job.posted)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                  <Badge className={getTypeColor(job.type)}>{job.type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground line-clamp-2">{job.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <DollarSign className="mr-1 h-3 w-3" />
                    {job.salary}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="mr-1 h-3 w-3" />
                    {job.applicants} applicants
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">Manage Applications</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No jobs found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search criteria" : "No job postings available at the moment"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
