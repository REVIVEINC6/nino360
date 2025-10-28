"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Users, MessageSquare, BarChart3, Calendar, Award, TrendingUp, AlertCircle } from "lucide-react"

export function PerformanceManagementContent() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="glass-card p-1">
        <TabsTrigger value="overview" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="goals" className="gap-2">
          <Target className="h-4 w-4" />
          Goals
        </TabsTrigger>
        <TabsTrigger value="reviews" className="gap-2">
          <Users className="h-4 w-4" />
          Reviews
        </TabsTrigger>
        <TabsTrigger value="feedback" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          360 Feedback
        </TabsTrigger>
        <TabsTrigger value="calibration" className="gap-2">
          <Award className="h-4 w-4" />
          Calibration
        </TabsTrigger>
        <TabsTrigger value="analytics" className="gap-2">
          <TrendingUp className="h-4 w-4" />
          Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Goals</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">247</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last quarter
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending Reviews</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">18</p>
                <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />5 overdue
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Performance</p>
                <p className="text-3xl font-bold text-green-600 mt-2">4.2</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +0.3 from last cycle
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Feedback Requests</p>
                <p className="text-3xl font-bold text-pink-600 mt-2">34</p>
                <p className="text-xs text-slate-600 mt-1">12 completed</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            AI Performance Insights
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">High Performers Identified</p>
                  <p className="text-sm text-blue-700 mt-1">
                    23 employees showing exceptional performance this quarter. Consider for promotion or special
                    projects.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-orange-900">Performance Concerns</p>
                  <p className="text-sm text-orange-700 mt-1">
                    7 employees need additional support. Recommend 1-on-1 coaching sessions and development plans.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-green-900">Goal Completion Rate</p>
                  <p className="text-sm text-green-700 mt-1">
                    87% of Q4 goals are on track or completed. Engineering team leading with 94% completion rate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
              <Target className="h-4 w-4" />
              Create New Goal
            </Button>
            <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
              <Calendar className="h-4 w-4" />
              Schedule Review
            </Button>
            <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
              <MessageSquare className="h-4 w-4" />
              Request Feedback
            </Button>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="goals">
        <Card className="glass-card p-6">
          <p className="text-slate-600">Goals management interface will be displayed here.</p>
        </Card>
      </TabsContent>

      <TabsContent value="reviews">
        <Card className="glass-card p-6">
          <p className="text-slate-600">Performance reviews interface will be displayed here.</p>
        </Card>
      </TabsContent>

      <TabsContent value="feedback">
        <Card className="glass-card p-6">
          <p className="text-slate-600">360 feedback interface will be displayed here.</p>
        </Card>
      </TabsContent>

      <TabsContent value="calibration">
        <Card className="glass-card p-6">
          <p className="text-slate-600">Calibration and nine-box interface will be displayed here.</p>
        </Card>
      </TabsContent>

      <TabsContent value="analytics">
        <Card className="glass-card p-6">
          <p className="text-slate-600">Performance analytics and reports will be displayed here.</p>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
