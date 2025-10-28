"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Download, Upload, Trash2, Clock, FileJson, FileSpreadsheet, AlertTriangle } from "lucide-react"
import { exportData, importData, deleteData } from "@/app/(app)/tenant/data/actions"
import { useToast } from "@/hooks/use-toast"

export function TenantDataContent() {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = async (format: "json" | "csv") => {
    setIsExporting(true)
    try {
      const result = await exportData(format)
      toast({
        title: "Success",
        description: result.message,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const result = await importData(file)
      toast({
        title: "Success",
        description: result.message,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import data",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Tabs defaultValue="export" className="space-y-6">
      <TabsList className="bg-white/50 backdrop-blur-sm border border-white/20">
        <TabsTrigger value="export">Export</TabsTrigger>
        <TabsTrigger value="import">Import</TabsTrigger>
        <TabsTrigger value="retention">Retention</TabsTrigger>
        <TabsTrigger value="deletion">Data Deletion</TabsTrigger>
      </TabsList>

      <TabsContent value="export" className="space-y-6">
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Export Data</h3>
              <p className="text-sm text-muted-foreground">Download your organization's data in various formats</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-white/20">
                <FileJson className="h-8 w-8 text-blue-600 mb-4" />
                <h4 className="font-semibold mb-2">JSON Export</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Export all data in JSON format for programmatic access
                </p>
                <Button
                  onClick={() => handleExport("json")}
                  disabled={isExporting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as JSON
                </Button>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-white/20">
                <FileSpreadsheet className="h-8 w-8 text-purple-600 mb-4" />
                <h4 className="font-semibold mb-2">CSV Export</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Export data in CSV format for spreadsheet applications
                </p>
                <Button
                  onClick={() => handleExport("csv")}
                  disabled={isExporting}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
              </Card>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="import" className="space-y-6">
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Import Data</h3>
              <p className="text-sm text-muted-foreground">Upload data files to import into your organization</p>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">Drag and drop your file here, or click to browse</p>
                <Input
                  type="file"
                  accept=".json,.csv"
                  onChange={handleImport}
                  disabled={isImporting}
                  className="max-w-xs mx-auto"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Supported formats:</strong> JSON, CSV
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  <strong>Note:</strong> Imported data will be validated before being added to your organization
                </p>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="retention" className="space-y-6">
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Data Retention Policies</h3>
              <p className="text-sm text-muted-foreground">Configure how long different types of data are retained</p>
            </div>

            <div className="space-y-4">
              {[
                { label: "Audit Logs", days: 90 },
                { label: "User Activity", days: 180 },
                { label: "Documents", days: 365 },
                { label: "Archived Records", days: 730 },
              ].map((policy) => (
                <div
                  key={policy.label}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{policy.label}</p>
                      <p className="text-sm text-muted-foreground">Retained for {policy.days} days</p>
                    </div>
                  </div>
                  <Input type="number" defaultValue={policy.days} className="w-24" />
                </div>
              ))}
            </div>

            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Save Retention Policies</Button>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="deletion" className="space-y-6">
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">Permanently delete data from your organization</p>
            </div>

            <div className="space-y-4">
              {[
                { label: "Archived Records", description: "Delete all archived records older than retention period" },
                { label: "Audit Logs", description: "Delete audit logs older than retention period" },
                { label: "Temporary Files", description: "Delete all temporary and cached files" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Button variant="destructive" onClick={() => deleteData(item.label)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> Data deletion is permanent and cannot be undone. Please ensure you have
                backups before proceeding.
              </p>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
