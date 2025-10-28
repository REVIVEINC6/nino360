import { getSuccessionPlans, getTalentPipeline } from "./actions"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Target,
  Award,
  Clock,
  Plus,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react"

export default async function SuccessionPlanningPage() {
  const [plans, pipeline] = await Promise.all([getSuccessionPlans(), getTalentPipeline()])

  const criticalRoles = plans?.filter((p: any) => p.risk_level === "critical") || []
  const readySuccessors =
    plans?.flatMap((p: any) => p.successors?.filter((s: any) => s.readiness_level === "ready_now") || []).length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-slate-900">Succession Planning</h1>
            <p className="mt-2 text-slate-600">Build talent pipelines and ensure business continuity</p>
          </div>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="h-4 w-4" />
            Create Plan
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-0 bg-white/60 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-100 p-3">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Plans</p>
                <p className="text-2xl font-bold text-slate-900">{plans?.length || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-white/60 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-red-100 p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Critical Roles</p>
                <p className="text-2xl font-bold text-slate-900">{criticalRoles.length}</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-white/60 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-green-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Ready Successors</p>
                <p className="text-2xl font-bold text-slate-900">{readySuccessors}</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 bg-white/60 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-purple-100 p-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">High Potential</p>
                <p className="text-2xl font-bold text-slate-900">{pipeline?.length || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="plans">Succession Plans</TabsTrigger>
            <TabsTrigger value="pipeline">Talent Pipeline</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-4">
            {plans?.map((plan: any) => (
              <Card key={plan.id} className="border-0 bg-white/60 p-6 backdrop-blur-sm transition-all hover:shadow-lg">
                <div className="space-y-4">
                  {/* Plan Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-slate-900">{plan.position?.title}</h3>
                        <Badge
                          variant={
                            plan.risk_level === "critical"
                              ? "destructive"
                              : plan.risk_level === "high"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {plan.risk_level} risk
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Current: {plan.current_holder?.full_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Timeline: {plan.timeline_months} months
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>

                  {/* AI Insights */}
                  {plan.risk_level === "critical" && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-amber-600" />
                        <div className="flex-1 space-y-1">
                          <p className="font-medium text-amber-900">AI Recommendation</p>
                          <p className="text-sm text-amber-700">
                            This critical role requires immediate attention. Consider accelerating development programs
                            for identified successors and implementing knowledge transfer initiatives.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Successors */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">Identified Successors</h4>
                    <div className="space-y-2">
                      {plan.successors?.map((successor: any) => (
                        <div
                          key={successor.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white/50 p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-semibold text-white">
                              {successor.candidate?.full_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{successor.candidate?.full_name}</p>
                              <p className="text-sm text-slate-600">{successor.candidate?.position?.title}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-slate-900">
                                {successor.readiness_level === "ready_now"
                                  ? "Ready Now"
                                  : successor.readiness_level === "ready_1_year"
                                    ? "Ready in 1 Year"
                                    : "Ready in 2+ Years"}
                              </p>
                              <div className="mt-1 flex items-center gap-2">
                                <Progress
                                  value={
                                    successor.readiness_level === "ready_now"
                                      ? 100
                                      : successor.readiness_level === "ready_1_year"
                                        ? 60
                                        : 30
                                  }
                                  className="h-2 w-24"
                                />
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {(!plan.successors || plan.successors.length === 0) && (
                        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                          <AlertTriangle className="mx-auto h-8 w-8 text-slate-400" />
                          <p className="mt-2 text-sm text-slate-600">No successors identified for this role</p>
                          <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Successor
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-4">
            <Card className="border-0 bg-white/60 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">High-Potential Talent Pipeline</h3>
              <div className="space-y-3">
                {pipeline?.map((employee: any) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white/50 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        {employee.full_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{employee.full_name}</p>
                        <p className="text-sm text-slate-600">{employee.position?.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Performance</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Progress value={employee.performance_score || 0} className="h-2 w-24" />
                          <span className="text-sm font-medium text-slate-900">{employee.performance_score || 0}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Skills</p>
                        <p className="mt-1 text-sm font-medium text-slate-900">
                          {employee.skills?.length || 0} verified
                        </p>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Award className="h-3 w-3" />
                        High Potential
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <Card className="border-0 bg-white/60 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Succession Risk Analysis</h3>
              <div className="space-y-4">
                {criticalRoles.map((plan: any) => (
                  <div key={plan.id} className="rounded-lg border border-red-200 bg-red-50/50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div className="flex-1">
                        <p className="font-medium text-red-900">{plan.position?.title}</p>
                        <p className="mt-1 text-sm text-red-700">
                          Critical role with {plan.successors?.length || 0} identified successors.
                          {(!plan.successors || plan.successors.length === 0) &&
                            " Immediate action required to identify and develop successors."}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline">
                            Create Development Plan
                          </Button>
                          <Button size="sm" variant="outline">
                            Identify Candidates
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
