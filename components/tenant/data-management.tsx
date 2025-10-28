"use client"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, FileText, Upload, Download, Trash2, Calendar, Brain } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function DataManagement() {
  return (
    <Tabs defaultValue="documents" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="documents">
          <FileText className="mr-2 h-4 w-4" />
          Documents
        </TabsTrigger>
        <TabsTrigger value="rag">
          <Brain className="mr-2 h-4 w-4" />
          RAG & AI
        </TabsTrigger>
        <TabsTrigger value="import-export">
          <Database className="mr-2 h-4 w-4" />
          Import/Export
        </TabsTrigger>
        <TabsTrigger value="retention">
          <Calendar className="mr-2 h-4 w-4" />
          Retention
        </TabsTrigger>
      </TabsList>

      <TabsContent value="documents" className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Document Library</h3>
              <p className="text-sm text-muted-foreground">Manage organizational documents and files</p>
            </div>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Employee Handbook.pdf</TableCell>
                <TableCell>PDF</TableCell>
                <TableCell>2.4 MB</TableCell>
                <TableCell>2024-01-15</TableCell>
                <TableCell>
                  <Badge>Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </TabsContent>

      <TabsContent value="rag" className="space-y-4">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">RAG Configuration</h3>
            <p className="text-sm text-muted-foreground">Configure Retrieval-Augmented Generation for AI features</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Knowledge Base Indexing</p>
                <Badge variant="secondary">Processing</Badge>
              </div>
              <Progress value={65} className="mb-2" />
              <p className="text-sm text-muted-foreground">1,234 documents indexed • 456 pending</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <p className="font-medium mb-2">Vector Database</p>
                <p className="text-2xl font-bold">1.2M</p>
                <p className="text-sm text-muted-foreground">Embeddings stored</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="font-medium mb-2">Query Performance</p>
                <p className="text-2xl font-bold">45ms</p>
                <p className="text-sm text-muted-foreground">Average response time</p>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="import-export" className="space-y-4">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Data Import/Export</h3>
            <p className="text-sm text-muted-foreground">Import and export data across modules</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 border rounded-lg">
              <Upload className="h-8 w-8 mb-4 text-primary" />
              <h4 className="font-semibold mb-2">Import Data</h4>
              <p className="text-sm text-muted-foreground mb-4">Upload CSV, Excel, or JSON files to import data</p>
              <Button className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>

            <div className="p-6 border rounded-lg">
              <Download className="h-8 w-8 mb-4 text-primary" />
              <h4 className="font-semibold mb-2">Export Data</h4>
              <p className="text-sm text-muted-foreground mb-4">Export data to CSV, Excel, or JSON formats</p>
              <Button className="w-full bg-transparent" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="retention" className="space-y-4">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Data Retention & GDPR</h3>
            <p className="text-sm text-muted-foreground">Configure data retention policies and GDPR compliance</p>
          </div>

          <div className="space-y-4">
            {[
              { module: "Employee Records", retention: "7 years", gdpr: true },
              { module: "Candidate Data", retention: "2 years", gdpr: true },
              { module: "Financial Records", retention: "10 years", gdpr: false },
              { module: "Audit Logs", retention: "5 years", gdpr: false },
            ].map((policy) => (
              <div key={policy.module} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{policy.module}</p>
                  <p className="text-sm text-muted-foreground">Retention: {policy.retention}</p>
                </div>
                <div className="flex items-center gap-4">
                  {policy.gdpr && <Badge variant="secondary">GDPR</Badge>}
                  <Button variant="ghost" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
