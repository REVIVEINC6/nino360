import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Download,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  User,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
} from "lucide-react"
import { getInterviewWorkspace } from "../actions"
import { ScorecardForm } from "@/components/talent-interviews/scorecard-form"
import { RecordingUploader } from "@/components/talent-interviews/recording-uploader"
import { InterviewTimeline } from "@/components/talent-interviews/interview-timeline"

export const dynamic = "force-dynamic"

interface InterviewWorkspacePageProps {
  params: Promise<{ id: string }>
}

export default async function InterviewWorkspacePage({ params }: InterviewWorkspacePageProps) {
  const { id } = await params
  const result = await getInterviewWorkspace(id)

  // `getInterviewWorkspace` returns the workspace object directly.
  // Normalize to support both shapes (legacy {success,data} or direct return).
  // Cast to any to support both legacy and direct shapes temporarily.
  const workspace: any = (result && ((result as any).data || result))

  if (!workspace || !workspace.interview) {
    notFound()
  }

  const interview = workspace.interview
  const application = workspace.application || interview.application
  const candidate = workspace.candidate_profile || application?.candidate || interview.application?.candidate
  const requisition = application?.job || interview.application?.job
  const panel = interview.panel || []
  const feedback = workspace.previous_feedbacks || []

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    completed: "bg-green-500/20 text-green-400 border-green-500/30",
    no_show: "bg-red-500/20 text-red-400 border-red-500/30",
    cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  }

  const myFeedback = feedback.find((f: any) => f.is_current_user)
  const hasFeedback = !!myFeedback

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">Interview Workspace</h1>
              <Badge variant="outline" className={statusColors[interview.status]}>
                {interview.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-slate-400">
              {requisition.title} • {interview.stage_name}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Join Meeting
            </Button>
          </div>
        </div>

        {/* Interview Details Card */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Interview Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-slate-400">Date</p>
                  <p className="font-medium text-white">{new Date(interview.scheduled_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-sm text-slate-400">Time</p>
                  <p className="font-medium text-white">
                    {new Date(interview.scheduled_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    ({interview.duration_minutes}m)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {interview.location_type === "video" ? (
                  <Video className="h-5 w-5 text-green-400" />
                ) : (
                  <MapPin className="h-5 w-5 text-orange-400" />
                )}
                <div>
                  <p className="text-sm text-slate-400">Location</p>
                  <p className="font-medium text-white">
                    {interview.location_type === "video" ? "Video Call" : interview.location || "TBD"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-cyan-400" />
                <div>
                  <p className="text-sm text-slate-400">Panel Size</p>
                  <p className="font-medium text-white">
                    {panel.length} interviewer{panel.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            {interview.agenda && (
              <>
                <Separator className="bg-slate-800" />
                <div>
                  <h4 className="mb-2 font-semibold text-white">Agenda</h4>
                  <p className="text-sm text-slate-300">{interview.agenda}</p>
                </div>
              </>
            )}

            <Separator className="bg-slate-800" />

            {/* Interview Panel */}
            <div>
              <h4 className="mb-3 font-semibold text-white">Interview Panel</h4>
              <div className="flex flex-wrap gap-3">
                {panel.map((member: any) => (
                  <div
                    key={member.user_id}
                    className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-xs text-white">
                        {member.full_name
                          .split(" ")
                            .map((n: any) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white">{member.full_name}</p>
                      <p className="text-xs text-slate-400">{member.role}</p>
                    </div>
                    {member.feedback_submitted && <CheckCircle2 className="ml-2 h-4 w-4 text-green-400" />}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="candidate" className="space-y-6">
          <TabsList className="border-slate-800 bg-slate-900/50">
            <TabsTrigger value="candidate">Candidate Profile</TabsTrigger>
            <TabsTrigger value="feedback">
              Submit Feedback
              {hasFeedback && <CheckCircle2 className="ml-2 h-4 w-4 text-green-400" />}
            </TabsTrigger>
            <TabsTrigger value="recordings">Recordings & Notes</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Candidate Profile Tab */}
          <TabsContent value="candidate" className="space-y-6">
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={candidate.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-xl text-white">
              {candidate.full_name
                .split(" ")
                .map((n: any) => n[0])
                .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl text-white">{candidate.full_name}</CardTitle>
                      <p className="text-slate-400">{candidate.email}</p>
                      {candidate.phone && <p className="text-sm text-slate-400">{candidate.phone}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {candidate.resume_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          Resume
                        </a>
                      </Button>
                    )}
                    {candidate.linkedin_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Experience */}
                {candidate.parsed_data?.experience && candidate.parsed_data.experience.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-blue-400" />
                      <h3 className="font-semibold text-white">Experience</h3>
                    </div>
                    <div className="space-y-4">
                {candidate.parsed_data.experience.map((exp: any, idx: number) => (
                        <div key={idx} className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-white">{exp.title}</h4>
                              <p className="text-sm text-slate-400">{exp.company}</p>
                            </div>
                            <p className="text-sm text-slate-500">{exp.duration}</p>
                          </div>
                          {exp.description && <p className="mt-2 text-sm text-slate-300">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {candidate.parsed_data?.education && candidate.parsed_data.education.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-purple-400" />
                      <h3 className="font-semibold text-white">Education</h3>
                    </div>
                    <div className="space-y-3">
                      {candidate.parsed_data.education.map((edu: any, idx: number) => (
                        <div key={idx} className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
                          <h4 className="font-medium text-white">{edu.degree}</h4>
                          <p className="text-sm text-slate-400">{edu.institution}</p>
                          {edu.year && <p className="text-sm text-slate-500">{edu.year}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {candidate.parsed_data?.skills && candidate.parsed_data.skills.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Award className="h-5 w-5 text-green-400" />
                      <h3 className="font-semibold text-white">Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {candidate.parsed_data.skills.map((skill: any, idx: number) => (
                        <Badge key={idx} variant="outline" className="border-slate-700 bg-slate-800/50 text-slate-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Application Notes */}
                {application.notes && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-cyan-400" />
                      <h3 className="font-semibold text-white">Application Notes</h3>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
                      <p className="text-sm text-slate-300">{application.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">{hasFeedback ? "Update Feedback" : "Submit Feedback"}</CardTitle>
                {hasFeedback && (
                  <p className="text-sm text-slate-400">
                    You submitted feedback on {new Date(myFeedback.submitted_at).toLocaleString()}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <ScorecardForm
                  interviewId={interview.id}
                  reviewerId={myFeedback?.reviewer_id || ""}
                  dimensions={interview.scorecard?.dimensions || []}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recordings Tab */}
          <TabsContent value="recordings">
            <RecordingUploader interviewId={interview.id} existingRecordings={interview.recordings || []} />
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <InterviewTimeline interviewId={interview.id} />
          </TabsContent>
        </Tabs>

        {/* Feedback Summary (if multiple panel members) */}
        {feedback.length > 0 && (
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Panel Feedback</CardTitle>
              <p className="text-sm text-slate-400">
                {feedback.filter((f: any) => f.feedback_submitted).length} of {panel.length} panel members have submitted
                feedback
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback.map((fb: any) => (
                  <div
                    key={fb.user_id}
                    className="flex items-start gap-4 rounded-lg border border-slate-800 bg-slate-900/30 p-4"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={fb.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {fb.full_name
                          .split(" ")
                          .map((n: any) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">{fb.full_name}</p>
                          <p className="text-sm text-slate-400">{fb.role}</p>
                        </div>
                        {fb.feedback_submitted ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-green-500/30 bg-green-500/20 text-green-400">
                              Score: {fb.overall_score}/5
                            </Badge>
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                          </div>
                        ) : (
                          <Badge variant="outline" className="border-yellow-500/30 bg-yellow-500/20 text-yellow-400">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      {fb.feedback_submitted && fb.recommendation && (
                        <div className="mt-2">
                          <Badge
                            variant="outline"
                            className={
                              fb.recommendation === "strong_yes"
                                ? "border-green-500/30 bg-green-500/20 text-green-400"
                                : fb.recommendation === "yes"
                                  ? "border-blue-500/30 bg-blue-500/20 text-blue-400"
                                  : fb.recommendation === "no"
                                    ? "border-orange-500/30 bg-orange-500/20 text-orange-400"
                                    : "border-red-500/30 bg-red-500/20 text-red-400"
                            }
                          >
                            {fb.recommendation.replace("_", " ")}
                          </Badge>
                        </div>
                      )}
                      {fb.feedback_submitted && fb.comments && (
                        <p className="mt-2 text-sm text-slate-300">{fb.comments}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
