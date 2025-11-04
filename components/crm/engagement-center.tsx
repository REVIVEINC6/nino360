"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Mail, Send, Users, Calendar } from "lucide-react"

export function EngagementCenter() {
  return (
    <Tabs defaultValue="sequences" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="sequences">
          <Send className="mr-2 h-4 w-4" />
          Sequences
        </TabsTrigger>
        <TabsTrigger value="templates">
          <Mail className="mr-2 h-4 w-4" />
          Templates
        </TabsTrigger>
        <TabsTrigger value="campaigns">
          <Users className="mr-2 h-4 w-4" />
          Campaigns
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sequences" className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Email Sequences</h3>
              <p className="text-sm text-muted-foreground">Automated follow-up sequences</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Sequence
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Steps</TableHead>
                <TableHead>Active Contacts</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">New Lead Nurture</TableCell>
                <TableCell>5 steps</TableCell>
                <TableCell>234</TableCell>
                <TableCell>42%</TableCell>
                <TableCell>
                  <Badge>Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Demo Follow-up</TableCell>
                <TableCell>3 steps</TableCell>
                <TableCell>89</TableCell>
                <TableCell>38%</TableCell>
                <TableCell>
                  <Badge>Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </TabsContent>

      <TabsContent value="templates" className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Email Templates</h3>
              <p className="text-sm text-muted-foreground">Reusable email templates</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: "Introduction Email", category: "Outreach", usage: 145 },
              { name: "Meeting Request", category: "Scheduling", usage: 98 },
              { name: "Proposal Follow-up", category: "Sales", usage: 67 },
              { name: "Thank You Note", category: "General", usage: 234 },
            ].map((template) => (
              <Card key={template.name} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{template.name}</p>
                    <p className="text-sm text-muted-foreground">{template.category}</p>
                  </div>
                  <Badge variant="secondary">{template.usage} uses</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  Use Template
                </Button>
              </Card>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="campaigns" className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Marketing Campaigns</h3>
              <p className="text-sm text-muted-foreground">Bulk email campaigns</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </div>

          <div className="space-y-4">
            {[
              {
                name: "Q1 Product Launch",
                sent: "2024-01-15",
                recipients: 1234,
                opens: 456,
                clicks: 89,
              },
              {
                name: "Webinar Invitation",
                sent: "2024-01-10",
                recipients: 890,
                opens: 345,
                clicks: 67,
              },
            ].map((campaign) => (
              <Card key={campaign.name} className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">Sent on {campaign.sent}</p>
                  </div>
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Recipients</p>
                    <p className="text-lg font-semibold">{campaign.recipients}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Opens</p>
                    <p className="text-lg font-semibold">{campaign.opens}</p>
                    <p className="text-xs text-muted-foreground">
                      {((campaign.opens / campaign.recipients) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clicks</p>
                    <p className="text-lg font-semibold">{campaign.clicks}</p>
                    <p className="text-xs text-muted-foreground">
                      {((campaign.clicks / campaign.recipients) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
