"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, AlertCircle, Clock, CheckCircle, Plus, TrendingUp, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { getTickets, getTicketStats, getAITicketInsights, type Ticket } from "@/app/(dashboard)/admin/tickets/actions"

export function SupportTicketsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, avgResponseTime: 0 })
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [ticketsData, statsData, insightsData] = await Promise.all([
        getTickets(),
        getTicketStats(),
        getAITicketInsights(),
      ])
      setTickets(ticketsData)
      setStats(statsData)
      setInsights(insightsData)
    } catch (error) {
      console.error("Error loading tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const priorityColors = {
    low: "secondary",
    medium: "default",
    high: "destructive",
    urgent: "destructive",
  } as const

  const statusColors = {
    open: "default",
    in_progress: "default",
    waiting: "secondary",
    resolved: "default",
    closed: "secondary",
  } as const

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="backdrop-blur-xl bg-white/70 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.open}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">Successfully closed</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgResponseTime}h</div>
              <p className="text-xs text-muted-foreground">Response time</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {insights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Insights
                </span>
              </CardTitle>
              <CardDescription>ML-powered ticket analysis and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium mb-2">Sentiment Distribution</p>
                  <div className="space-y-1">
                    {Object.entries(insights.sentimentDistribution || {}).map(([sentiment, count]) => (
                      <div key={sentiment} className="flex items-center justify-between text-sm">
                        <span className="capitalize">{sentiment}</span>
                        <Badge variant="secondary">{count as number}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Top Categories</p>
                  <div className="space-y-1">
                    {Object.entries(insights.categoryDistribution || {})
                      .slice(0, 3)
                      .map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between text-sm">
                          <span className="capitalize">{category}</span>
                          <Badge variant="secondary">{count as number}</Badge>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Urgent Attention</p>
                  <div className="text-3xl font-bold text-red-600">{insights.urgentCount}</div>
                  <p className="text-xs text-muted-foreground">Tickets need immediate attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card className="backdrop-blur-xl bg-white/70 border-white/20">
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
            <CardDescription>Manage and prioritize customer support requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 backdrop-blur-xl bg-white/50 border-white/20"
                />
              </div>
              <Button className="bg-linear-to-r from-purple-600 to-pink-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>

            <div className="rounded-lg border border-white/20 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/50">
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id} className="hover:bg-white/30">
                      <TableCell className="font-mono text-sm">{ticket.ticket_number}</TableCell>
                      <TableCell className="font-medium">{ticket.subject}</TableCell>
                      <TableCell>{ticket.customer_name}</TableCell>
                      <TableCell>
                        <Badge variant={priorityColors[ticket.priority]}>
                          {ticket.priority === "high" || ticket.priority === "urgent" ? (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          ) : null}
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColors[ticket.status]}>
                          {ticket.status === "open" ? <Clock className="h-3 w-3 mr-1" /> : null}
                          {ticket.status === "resolved" ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                          {ticket.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
