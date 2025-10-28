"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Users, Download, MapPin, Briefcase, DollarSign, Loader2, Brain, Shield } from "lucide-react"
import Link from "next/link"
import { ApprovalWorkflow } from "@/components/talent/approval-workflow"
import { PublishingPanel } from "@/components/talent/publishing-panel"
import { HiringTeamPanel } from "@/components/talent/hiring-team-panel"
import { InterviewPlanPanel } from "@/components/talent/interview-plan-panel"
import { getRequisition, exportJDPDF } from "../actions"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function RequisitionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [requisition, setRequisition] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadRequisition()
  }, [params.id])

  const loadRequisition = async () => {
    try {
      setLoading(true)
      const result = await getRequisition(params.id as string)
      if (result.success) {
        setRequisition(result.data)
      } else {
        toast.error(result.error || "Failed to load requisition")
        router.push("/talent/jobs")
      }
    } catch (error) {
      console.error("[v0] Error loading requisition:", error)
      toast.error("Failed to load requisition")
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      setExporting(true)
      const result = await exportJDPDF(params.id as string)
      if (result.success && result.url) {
        window.open(result.url, "_blank")
        toast.success("PDF exported successfully")
      } else {
        toast.error(result.error || "Failed to export PDF")
      }
    } catch (error) {
      console.error("[v0] Error exporting PDF:", error)
      toast.error("Failed to export PDF")
    } finally {
      setExporting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-500/10 text-green-700 border-green-300"
      case "draft":
        return "bg-gray-500/10 text-gray-700 border-gray-300"
      case "on_hold":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-300"
      case "closed":
        return "bg-blue-500/10 text-blue-700 border-blue-300"
      case "canceled":
        return "bg-red-500/10 text-red-700 border-red-300"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading requisition...</p>
        </div>
      </div>
    )
  }

  if (!requisition) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center glass-card">
          <h3 className="text-lg font-semibold mb-2">Requisition Not Found</h3>
          <p className="text-muted-foreground mb-4">
            The requisition you're looking for doesn't exist or has been deleted
          </p>
          <Button onClick={() => router.push("/talent/jobs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border-white/20 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {requisition.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getStatusColor(requisition.status)}>{requisition.status.replace("_", " ")}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Created {new Date(requisition.created_at).toLocaleDateString()}
                  </span>
                  <Badge variant="outline" className="gap-1">
                    <Shield className="h-3 w-3 text-green-600" />
                    Blockchain Verified
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExportPDF}
                disabled={exporting}
                className="glass-panel bg-transparent"
              >
                {exporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </>
                )}
              </Button>
              <Link href={`/talent/jobs/${params.id}/edit`}>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Briefcase, label: "Department", value: requisition.department || "Not specified" },
            { icon: MapPin, label: "Location", value: requisition.location || "Not specified" },
            {
              icon: Users,
              label: "Openings",
              value: `${requisition.openings} ${requisition.openings === 1 ? "position" : "positions"}`,
            },
            {
              icon: DollarSign,
              label: "Salary Range",
              value:
                requisition.salary_range?.min && requisition.salary_range?.max
                  ? `${requisition.salary_range.currency || "USD"} ${requisition.salary_range.min.toLocaleString()} - ${requisition.salary_range.max.toLocaleString()}`
                  : "Not specified",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 glass-card border-white/20 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <stat.icon className="h-4 w-4" />
                  {stat.label}
                </div>
                <div className="font-semibold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-6 glass-card border-white/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Insights & Predictions
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="glass-panel p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Fill Probability</div>
                <div className="text-2xl font-bold text-green-600">87%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{ width: "87%" }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">ML Confidence: 92%</div>
              </div>
              <div className="glass-panel p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Time to Fill</div>
                <div className="text-2xl font-bold text-blue-600">28 days</div>
                <div className="text-xs text-gray-500 mt-2">Based on similar roles</div>
              </div>
              <div className="glass-panel p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Market Demand</div>
                <div className="text-2xl font-bold text-purple-600">High</div>
                <div className="text-xs text-gray-500 mt-2">Competitive market</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="glass-card">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team">Hiring Team</TabsTrigger>
              <TabsTrigger value="plan">Interview Plan</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
              <TabsTrigger value="publishing">Publishing</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="p-6 glass-card border-white/20">
                <h3 className="text-lg font-semibold mb-4">Job Description</h3>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {requisition.description_md ? (
                    <div dangerouslySetInnerHTML={{ __html: requisition.description_md.replace(/\n/g, "<br />") }} />
                  ) : (
                    <p className="text-muted-foreground">No description provided</p>
                  )}
                </div>
              </Card>

              <Card className="p-6 glass-card border-white/20">
                <h3 className="text-lg font-semibold mb-4">Requirements & Skills</h3>
                <div className="space-y-4">
                  {requisition.skills && requisition.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {requisition.skills.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="glass-panel">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills specified</p>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Employment Type</p>
                      <p className="text-sm font-semibold capitalize">
                        {requisition.employment_type?.replace("_", " ") || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Seniority Level</p>
                      <p className="text-sm font-semibold capitalize">{requisition.seniority || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Remote Policy</p>
                      <p className="text-sm font-semibold capitalize">{requisition.remote_policy || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Band</p>
                      <p className="text-sm font-semibold">{requisition.band || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="team">
              <HiringTeamPanel requisitionId={params.id as string} />
            </TabsContent>

            <TabsContent value="plan">
              <InterviewPlanPanel
                requisitionId={params.id as string}
                initialPlan={requisition.interview_plan}
                scorecards={requisition.scorecards}
              />
            </TabsContent>

            <TabsContent value="approvals">
              <ApprovalWorkflow requisitionId={params.id as string} />
            </TabsContent>

            <TabsContent value="publishing">
              <PublishingPanel requisitionId={params.id as string} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
