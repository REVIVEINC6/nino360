"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  CheckCircle2,
  XCircle,
  DollarSign,
  Users,
  Settings,
  BarChart3,
  Globe,
  Briefcase,
  Search,
  Filter,
} from "lucide-react"

export function TalentMarketplaceContent() {
  const [activeTab, setActiveTab] = useState("job-boards")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="glass-card rounded-2xl border border-white/20 bg-white/40 p-8 shadow-xl backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Talent Marketplace
              </h1>
              <p className="mt-2 text-lg text-gray-600">Connect with job boards, vendors, and talent networks</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
              <Globe className="mr-2 h-4 w-4" />
              Add Integration
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              { label: "Active Integrations", value: "12", icon: CheckCircle2, color: "text-green-600" },
              { label: "Job Postings", value: "156", icon: Briefcase, color: "text-blue-600" },
              { label: "Applications", value: "2,847", icon: Users, color: "text-purple-600" },
              { label: "Cost per Hire", value: "$1,245", icon: DollarSign, color: "text-orange-600" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card rounded-xl border border-white/20 bg-white/60 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-card border border-white/20 bg-white/60 p-1 backdrop-blur-sm">
            <TabsTrigger value="job-boards">Job Boards</TabsTrigger>
            <TabsTrigger value="vendors">Staffing Vendors</TabsTrigger>
            <TabsTrigger value="networks">Talent Networks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="job-boards" className="space-y-6">
            {/* Search and Filter */}
            <div className="glass-card rounded-xl border border-white/20 bg-white/60 p-4 backdrop-blur-sm">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search integrations..." className="pl-10 bg-white/80" />
                </div>
                <Button variant="outline" className="bg-white/80">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Job Boards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "LinkedIn",
                  connected: true,
                  posts: 45,
                  applications: 892,
                  cost: "$2,450",
                  quality: 4.5,
                  logo: "🔗",
                },
                {
                  name: "Indeed",
                  connected: true,
                  posts: 67,
                  applications: 1245,
                  cost: "$1,890",
                  quality: 4.2,
                  logo: "📋",
                },
                {
                  name: "Glassdoor",
                  connected: false,
                  posts: 0,
                  applications: 0,
                  cost: "$0",
                  quality: 0,
                  logo: "🏢",
                },
                {
                  name: "ZipRecruiter",
                  connected: true,
                  posts: 34,
                  applications: 567,
                  cost: "$1,234",
                  quality: 3.8,
                  logo: "⚡",
                },
                {
                  name: "Monster",
                  connected: false,
                  posts: 0,
                  applications: 0,
                  cost: "$0",
                  quality: 0,
                  logo: "👾",
                },
                {
                  name: "CareerBuilder",
                  connected: true,
                  posts: 23,
                  applications: 345,
                  cost: "$987",
                  quality: 3.9,
                  logo: "🏗️",
                },
              ].map((board) => (
                <Card
                  key={board.name}
                  className="glass-card border border-white/20 bg-white/60 p-6 backdrop-blur-sm transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{board.logo}</div>
                      <div>
                        <p className="font-semibold text-gray-900">{board.name}</p>
                        {board.connected ? (
                          <Badge className="mt-1 bg-green-100 text-green-700">Connected</Badge>
                        ) : (
                          <Badge variant="secondary" className="mt-1">
                            Not Connected
                          </Badge>
                        )}
                      </div>
                    </div>
                    {board.connected ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>

                  {board.connected && (
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Active Posts</span>
                        <span className="font-semibold text-gray-900">{board.posts}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Applications</span>
                        <span className="font-semibold text-gray-900">{board.applications}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Cost</span>
                        <span className="font-semibold text-gray-900">{board.cost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Quality Score</span>
                        <span className="font-semibold text-gray-900">{board.quality}/5.0</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant={board.connected ? "outline" : "default"}
                      size="sm"
                      className={
                        board.connected
                          ? "flex-1 bg-white/80"
                          : "flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      }
                    >
                      {board.connected ? "Configure" : "Connect"}
                    </Button>
                    {board.connected && (
                      <Button variant="outline" size="sm" className="bg-white/80">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vendors" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  name: "TechStaff Solutions",
                  type: "IT Staffing",
                  active: true,
                  placements: 12,
                  avgTime: "18 days",
                  rating: 4.7,
                },
                {
                  name: "Global Talent Partners",
                  type: "Executive Search",
                  active: true,
                  placements: 5,
                  avgTime: "45 days",
                  rating: 4.9,
                },
                {
                  name: "QuickHire Staffing",
                  type: "Contract Staffing",
                  active: false,
                  placements: 0,
                  avgTime: "-",
                  rating: 0,
                },
              ].map((vendor) => (
                <Card key={vendor.name} className="glass-card border border-white/20 bg-white/60 p-6 backdrop-blur-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-gray-900">{vendor.name}</p>
                      <p className="text-sm text-gray-600">{vendor.type}</p>
                    </div>
                    {vendor.active ? (
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>

                  {vendor.active && (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Placements</span>
                        <span className="font-semibold text-gray-900">{vendor.placements}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Avg Time to Fill</span>
                        <span className="font-semibold text-gray-900">{vendor.avgTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rating</span>
                        <span className="font-semibold text-gray-900">{vendor.rating}/5.0</span>
                      </div>
                    </div>
                  )}

                  <Button variant="outline" size="sm" className="w-full bg-white/80">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Vendor
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="networks" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Alumni Network", members: 1245, engaged: 892, logo: "🎓" },
                { name: "Employee Referrals", members: 456, engaged: 234, logo: "👥" },
                { name: "Talent Community", members: 3456, engaged: 1234, logo: "🌐" },
              ].map((network) => (
                <Card key={network.name} className="glass-card border border-white/20 bg-white/60 p-6 backdrop-blur-sm">
                  <div className="text-3xl mb-3">{network.logo}</div>
                  <p className="font-semibold text-gray-900 mb-1">{network.name}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Members</span>
                      <span className="font-semibold text-gray-900">{network.members.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Engaged</span>
                      <span className="font-semibold text-gray-900">{network.engaged.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-white/80">
                    View Network
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="glass-card rounded-xl border border-white/20 bg-white/60 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Source Performance</h3>
              <div className="space-y-4">
                {[
                  { source: "LinkedIn", applications: 892, hires: 23, cost: "$2,450", roi: "340%" },
                  { source: "Indeed", applications: 1245, hires: 31, cost: "$1,890", roi: "420%" },
                  { source: "Employee Referrals", applications: 234, hires: 45, cost: "$0", roi: "∞" },
                  { source: "ZipRecruiter", applications: 567, hires: 12, cost: "$1,234", roi: "280%" },
                ].map((source) => (
                  <div key={source.source} className="flex items-center justify-between p-4 rounded-lg bg-white/60">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{source.source}</p>
                      <p className="text-sm text-gray-600">
                        {source.applications} applications • {source.hires} hires
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Cost</p>
                        <p className="font-semibold text-gray-900">{source.cost}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">ROI</p>
                        <p className="font-semibold text-green-600">{source.roi}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
