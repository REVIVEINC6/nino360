"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Search,
  Plus,
  DollarSign,
  MessageSquare,
  Share2,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  ExternalLink,
} from "lucide-react"

interface Referral {
  id: string
  referrerName: string
  referrerEmail: string
  referrerDepartment: string
  candidateName: string
  candidateEmail: string
  jobTitle: string
  status: "pending" | "screening" | "interviewing" | "hired" | "rejected"
  submittedDate: string
  reward: number
  notes?: string
  avatar?: string
}

interface ReferralProgram {
  id: string
  title: string
  description: string
  reward: number
  status: "active" | "inactive"
  participantCount: number
  successRate: number
}

const mockReferrals: Referral[] = [
  {
    id: "1",
    referrerName: "John Smith",
    referrerEmail: "john.smith@company.com",
    referrerDepartment: "Engineering",
    candidateName: "Alice Johnson",
    candidateEmail: "alice.johnson@email.com",
    jobTitle: "Senior Frontend Developer",
    status: "interviewing",
    submittedDate: "2024-01-15",
    reward: 2000,
    notes: "Former colleague with excellent React skills",
  avatar: "/nino360-primary.png?height=40&width=40",
  },
  {
    id: "2",
    referrerName: "Sarah Davis",
    referrerEmail: "sarah.davis@company.com",
    referrerDepartment: "Marketing",
    candidateName: "Mike Wilson",
    candidateEmail: "mike.wilson@email.com",
    jobTitle: "Product Manager",
    status: "hired",
    submittedDate: "2024-01-10",
    reward: 3000,
    notes: "University friend with strong product background",
  },
  {
    id: "3",
    referrerName: "David Chen",
    referrerEmail: "david.chen@company.com",
    referrerDepartment: "Design",
    candidateName: "Emma Brown",
    candidateEmail: "emma.brown@email.com",
    jobTitle: "UX Designer",
    status: "screening",
    submittedDate: "2024-01-12",
    reward: 1500,
    notes: "Met at design conference, impressive portfolio",
  },
  {
    id: "4",
    referrerName: "Lisa Rodriguez",
    referrerEmail: "lisa.rodriguez@company.com",
    referrerDepartment: "Sales",
    candidateName: "Tom Anderson",
    candidateEmail: "tom.anderson@email.com",
    jobTitle: "Sales Manager",
    status: "rejected",
    submittedDate: "2024-01-08",
    reward: 2500,
    notes: "Previous sales colleague",
  },
]

const mockPrograms: ReferralProgram[] = [
  {
    id: "1",
    title: "Engineering Referral Program",
    description: "Refer talented engineers and developers",
    reward: 2000,
    status: "active",
    participantCount: 45,
    successRate: 32,
  },
  {
    id: "2",
    title: "Sales Team Expansion",
    description: "Help us grow our sales organization",
    reward: 2500,
    status: "active",
    participantCount: 28,
    successRate: 28,
  },
  {
    id: "3",
    title: "Design Talent Hunt",
    description: "Find creative designers for our team",
    reward: 1500,
    status: "active",
    participantCount: 22,
    successRate: 41,
  },
]

const statusColors = {
  pending: "bg-gray-100 text-gray-800",
  screening: "bg-blue-100 text-blue-800",
  interviewing: "bg-yellow-100 text-yellow-800",
  hired: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

const statusIcons = {
  pending: Clock,
  screening: Search,
  interviewing: MessageSquare,
  hired: CheckCircle,
  rejected: XCircle,
}

export default function EmployeeReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>(mockReferrals)
  const [programs, setPrograms] = useState<ReferralProgram[]>(mockPrograms)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedTab, setSelectedTab] = useState("referrals")

  const filteredReferrals = referrals.filter((referral) => {
    const matchesSearch =
      referral.referrerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || referral.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalReferrals = referrals.length
  const hiredReferrals = referrals.filter((r) => r.status === "hired").length
  const pendingReferrals = referrals.filter((r) => r.status === "pending").length
  const totalRewards = referrals.filter((r) => r.status === "hired").reduce((sum, r) => sum + r.reward, 0)

  const ReferralCard = ({ referral }: { referral: Referral }) => {
    const StatusIcon = statusIcons[referral.status]

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={referral.avatar || "/nino360-primary.png"} alt={referral.referrerName} />
                  <AvatarFallback>
                    {referral.referrerName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{referral.referrerName}</CardTitle>
                  <CardDescription className="text-sm">{referral.referrerDepartment}</CardDescription>
                </div>
              </div>
              <Badge className={statusColors[referral.status]}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Candidate</span>
                <span className="text-sm text-muted-foreground">{referral.candidateName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Position</span>
                <span className="text-sm text-muted-foreground">{referral.jobTitle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Reward</span>
                <span className="text-sm font-semibold text-green-600">${referral.reward.toLocaleString()}</span>
              </div>
            </div>

            {referral.notes && (
              <div className="space-y-1">
                <span className="text-sm font-medium">Notes</span>
                <p className="text-sm text-muted-foreground">{referral.notes}</p>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Submitted: {new Date(referral.submittedDate).toLocaleDateString()}</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Mail className="h-3 w-3 mr-1" />
                  Contact
                </Button>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const ProgramCard = ({ program }: { program: ReferralProgram }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{program.title}</CardTitle>
              <CardDescription>{program.description}</CardDescription>
            </div>
            <Badge variant={program.status === "active" ? "default" : "secondary"}>{program.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">${program.reward.toLocaleString()}</span>
            </div>
            <span className="text-sm text-muted-foreground">per successful hire</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Participants</span>
              <span className="font-medium">{program.participantCount}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Success Rate</span>
                <span className="font-medium">{program.successRate}%</span>
              </div>
              <Progress value={program.successRate} className="h-2" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share Program
            </Button>
            <Button variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Referrals</h1>
          <p className="text-muted-foreground">Manage employee referral programs and track referral progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Program
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Referral
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalReferrals}</p>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{hiredReferrals}</p>
                <p className="text-sm text-muted-foreground">Successful Hires</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{pendingReferrals}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${totalRewards.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Rewards Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
        </TabsList>

        <TabsContent value="referrals" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search referrals by name, candidate, or job title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Referrals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReferrals.map((referral) => (
              <ReferralCard key={referral.id} referral={referral} />
            ))}
          </div>

          {filteredReferrals.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No referrals found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or encourage employees to submit new referrals.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Referral
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="programs" className="space-y-4">
          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>

          {/* Create New Program */}
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Create New Program</h3>
              <p className="text-muted-foreground mb-4">
                Set up a new referral program to attract talent for specific roles or departments.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Program
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
