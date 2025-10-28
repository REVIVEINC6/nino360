"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Award,
  AlertCircle,
  Sparkles,
  Brain,
  Zap,
} from "lucide-react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { AIInsightCard } from "@/components/ai-insight-card"

export default function SkillsMatrixPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const skillCategories = [
    { id: "all", label: "All Skills", count: 156 },
    { id: "technical", label: "Technical", count: 78 },
    { id: "soft", label: "Soft Skills", count: 45 },
    { id: "leadership", label: "Leadership", count: 23 },
    { id: "domain", label: "Domain", count: 10 },
  ]

  const topSkills = [
    {
      id: 1,
      name: "React.js",
      category: "Technical",
      employees: 45,
      avgProficiency: 85,
      trend: "up",
      demand: "high",
      gap: -5,
      aiInsight: "High demand skill with strong team coverage",
    },
    {
      id: 2,
      name: "Python",
      category: "Technical",
      employees: 38,
      avgProficiency: 78,
      trend: "up",
      demand: "high",
      gap: -12,
      aiInsight: "Growing demand, consider upskilling programs",
    },
    {
      id: 3,
      name: "Leadership",
      category: "Soft Skills",
      employees: 28,
      avgProficiency: 72,
      trend: "stable",
      demand: "medium",
      gap: 0,
      aiInsight: "Adequate coverage for current needs",
    },
    {
      id: 4,
      name: "Machine Learning",
      category: "Technical",
      employees: 15,
      avgProficiency: 68,
      trend: "up",
      demand: "critical",
      gap: -25,
      aiInsight: "Critical skill gap identified - urgent hiring needed",
    },
    {
      id: 5,
      name: "Project Management",
      category: "Leadership",
      employees: 22,
      avgProficiency: 80,
      trend: "stable",
      demand: "medium",
      gap: -3,
      aiInsight: "Well-covered skill with experienced team",
    },
  ]

  const skillGaps = [
    {
      skill: "Cloud Architecture",
      currentLevel: 45,
      requiredLevel: 80,
      gap: 35,
      priority: "critical",
      recommendation: "Hire 2 senior cloud architects or upskill 3 existing engineers",
    },
    {
      skill: "DevOps",
      currentLevel: 60,
      requiredLevel: 85,
      gap: 25,
      priority: "high",
      recommendation: "Implement DevOps training program for 5 engineers",
    },
    {
      skill: "Data Science",
      currentLevel: 55,
      requiredLevel: 75,
      gap: 20,
      priority: "medium",
      recommendation: "Partner with external consultants while building internal capability",
    },
  ]

  const aiRecommendations = [
    {
      type: "hiring",
      title: "Hire Machine Learning Engineers",
      description: "Critical skill gap in ML. Recommend hiring 3 senior ML engineers within next quarter.",
      impact: "high",
      confidence: 92,
    },
    {
      type: "training",
      title: "Cloud Certification Program",
      description: "Upskill 5 engineers in AWS/Azure to close cloud architecture gap.",
      impact: "high",
      confidence: 88,
    },
    {
      type: "reallocation",
      title: "Optimize React Team",
      description: "React.js is over-staffed. Consider reallocating 3 developers to ML projects.",
      impact: "medium",
      confidence: 75,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Skills Matrix
            </h1>
            <p className="mt-2 text-muted-foreground">AI-powered skills inventory and gap analysis</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </motion.div>

        {/* AI Insights Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassPanel className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold">AI Skills Intelligence</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Skills</p>
                      <p className="text-2xl font-bold">156</p>
                    </div>
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="mt-2 text-xs text-green-600">+12 this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Critical Gaps</p>
                      <p className="text-2xl font-bold text-red-600">8</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <p className="mt-2 text-xs text-red-600">Requires immediate action</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Proficiency</p>
                      <p className="text-2xl font-bold">76%</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="mt-2 text-xs text-green-600">+3% from last quarter</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">AI Confidence</p>
                      <p className="text-2xl font-bold">89%</p>
                    </div>
                    <Brain className="h-8 w-8 text-pink-600" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">High accuracy</p>
                </CardContent>
              </Card>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Search and Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassPanel className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {skillCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.label}
                    <Badge variant="secondary" className="ml-2">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Tabs defaultValue="inventory" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="inventory">Skills Inventory</TabsTrigger>
              <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
              <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            {/* Skills Inventory Tab */}
            <TabsContent value="inventory" className="space-y-4">
              <GlassPanel>
                <div className="divide-y">
                  {topSkills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 hover:bg-white/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{skill.name}</h3>
                            <Badge variant="outline">{skill.category}</Badge>
                            {skill.demand === "critical" && (
                              <Badge variant="destructive" className="gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Critical
                              </Badge>
                            )}
                            {skill.demand === "high" && (
                              <Badge className="gap-1 bg-orange-500">
                                <Zap className="h-3 w-3" />
                                High Demand
                              </Badge>
                            )}
                          </div>

                          <div className="grid gap-4 md:grid-cols-3 mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Employees</p>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-blue-600" />
                                <span className="font-semibold">{skill.employees}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Avg Proficiency</p>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{skill.avgProficiency}%</span>
                                {skill.trend === "up" ? (
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-600" />
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Coverage Gap</p>
                              <span
                                className={`font-semibold ${
                                  skill.gap < -15
                                    ? "text-red-600"
                                    : skill.gap < 0
                                      ? "text-orange-600"
                                      : "text-green-600"
                                }`}
                              >
                                {skill.gap}%
                              </span>
                            </div>
                          </div>

                          <Progress value={skill.avgProficiency} className="h-2 mb-2" />

                          <AIInsightCard insight={skill.aiInsight} confidence={85 + index * 2} size="sm" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassPanel>
            </TabsContent>

            {/* Gap Analysis Tab */}
            <TabsContent value="gaps" className="space-y-4">
              {skillGaps.map((gap, index) => (
                <motion.div
                  key={gap.skill}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassPanel className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{gap.skill}</h3>
                        <Badge
                          variant={
                            gap.priority === "critical"
                              ? "destructive"
                              : gap.priority === "high"
                                ? "default"
                                : "secondary"
                          }
                          className="mt-2"
                        >
                          {gap.priority.toUpperCase()} PRIORITY
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Gap Size</p>
                        <p className="text-3xl font-bold text-red-600">{gap.gap}%</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Current Level</span>
                          <span className="font-semibold">{gap.currentLevel}%</span>
                        </div>
                        <Progress value={gap.currentLevel} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Required Level</span>
                          <span className="font-semibold">{gap.requiredLevel}%</span>
                        </div>
                        <Progress value={gap.requiredLevel} className="h-2" />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-blue-900 mb-1">AI Recommendation</p>
                          <p className="text-sm text-blue-800">{gap.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              ))}
            </TabsContent>

            {/* AI Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-4">
              {aiRecommendations.map((rec, index) => (
                <motion.div
                  key={rec.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AIInsightCard
                    insight={rec.description}
                    confidence={rec.confidence}
                    title={rec.title}
                    actions={[
                      { label: "View Details", onClick: () => {} },
                      { label: "Implement", onClick: () => {} },
                    ]}
                  />
                </motion.div>
              ))}
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends">
              <GlassPanel className="p-6">
                <h3 className="text-lg font-semibold mb-4">Skills Trends Analysis</h3>
                <p className="text-muted-foreground">AI-powered trend analysis and forecasting coming soon...</p>
              </GlassPanel>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
