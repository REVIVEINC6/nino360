"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Sparkles, RefreshCw, Filter, FileText, UserPlus, Download } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { PageSidebar, PageSidebarSection } from "@/components/layout/page-sidebar"
import Link from "next/link"

interface CandidatesSidebarProps {
  totalCandidates: number
  selectedCount: number
  filters: any
  onRefresh?: () => void
  onClearFilters?: () => void
  onAddCandidate?: () => void
  onExport?: () => void
}

export function CandidatesSidebar({
  totalCandidates,
  selectedCount,
  filters,
  onRefresh,
  onClearFilters,
  onAddCandidate,
  onExport,
}: CandidatesSidebarProps) {
  const activeFiltersCount = Object.keys(filters).filter((key) => {
    const value = filters[key]
    return value && (Array.isArray(value) ? value.length > 0 : true)
  }).length

  return (
    <PageSidebar>
      <PageSidebarSection>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Navigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/talent/candidates">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                All Candidates
              </Button>
            </Link>
            <Link href="/talent/sourcing">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Sourcing Center
              </Button>
            </Link>
            <Link href="/talent/applicants">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <UserPlus className="mr-2 h-4 w-4" />
                Applicants
              </Button>
            </Link>
          </CardContent>
        </Card>
      </PageSidebarSection>

      <PageSidebarSection>
        {/* Overview Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Candidates</span>
              <Badge variant="secondary">{totalCandidates}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Selected</span>
              <Badge variant={selectedCount > 0 ? "default" : "secondary"}>{selectedCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Filters</span>
              <Badge variant={activeFiltersCount > 0 ? "default" : "secondary"}>{activeFiltersCount}</Badge>
            </div>
          </CardContent>
        </Card>
      </PageSidebarSection>

      <PageSidebarSection>
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {onAddCandidate && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent"
                onClick={onAddCandidate}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Candidate
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={() => onRefresh?.()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh List
            </Button>
            {onClearFilters && activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent"
                onClick={onClearFilters}
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
            {onExport && (
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={onExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            )}
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Recommendations
            </Button>
          </CardContent>
        </Card>
      </PageSidebarSection>

      <PageSidebarSection>
        {/* AI Insights */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <p className="font-medium mb-1">Top Skills in Pool</p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">Node.js</Badge>
                <Badge variant="secondary">Python</Badge>
                <Badge variant="secondary">AWS</Badge>
              </div>
            </div>
            <Separator />
            <div className="text-sm">
              <p className="font-medium mb-1">Trending</p>
              <p className="text-muted-foreground text-xs">15% increase in candidates with AI/ML skills this month</p>
            </div>
          </CardContent>
        </Card>
      </PageSidebarSection>

      <PageSidebarSection>
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">New</span>
              <Badge variant="secondary">24</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Screening</span>
              <Badge variant="secondary">18</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Interviewing</span>
              <Badge variant="secondary">12</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Offered</span>
              <Badge variant="secondary">5</Badge>
            </div>
          </CardContent>
        </Card>
      </PageSidebarSection>
    </PageSidebar>
  )
}
