"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Brain, Shield, Users, FileText, Target, Settings } from "lucide-react"

interface JobDetailContentProps {
  job: any
  hiringTeam: any[]
  approvals: any[]
}

export function JobDetailContent({ job, hiringTeam, approvals }: JobDetailContentProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="glass-card">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Hiring Team</TabsTrigger>
          <TabsTrigger value="plan">Interview Plan</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                {job.description_md ? (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">{job.description_md}</pre>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No description provided</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI Insights
                </CardTitle>
                <CardDescription>Machine learning analysis and predictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-panel p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Fill Probability</div>
                    <div className="text-2xl font-bold text-green-600">87%</div>
                    <div className="text-xs text-gray-500 mt-1">ML Confidence: 92%</div>
                  </div>
                  <div className="glass-panel p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Time to Fill</div>
                    <div className="text-2xl font-bold text-blue-600">28 days</div>
                    <div className="text-xs text-gray-500 mt-1">Based on similar roles</div>
                  </div>
                  <div className="glass-panel p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Market Demand</div>
                    <div className="text-2xl font-bold text-purple-600">High</div>
                    <div className="text-xs text-gray-500 mt-1">Competitive market</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Hiring Team
                </CardTitle>
                <CardDescription>Team members involved in this requisition</CardDescription>
              </CardHeader>
              <CardContent>
                {hiringTeam.length > 0 ? (
                  <div className="space-y-4">
                    {hiringTeam.map((member: any) => (
                      <div key={member.id} className="flex items-center justify-between glass-panel p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.user?.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>{member.user?.full_name?.charAt(0) || "?"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.user?.full_name}</div>
                            <div className="text-sm text-gray-500">{member.user?.email}</div>
                          </div>
                        </div>
                        <Badge variant="secondary">{member.role}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No hiring team members assigned</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="plan" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Interview Plan
                </CardTitle>
                <CardDescription>Structured interview process for candidates</CardDescription>
              </CardHeader>
              <CardContent>
                {job.interview_plan && job.interview_plan.length > 0 ? (
                  <div className="space-y-4">
                    {job.interview_plan.map((step: any, index: number) => (
                      <div key={index} className="glass-panel p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">
                            Step {index + 1}: {step.name}
                          </div>
                          <Badge variant="secondary">{step.duration} min</Badge>
                        </div>
                        {step.panel && step.panel.length > 0 && (
                          <div className="text-sm text-gray-600">Panel: {step.panel.length} interviewers</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No interview plan configured</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Approval Workflow
                </CardTitle>
                <CardDescription>Requisition approval status and history</CardDescription>
              </CardHeader>
              <CardContent>
                {approvals.length > 0 ? (
                  <div className="space-y-4">
                    {approvals.map((approval: any) => (
                      <div key={approval.id} className="glass-panel p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={approval.approver?.avatar_url || "/placeholder.svg"} />
                              <AvatarFallback>{approval.approver?.full_name?.charAt(0) || "?"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{approval.approver?.full_name}</div>
                              <div className="text-sm text-gray-500">Step {approval.step}</div>
                            </div>
                          </div>
                          <Badge
                            className={
                              approval.status === "approved"
                                ? "bg-green-500/10 text-green-700"
                                : approval.status === "rejected"
                                  ? "bg-red-500/10 text-red-700"
                                  : "bg-yellow-500/10 text-yellow-700"
                            }
                          >
                            {approval.status}
                          </Badge>
                        </div>
                        {approval.comment && <div className="text-sm text-gray-600 mt-2">{approval.comment}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No approvals required or pending</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="publishing" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Publishing Status
                </CardTitle>
                <CardDescription>Job board distribution and visibility</CardDescription>
              </CardHeader>
              <CardContent>
                {job.publish_status?.boards && job.publish_status.boards.length > 0 ? (
                  <div className="space-y-4">
                    {job.publish_status.boards.map((board: string) => (
                      <div key={board} className="glass-panel p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="font-medium capitalize">{board.replace("_", " ")}</div>
                          <Badge className="bg-green-500/10 text-green-700">Published</Badge>
                        </div>
                        {job.publish_status.results?.[board]?.published_at && (
                          <div className="text-sm text-gray-500 mt-2">
                            Published: {new Date(job.publish_status.results[board].published_at).toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Not published to any job boards</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
