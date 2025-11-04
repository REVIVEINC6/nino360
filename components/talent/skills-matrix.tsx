"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, Target, Brain, Sparkles, Award, BookOpen, BarChart3, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SkillsMatrixProps {
  initialData: any
}

export function SkillsMatrix({ initialData }: SkillsMatrixProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-6 space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Target className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Skills Matrix</h1>
                <p className="text-blue-100 mt-1">AI-powered skill matching and gap analysis</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {[
            {
              label: "Total Skills",
              value: "247",
              change: "+12%",
              icon: BookOpen,
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Skill Gaps",
              value: "18",
              change: "-5%",
              icon: Target,
              color: "from-purple-500 to-pink-500",
            },
            {
              label: "Top Performers",
              value: "34",
              change: "+8%",
              icon: Award,
              color: "from-orange-500 to-red-500",
            },
            {
              label: "AI Match Score",
              value: "94%",
              change: "+3%",
              icon: Brain,
              color: "from-green-500 to-emerald-500",
            },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="relative overflow-hidden border-0 bg-white/60 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-linear-to-br ${stat.color} text-white shadow-lg`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="border-0 bg-white/60 backdrop-blur-md shadow-lg">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search skills, candidates, or jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/80 border-gray-200"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px] bg-white/80">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="soft">Soft Skills</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                  <SelectItem value="domain">Domain Knowledge</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="bg-white/80">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="matching" className="space-y-6">
          <TabsList className="bg-white/60 backdrop-blur-md border-0 shadow-lg p-1">
            <TabsTrigger value="matching" className="data-[state=active]:bg-white">
              <Target className="h-4 w-4 mr-2" />
              Skill Matching
            </TabsTrigger>
            <TabsTrigger value="gaps" className="data-[state=active]:bg-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Gap Analysis
            </TabsTrigger>
            <TabsTrigger value="matrix" className="data-[state=active]:bg-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Skills Matrix
            </TabsTrigger>
            <TabsTrigger value="development" className="data-[state=active]:bg-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Development Plans
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matching" className="space-y-4">
            <Card className="border-0 bg-white/60 backdrop-blur-md shadow-lg">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">AI-Powered Skill Matching</h3>
                  <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-700">
                    ML Powered
                  </Badge>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      candidate: "John Smith",
                      job: "Senior Full Stack Engineer",
                      match: 94,
                      skills: ["React", "Node.js", "AWS", "TypeScript", "PostgreSQL"],
                      gaps: ["Kubernetes", "GraphQL"],
                      aiInsight: "Strong technical fit with leadership potential",
                    },
                    {
                      candidate: "Sarah Johnson",
                      job: "Product Manager",
                      match: 91,
                      skills: ["Agile", "Roadmapping", "Analytics", "Stakeholder Management"],
                      gaps: ["Technical Writing"],
                      aiInsight: "Excellent strategic thinking and communication skills",
                    },
                    {
                      candidate: "Michael Chen",
                      job: "DevOps Engineer",
                      match: 88,
                      skills: ["Docker", "CI/CD", "Terraform", "Monitoring"],
                      gaps: ["Security", "Cost Optimization"],
                      aiInsight: "Strong automation skills, needs security training",
                    },
                  ].map((match) => (
                    <Card
                      key={match.candidate}
                      className="p-6 border-0 bg-linear-to-br from-white/80 to-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-semibold text-lg">{match.candidate}</p>
                          <p className="text-sm text-gray-600">{match.job}</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="default"
                            className="bg-linear-to-r from-green-500 to-emerald-500 text-white mb-2"
                          >
                            {match.match}% Match
                          </Badge>
                          <p className="text-xs text-gray-500">AI Confidence: High</p>
                        </div>
                      </div>

                      <Progress value={match.match} className="mb-4 h-2" />

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Matching Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {match.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="bg-green-100 text-green-700">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Skill Gaps</p>
                          <div className="flex flex-wrap gap-2">
                            {match.gaps.map((gap) => (
                              <Badge key={gap} variant="secondary" className="bg-orange-100 text-orange-700">
                                {gap}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <Brain className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-purple-900 mb-1">AI Insight</p>
                            <p className="text-sm text-purple-700">{match.aiInsight}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="flex-1">
                          View Profile
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          Schedule Interview
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="gaps" className="space-y-4">
            <Card className="border-0 bg-white/60 backdrop-blur-md shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-6">Organizational Skill Gaps</h3>
                <div className="space-y-4">
                  {[
                    {
                      skill: "Cloud Architecture",
                      current: 45,
                      target: 80,
                      gap: 35,
                      priority: "High",
                      employees: 12,
                    },
                    {
                      skill: "Machine Learning",
                      current: 30,
                      target: 70,
                      gap: 40,
                      priority: "Critical",
                      employees: 8,
                    },
                    {
                      skill: "Cybersecurity",
                      current: 60,
                      target: 90,
                      gap: 30,
                      priority: "High",
                      employees: 15,
                    },
                  ].map((gap) => (
                    <Card key={gap.skill} className="p-4 border-0 bg-linear-to-br from-white/80 to-white/60">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{gap.skill}</p>
                          <p className="text-sm text-gray-600">{gap.employees} employees</p>
                        </div>
                        <Badge
                          variant={gap.priority === "Critical" ? "destructive" : "default"}
                          className={gap.priority === "Critical" ? "" : "bg-orange-100 text-orange-700"}
                        >
                          {gap.priority}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Current: {gap.current}%</span>
                          <span className="text-gray-600">Target: {gap.target}%</span>
                        </div>
                        <Progress value={gap.current} className="h-2" />
                        <p className="text-sm text-red-600 font-medium">Gap: {gap.gap}%</p>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-3 bg-transparent">
                        Create Development Plan
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="matrix" className="space-y-4">
            <Card className="border-0 bg-white/60 backdrop-blur-md shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-6">Team Skills Matrix</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Employee</th>
                        <th className="text-center p-3 font-medium">React</th>
                        <th className="text-center p-3 font-medium">Node.js</th>
                        <th className="text-center p-3 font-medium">AWS</th>
                        <th className="text-center p-3 font-medium">Python</th>
                        <th className="text-center p-3 font-medium">Leadership</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          name: "John Smith",
                          skills: [5, 4, 5, 3, 4],
                        },
                        {
                          name: "Sarah Johnson",
                          skills: [4, 3, 4, 4, 5],
                        },
                        {
                          name: "Michael Chen",
                          skills: [3, 5, 5, 5, 3],
                        },
                      ].map((employee) => (
                        <tr key={employee.name} className="border-b hover:bg-white/50">
                          <td className="p-3 font-medium">{employee.name}</td>
                          {employee.skills.map((level, idx) => (
                            <td key={idx} className="text-center p-3">
                              <Badge
                                variant="secondary"
                                className={
                                  level >= 4
                                    ? "bg-green-100 text-green-700"
                                    : level >= 3
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-orange-100 text-orange-700"
                                }
                              >
                                {level}/5
                              </Badge>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="development" className="space-y-4">
            <Card className="border-0 bg-white/60 backdrop-blur-md shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-6">AI-Generated Development Plans</h3>
                <div className="space-y-4">
                  {[
                    {
                      employee: "John Smith",
                      skill: "Kubernetes",
                      duration: "3 months",
                      progress: 60,
                      activities: ["Online Course", "Hands-on Project", "Certification"],
                    },
                    {
                      employee: "Sarah Johnson",
                      skill: "Technical Writing",
                      duration: "2 months",
                      progress: 40,
                      activities: ["Workshop", "Mentorship", "Practice Docs"],
                    },
                  ].map((plan) => (
                    <Card
                      key={`${plan.employee}-${plan.skill}`}
                      className="p-4 border-0 bg-linear-to-br from-white/80 to-white/60"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium">{plan.employee}</p>
                          <p className="text-sm text-gray-600">Learning: {plan.skill}</p>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {plan.duration}
                        </Badge>
                      </div>
                      <Progress value={plan.progress} className="mb-3" />
                      <div className="flex flex-wrap gap-2 mb-3">
                        {plan.activities.map((activity) => (
                          <Badge key={activity} variant="outline">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        View Full Plan
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
