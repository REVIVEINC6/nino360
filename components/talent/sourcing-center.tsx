"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Webhook, Mail, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function SourcingCenter() {
  return (
    <Tabs defaultValue="import" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="import">
          <Upload className="mr-2 h-4 w-4" />
          Import
        </TabsTrigger>
        <TabsTrigger value="webhooks">
          <Webhook className="mr-2 h-4 w-4" />
          Webhooks
        </TabsTrigger>
        <TabsTrigger value="campaigns">
          <Mail className="mr-2 h-4 w-4" />
          Campaigns
        </TabsTrigger>
      </TabsList>

      <TabsContent value="import" className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Import Candidates</h3>
              <p className="text-sm text-muted-foreground">Upload resumes and candidate data</p>
            </div>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Imported</p>
              <p className="text-2xl font-bold">2,345</p>
              <p className="text-xs text-green-600">+234 this month</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
              <p className="text-2xl font-bold">94%</p>
              <p className="text-xs text-muted-foreground">Parsing accuracy</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
              <p className="text-2xl font-bold">45</p>
              <p className="text-xs text-muted-foreground">Requires manual review</p>
            </Card>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="webhooks" className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Webhook Integrations</h3>
              <p className="text-sm text-muted-foreground">Receive candidates from external sources</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Webhook
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Candidates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">LinkedIn</TableCell>
                <TableCell className="font-mono text-xs">/api/webhooks/linkedin</TableCell>
                <TableCell>456</TableCell>
                <TableCell>
                  <Badge>Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Configure
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Indeed</TableCell>
                <TableCell className="font-mono text-xs">/api/webhooks/indeed</TableCell>
                <TableCell>234</TableCell>
                <TableCell>
                  <Badge>Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Configure
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </TabsContent>

      <TabsContent value="campaigns" className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Sourcing Campaigns</h3>
              <p className="text-sm text-muted-foreground">Outreach campaigns for passive candidates</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </div>

          <div className="space-y-3">
            {[
              { name: "Senior Engineers Q1", sent: 234, responses: 45, interested: 12 },
              { name: "Product Managers", sent: 156, responses: 28, interested: 8 },
            ].map((campaign) => (
              <Card key={campaign.name} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">{campaign.sent} emails sent</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Responses</p>
                    <p className="font-semibold">{campaign.responses}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Interested</p>
                    <p className="font-semibold">{campaign.interested}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rate</p>
                    <p className="font-semibold">{((campaign.responses / campaign.sent) * 100).toFixed(1)}%</p>
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
