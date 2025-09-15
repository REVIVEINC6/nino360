"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Brain,
  TrendingUp,
  Star,
  Award,
  Search,
  Plus,
  Eye,
  BarChart3,
  Target,
  BookOpen,
  CheckCircle,
  Download,
} from "lucide-react"

interface Skill {
  id: string
  name: string
  category: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
  demand: number
  supply: number
  gap: number
  averageRate: number
  certifications: string[]
  relatedSkills: string[]
  trendDirection: "up" | "down" | "stable"
  trendPercentage: number
}

interface ResourceSkill {
  resourceId: string
  resourceName: string
  avatar?: string
  department: string
  role: string
  skills: {
    skillId: string
    skillName: string
    level: "beginner" | "intermediate" | "advanced" | "expert"
    yearsExperience: number
    certified: boolean
    lastUsed: string
  }[]
  overallRating: number
  benchStatus: "available" | "allocated"
}

const mockSkills: Skill[] = [
  {
    id: "1",
    name: "React",
    category: "Frontend",
    level: "advanced",
    demand: 85,
    supply: 60,
    gap: 25,
    averageRate: 110,
    certifications: ["React Developer Certification", "Meta React Specialist"],
    relatedSkills: ["JavaScript", "TypeScript", "Redux", "Next.js"],
    trendDirection: "up",
    trendPercentage: 15,
  },
  {
    id: "2",
    name: "Node.js",
    category: "Backend",
    level: "advanced",
    demand: 75,
    supply: 55,
    gap: 20,
    averageRate: 115,
    certifications: ["Node.js Application Developer", "OpenJS Node.js Services Developer"],
    relatedSkills: ["JavaScript", "Express.js", "MongoDB", "PostgreSQL"],
    trendDirection: "up",
    trendPercentage: 12,
  },
  {
    id: "3",
    name: "Python",
    category: "Programming",
    level: "advanced",
    demand: 90,
    supply: 70,
    gap: 20,
    averageRate: 105,
    certifications: ["Python Institute PCAP", "Microsoft Python Developer"],
    relatedSkills: ["Django", "Flask", "Pandas", "NumPy"],
    trendDirection: "up",
    trendPercentage: 18,
  },
  {
    id: "4",
    name: "AWS",
    category: "Cloud",
    level: "intermediate",
    demand: 95,
    supply: 45,
    gap: 50,
    averageRate: 130,
    certifications: ["AWS Solutions Architect", "AWS Developer Associate"],
    relatedSkills: ["Docker", "Kubernetes", "Terraform", "DevOps"],
    trendDirection: "up",
    trendPercentage: 25,
  },
  {
    id: "5",
    name: "Figma",
    category: "Design",
    level: "intermediate",
    demand: 70,
    supply: 65,
    gap: 5,
    averageRate: 85,
    certifications: ["Figma Professional", "Adobe Certified Expert"],
    relatedSkills: ["Adobe XD", "Sketch", "Prototyping", "UI/UX Design"],
    trendDirection: "stable",
    trendPercentage: 3,
  },
]

const mockResourceSkills: ResourceSkill[] = [
  {
    resourceId: "1",
    resourceName: "Sarah Johnson",
    department: "Engineering",
    role: "Senior Developer",
    skills: [
      {
        skillId: "1",
        skillName: "React",
        level: "expert",
        yearsExperience: 4,
        certified: true,
        lastUsed: "2024-01-15",
      },
      {
        skillId: "2",
        skillName: "Node.js",
        level: "advanced",
        yearsExperience: 3,
        certified: false,
        lastUsed: "2024-01-15",
      },
      {
        skillId: "3",
        skillName: "Python",
        level: "intermediate",
        yearsExperience: 2,
        certified: false,
        lastUsed: "2023-12-20",
      },
    ],
    overallRating: 4.8,
    benchStatus: "available",
  },
  {
    resourceId: "2",
    resourceName: "Michael Chen",
    department: "Design",
    role: "UX Designer",
    skills: [
      {
        skillId: "5",
        skillName: "Figma",
        level: "expert",
        yearsExperience: 3,
        certified: true,
        lastUsed: "2024-01-20",
      },
      {
        skillId: "1",
        skillName: "React",
        level: "beginner",
        yearsExperience: 1,
        certified: false,
        lastUsed: "2024-01-10",
      },
    ],
    overallRating: 4.6,
    benchStatus: "allocated",
  },
  {
    resourceId: "3",
    resourceName: "Emily Rodriguez",
    department: "Data Science",
    role: "Data Analyst",
    skills: [
      {
        skillId: "3",
        skillName: "Python",
        level: "advanced",
        yearsExperience: 2,
        certified: true,
        lastUsed: "2024-01-18",
      },
      {
        skillId: "4",
        skillName: "AWS",
        level: "intermediate",
        yearsExperience: 1,
        certified: false,
        lastUsed: "2024-01-12",
      },
    ],
    overallRating: 4.4,
    benchStatus: "available",
  },
]

export default function SkillsMatrixPage() {
  const [skills, setSkills] = useState<Skill[]>(mockSkills)
  const [resourceSkills, setResourceSkills] = useState<ResourceSkill[]>(mockResourceSkills)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [selectedResource, setSelectedResource] = useState<ResourceSkill | null>(null)
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false)
  const { toast } = useToast()

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || skill.category === categoryFilter
    const matchesLevel = levelFilter === "all" || skill.level === levelFilter
    return matchesSearch && matchesCategory && matchesLevel
  })

  const getGapColor = (gap: number) => {
    if (gap >= 40) return "text-red-600"
    if (gap >= 20) return "text-yellow-600"
    return "text-green-600"
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-blue-100 text-blue-800"
      case "advanced":
        return "bg-purple-100 text-purple-800"
      case "expert":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      default:
        return <Target className="h-4 w-4 text-gray-600" />
    }
  }

  const handleAddSkill = () => {
    toast({
      title: "Skill Added",
      description: "New skill has been added to the matrix.",
    })
    setIsAddSkillOpen(false)
  }

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Skills matrix data export has been initiated.",
    })
  }

  const totalSkills = skills.length
  const highDemandSkills = skills.filter((s) => s.demand >= 80).length
  const skillGaps = skills.filter((s) => s.gap >= 20).length
  const avgSupplyDemandRatio = Math.round(
    (skills.reduce((sum, s) => sum + s.supply / s.demand, 0) / skills.length) * 100,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills Matrix</h1>
          <p className="text-muted-foreground">Analyze skills distribution and identify capability gaps</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Matrix
          </Button>
          <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
                <DialogDescription>Add a new skill to track in the matrix</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skillName">Skill Name</Label>
                  <Input id="skillName" placeholder="Enter skill name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">Frontend</SelectItem>
                      <SelectItem value="backend">Backend</SelectItem>
                      <SelectItem value="cloud">Cloud</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="data">Data Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demand">Market Demand (%)</Label>
                  <Input id="demand" type="number" placeholder="85" min="0" max="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supply">Current Supply (%)</Label>
                  <Input id="supply" type="number" placeholder="60" min="0" max="100" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddSkillOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSkill}>Add Skill</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSkills}</div>
            <p className="text-xs text-muted-foreground">Tracked across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Demand Skills</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highDemandSkills}</div>
            <p className="text-xs text-muted-foreground">80%+ market demand</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Gaps</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{skillGaps}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supply/Demand Ratio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSupplyDemandRatio}%</div>
            <Progress value={avgSupplyDemandRatio} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search skills by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Frontend">Frontend</SelectItem>
            <SelectItem value="Backend">Backend</SelectItem>
            <SelectItem value="Cloud">Cloud</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Programming">Programming</SelectItem>
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Skills Overview</TabsTrigger>
          <TabsTrigger value="resources">Resource Skills</TabsTrigger>
          <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedSkill(skill)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{skill.name}</CardTitle>
                        <CardDescription>{skill.category}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getLevelColor(skill.level)}>{skill.level}</Badge>
                        {getTrendIcon(skill.trendDirection)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Market Demand</p>
                        <p className="font-medium">{skill.demand}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current Supply</p>
                        <p className="font-medium">{skill.supply}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Skill Gap</p>
                        <p className={`font-medium ${getGapColor(skill.gap)}`}>{skill.gap}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Rate</p>
                        <p className="font-medium">${skill.averageRate}/hr</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Supply vs Demand</span>
                        <span>{Math.round((skill.supply / skill.demand) * 100)}%</span>
                      </div>
                      <Progress value={(skill.supply / skill.demand) * 100} />
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Related Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {skill.relatedSkills.slice(0, 3).map((relatedSkill) => (
                          <Badge key={relatedSkill} variant="outline" className="text-xs">
                            {relatedSkill}
                          </Badge>
                        ))}
                        {skill.relatedSkills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{skill.relatedSkills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1 text-sm">
                        {getTrendIcon(skill.trendDirection)}
                        <span
                          className={
                            skill.trendDirection === "up"
                              ? "text-green-600"
                              : skill.trendDirection === "down"
                                ? "text-red-600"
                                : "text-gray-600"
                          }
                        >
                          {skill.trendPercentage}% trend
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {resourceSkills.map((resource) => (
              <motion.div
                key={resource.resourceId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={resource.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {resource.resourceName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{resource.resourceName}</h3>
                          <p className="text-muted-foreground">
                            {resource.role} • {resource.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{resource.overallRating}</span>
                        </div>
                        <Badge
                          className={
                            resource.benchStatus === "available"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }
                        >
                          {resource.benchStatus}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Skills Portfolio</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resource.skills.map((skill) => (
                          <div
                            key={skill.skillId}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{skill.skillName}</p>
                              <p className="text-sm text-muted-foreground">
                                {skill.yearsExperience} years • Last used: {skill.lastUsed}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getLevelColor(skill.level)}>{skill.level}</Badge>
                              {skill.certified && <Award className="h-4 w-4 text-yellow-600" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                      <Button size="sm" variant="outline" onClick={() => setSelectedResource(resource)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Critical Skill Gaps</CardTitle>
                <CardDescription>Skills with highest demand-supply gap</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skills
                    .filter((s) => s.gap >= 20)
                    .sort((a, b) => b.gap - a.gap)
                    .map((skill) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{skill.name}</span>
                          <span className={`text-sm font-medium ${getGapColor(skill.gap)}`}>{skill.gap}% gap</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Demand: {skill.demand}%</span>
                          <span>Supply: {skill.supply}%</span>
                        </div>
                        <Progress value={skill.supply} className="h-2" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
                <CardDescription>Strategies to address skill gaps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900">Urgent: AWS Skills</p>
                        <p className="text-sm text-red-700">
                          50% gap identified. Consider hiring 2-3 AWS certified professionals or upskilling existing
                          team.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">Training: React & Node.js</p>
                        <p className="text-sm text-yellow-700">
                          High demand skills with moderate gaps. Invest in training programs for existing developers.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">Strength: Design Skills</p>
                        <p className="text-sm text-green-700">
                          Good supply-demand balance. Maintain current skill levels and consider specialization.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trending Skills</CardTitle>
                <CardDescription>Skills with highest growth trajectory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skills
                    .filter((s) => s.trendDirection === "up")
                    .sort((a, b) => b.trendPercentage - a.trendPercentage)
                    .map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">{skill.name}</p>
                            <p className="text-sm text-muted-foreground">{skill.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">+{skill.trendPercentage}%</p>
                          <p className="text-sm text-muted-foreground">${skill.averageRate}/hr</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Analysis</CardTitle>
                <CardDescription>Industry skill demand trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>Market trend chart would be displayed here</p>
                    <p className="text-sm">Showing skill demand over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Skills Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Skill Correlation</p>
                      <p className="text-sm text-blue-700">
                        Resources with React + TypeScript combination have 40% higher project success rates.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-purple-900">Upskilling Opportunity</p>
                      <p className="text-sm text-purple-700">
                        3 Python developers can be upskilled to AWS within 6 months to close critical gap.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Revenue Impact</p>
                      <p className="text-sm text-green-700">
                        Closing AWS skill gap could increase billable capacity by $180K annually.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Skills Coverage</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Certification Rate</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Skill Freshness</span>
                    <span className="text-sm font-medium">82%</span>
                  </div>
                  <Progress value={82} />
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Key Insight:</strong> Teams with diverse skill sets complete projects 25% faster.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Skill Detail Dialog */}
      {selectedSkill && (
        <Dialog open={!!selectedSkill} onOpenChange={() => setSelectedSkill(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedSkill.name}
                <Badge className={getLevelColor(selectedSkill.level)}>{selectedSkill.level}</Badge>
                <div className="flex items-center gap-1">
                  {getTrendIcon(selectedSkill.trendDirection)}
                  <span className="text-sm">{selectedSkill.trendPercentage}% trend</span>
                </div>
              </DialogTitle>
              <DialogDescription>
                {selectedSkill.category} • ${selectedSkill.averageRate}/hr average rate
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Market Analysis</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Market Demand</span>
                        <span>{selectedSkill.demand}%</span>
                      </div>
                      <Progress value={selectedSkill.demand} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Current Supply</span>
                        <span>{selectedSkill.supply}%</span>
                      </div>
                      <Progress value={selectedSkill.supply} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Skill Gap</span>
                        <span className={getGapColor(selectedSkill.gap)}>{selectedSkill.gap}%</span>
                      </div>
                      <Progress value={selectedSkill.gap} className="bg-red-100" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Related Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.relatedSkills.map((relatedSkill) => (
                      <Badge key={relatedSkill} variant="secondary">
                        {relatedSkill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-4">Certifications</h4>
                  <div className="space-y-2">
                    {selectedSkill.certifications.map((cert) => (
                      <div key={cert} className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">{selectedSkill.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Level</p>
                    <Badge className={getLevelColor(selectedSkill.level)}>{selectedSkill.level}</Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Average Rate</p>
                    <p className="font-medium">${selectedSkill.averageRate}/hr</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Trend</p>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(selectedSkill.trendDirection)}
                      <span className="font-medium">{selectedSkill.trendPercentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Resource Detail Dialog */}
      {selectedResource && (
        <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedResource.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {selectedResource.resourceName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {selectedResource.resourceName}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{selectedResource.overallRating}</span>
                </div>
              </DialogTitle>
              <DialogDescription>
                {selectedResource.role} • {selectedResource.department}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Skills Portfolio</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedResource.skills.map((skill) => (
                    <Card key={skill.skillId}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{skill.skillName}</h5>
                          <div className="flex items-center gap-2">
                            <Badge className={getLevelColor(skill.level)}>{skill.level}</Badge>
                            {skill.certified && <Award className="h-4 w-4 text-yellow-600" />}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Experience: {skill.yearsExperience} years</p>
                          <p>Last used: {skill.lastUsed}</p>
                          <p>Certified: {skill.certified ? "Yes" : "No"}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
