"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  Upload,
  FileText,
  Download,
  Settings,
  Play,
  Pause,
  Square,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  RefreshCw,
  ArrowRight,
  FileSpreadsheet,
  Database,
  Target,
  Save,
  X,
  Plus,
  Info,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"

interface ImportJob {
  id: string
  filename: string
  status: "processing" | "completed" | "failed" | "cancelled"
  progress: number
  totalRecords: number
  processedRecords: number
  successfulRecords: number
  failedRecords: number
  duplicateRecords: number
  createdAt: string
  completedAt?: string
  user: string
  errors: Array<{
    row: number
    field: string
    message: string
    severity: "error" | "warning"
  }>
}

interface Template {
  id: string
  name: string
  description: string
  category: "standard" | "advanced" | "marketing" | "events" | "custom"
  fields: Array<{
    name: string
    type: "text" | "email" | "phone" | "url" | "number" | "select" | "textarea" | "tags"
    required: boolean
    options?: string[]
  }>
  usageCount: number
  createdAt: string
}

interface FieldMapping {
  sourceColumn: string
  targetField: string
  fieldType: string
  required: boolean
  skip: boolean
}

interface ValidationResult {
  isValid: boolean
  errors: Array<{
    row: number
    field: string
    message: string
    severity: "error" | "warning"
  }>
  warnings: Array<{
    row: number
    field: string
    message: string
  }>
  totalRows: number
  validRows: number
}

export default function LeadImportPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State management
  const [activeTab, setActiveTab] = useState("upload")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([])
  const [previewData, setPreviewData] = useState<any[]>([])
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [importJobs, setImportJobs] = useState<ImportJob[]>([])
  const [currentJob, setCurrentJob] = useState<ImportJob | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showValidationDialog, setShowValidationDialog] = useState(false)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [showSettingsSheet, setShowSettingsSheet] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateDescription, setNewTemplateDescription] = useState("")

  // Import settings
  const [importSettings, setImportSettings] = useState({
    duplicateHandling: "skip",
    validateEmails: true,
    validatePhones: true,
    defaultSource: "import",
    defaultStatus: "new",
    defaultOwner: "",
    batchSize: 100,
    assignTags: "",
    sendNotifications: true,
  })

  // Templates data
  const [templates] = useState<Template[]>([
    {
      id: "basic",
      name: "Basic Lead Import",
      description: "Essential fields for lead import",
      category: "standard",
      fields: [
        { name: "firstName", type: "text", required: true },
        { name: "lastName", type: "text", required: true },
        { name: "email", type: "email", required: true },
        { name: "phone", type: "phone", required: false },
        { name: "company", type: "text", required: false },
      ],
      usageCount: 245,
      createdAt: "2024-01-15",
    },
    {
      id: "advanced",
      name: "Advanced Lead Import",
      description: "Comprehensive lead data with all fields",
      category: "advanced",
      fields: [
        { name: "firstName", type: "text", required: true },
        { name: "lastName", type: "text", required: true },
        { name: "email", type: "email", required: true },
        { name: "phone", type: "phone", required: false },
        { name: "company", type: "text", required: false },
        { name: "jobTitle", type: "text", required: false },
        { name: "website", type: "url", required: false },
        {
          name: "industry",
          type: "select",
          required: false,
          options: ["Technology", "Healthcare", "Finance", "Manufacturing"],
        },
        {
          name: "leadSource",
          type: "select",
          required: false,
          options: ["Website", "Referral", "Social Media", "Advertisement"],
        },
        { name: "notes", type: "textarea", required: false },
        { name: "tags", type: "tags", required: false },
      ],
      usageCount: 189,
      createdAt: "2024-01-10",
    },
    {
      id: "marketing",
      name: "Marketing Campaign Import",
      description: "Optimized for marketing campaign leads",
      category: "marketing",
      fields: [
        { name: "firstName", type: "text", required: true },
        { name: "lastName", type: "text", required: true },
        { name: "email", type: "email", required: true },
        { name: "phone", type: "phone", required: false },
        { name: "company", type: "text", required: false },
        { name: "campaignSource", type: "text", required: true },
        { name: "campaignMedium", type: "text", required: false },
        { name: "campaignName", type: "text", required: false },
        { name: "utmContent", type: "text", required: false },
        { name: "landingPage", type: "url", required: false },
      ],
      usageCount: 156,
      createdAt: "2024-01-20",
    },
    {
      id: "events",
      name: "Event Attendee Import",
      description: "For importing event attendees as leads",
      category: "events",
      fields: [
        { name: "firstName", type: "text", required: true },
        { name: "lastName", type: "text", required: true },
        { name: "email", type: "email", required: true },
        { name: "phone", type: "phone", required: false },
        { name: "company", type: "text", required: false },
        { name: "jobTitle", type: "text", required: false },
        { name: "eventName", type: "text", required: true },
        { name: "attendanceStatus", type: "select", required: false, options: ["Attended", "Registered", "No Show"] },
        { name: "sessionAttended", type: "text", required: false },
        { name: "interests", type: "tags", required: false },
      ],
      usageCount: 98,
      createdAt: "2024-01-25",
    },
  ])

  // Initialize import jobs
  useEffect(() => {
    const mockJobs: ImportJob[] = [
      {
        id: "job-1",
        filename: "marketing_leads_q1.csv",
        status: "completed",
        progress: 100,
        totalRecords: 1250,
        processedRecords: 1250,
        successfulRecords: 1180,
        failedRecords: 45,
        duplicateRecords: 25,
        createdAt: "2024-01-15T10:30:00Z",
        completedAt: "2024-01-15T10:35:00Z",
        user: "John Smith",
        errors: [],
      },
      {
        id: "job-2",
        filename: "event_attendees.xlsx",
        status: "processing",
        progress: 65,
        totalRecords: 850,
        processedRecords: 553,
        successfulRecords: 520,
        failedRecords: 18,
        duplicateRecords: 15,
        createdAt: "2024-01-16T14:20:00Z",
        user: "Sarah Johnson",
        errors: [
          { row: 45, field: "email", message: "Invalid email format", severity: "error" },
          { row: 67, field: "phone", message: "Invalid phone number", severity: "warning" },
        ],
      },
      {
        id: "job-3",
        filename: "webinar_registrations.csv",
        status: "failed",
        progress: 25,
        totalRecords: 500,
        processedRecords: 125,
        successfulRecords: 100,
        failedRecords: 25,
        duplicateRecords: 0,
        createdAt: "2024-01-16T16:45:00Z",
        user: "Mike Davis",
        errors: [
          { row: 126, field: "firstName", message: "Required field missing", severity: "error" },
          { row: 127, field: "email", message: "Duplicate email address", severity: "error" },
        ],
      },
    ]
    setImportJobs(mockJobs)
  }, [])

  // Real-time updates for processing jobs
  useEffect(() => {
    const interval = setInterval(() => {
      setImportJobs((prev) =>
        prev.map((job) => {
          if (job.status === "processing" && job.progress < 100) {
            const newProgress = Math.min(job.progress + Math.random() * 10, 100)
            const newProcessed = Math.floor((newProgress / 100) * job.totalRecords)

            return {
              ...job,
              progress: newProgress,
              processedRecords: newProcessed,
              successfulRecords: Math.floor(newProcessed * 0.92),
              failedRecords: Math.floor(newProcessed * 0.05),
              duplicateRecords: Math.floor(newProcessed * 0.03),
              ...(newProgress >= 100 && {
                status: "completed" as const,
                completedAt: new Date().toISOString(),
              }),
            }
          }
          return job
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // File upload handlers
  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file) return

      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/tab-separated-values",
      ]

      if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx?|tsv)$/i)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV, Excel, or TSV file.",
          variant: "destructive",
        })
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 10MB.",
          variant: "destructive",
        })
        return
      }

      setUploadedFile(file)
      simulateFileUpload(file)
    },
    [toast],
  )

  const simulateFileUpload = useCallback(
    (file: File) => {
      setIsUploading(true)
      setUploadProgress(0)

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)

            // Simulate file parsing and preview generation
            setTimeout(() => {
              generatePreviewData(file)
              setActiveTab("mapping")
            }, 500)

            toast({
              title: "File Uploaded Successfully",
              description: `${file.name} has been uploaded and is ready for mapping.`,
            })

            return 100
          }
          return prev + Math.random() * 15
        })
      }, 200)
    },
    [toast],
  )

  const generatePreviewData = useCallback((file: File) => {
    // Simulate CSV parsing and generate preview data
    const mockData = [
      {
        "First Name": "John",
        "Last Name": "Doe",
        Email: "john.doe@example.com",
        Phone: "+1-555-0123",
        Company: "Acme Corp",
        "Job Title": "Marketing Manager",
        Website: "https://acme.com",
        Industry: "Technology",
        "Lead Source": "Website",
        Notes: "Interested in enterprise solution",
      },
      {
        "First Name": "Jane",
        "Last Name": "Smith",
        Email: "jane.smith@techco.com",
        Phone: "+1-555-0124",
        Company: "TechCo Inc",
        "Job Title": "Sales Director",
        Website: "https://techco.com",
        Industry: "Technology",
        "Lead Source": "Referral",
        Notes: "High priority lead",
      },
      {
        "First Name": "Bob",
        "Last Name": "Johnson",
        Email: "bob.johnson@startup.io",
        Phone: "+1-555-0125",
        Company: "Startup.io",
        "Job Title": "CEO",
        Website: "https://startup.io",
        Industry: "Technology",
        "Lead Source": "Social Media",
        Notes: "Looking for integration options",
      },
    ]

    setPreviewData(mockData)

    // Auto-generate field mappings based on column headers
    const columns = Object.keys(mockData[0])
    const mappings: FieldMapping[] = columns.map((column) => ({
      sourceColumn: column,
      targetField: mapColumnToField(column),
      fieldType: inferFieldType(column),
      required: isRequiredField(mapColumnToField(column)),
      skip: false,
    }))

    setFieldMappings(mappings)
  }, [])

  const mapColumnToField = (column: string): string => {
    const mapping: Record<string, string> = {
      "First Name": "firstName",
      "Last Name": "lastName",
      Email: "email",
      Phone: "phone",
      Company: "company",
      "Job Title": "jobTitle",
      Website: "website",
      Industry: "industry",
      "Lead Source": "leadSource",
      Notes: "notes",
    }
    return mapping[column] || column.toLowerCase().replace(/\s+/g, "")
  }

  const inferFieldType = (column: string): string => {
    if (column.toLowerCase().includes("email")) return "email"
    if (column.toLowerCase().includes("phone")) return "phone"
    if (column.toLowerCase().includes("website") || column.toLowerCase().includes("url")) return "url"
    if (column.toLowerCase().includes("notes") || column.toLowerCase().includes("description")) return "textarea"
    return "text"
  }

  const isRequiredField = (field: string): boolean => {
    return ["firstName", "lastName", "email"].includes(field)
  }

  // Template handlers
  const handleTemplateSelect = useCallback(
    (template: Template) => {
      setSelectedTemplate(template)

      if (previewData.length > 0) {
        const columns = Object.keys(previewData[0])
        const mappings: FieldMapping[] = columns.map((column) => {
          const targetField =
            template.fields.find(
              (f) =>
                f.name.toLowerCase() === column.toLowerCase().replace(/\s+/g, "") ||
                column.toLowerCase().includes(f.name.toLowerCase()),
            )?.name || mapColumnToField(column)

          return {
            sourceColumn: column,
            targetField,
            fieldType: template.fields.find((f) => f.name === targetField)?.type || "text",
            required: template.fields.find((f) => f.name === targetField)?.required || false,
            skip: !template.fields.some((f) => f.name === targetField),
          }
        })

        setFieldMappings(mappings)
      }

      toast({
        title: "Template Applied",
        description: `${template.name} template has been applied to your import.`,
      })
    },
    [previewData, toast],
  )

  const handleDownloadTemplate = useCallback(
    (template: Template) => {
      const headers = template.fields.map((field) => field.name)
      const sampleData = template.fields.map((field) => {
        switch (field.type) {
          case "email":
            return "example@company.com"
          case "phone":
            return "+1-555-0123"
          case "url":
            return "https://example.com"
          case "number":
            return "100"
          default:
            return `Sample ${field.name}`
        }
      })

      const csvContent = [headers.join(","), sampleData.join(",")].join("\n")
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `${template.name.toLowerCase().replace(/\s+/g, "_")}_template.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Template Downloaded",
        description: `${template.name} template has been downloaded.`,
      })
    },
    [toast],
  )

  const handleSaveTemplate = useCallback(() => {
    if (!newTemplateName.trim()) {
      toast({
        title: "Template Name Required",
        description: "Please enter a name for your template.",
        variant: "destructive",
      })
      return
    }

    const newTemplate: Template = {
      id: `custom-${Date.now()}`,
      name: newTemplateName,
      description: newTemplateDescription || "Custom template",
      category: "custom",
      fields: fieldMappings
        .filter((mapping) => !mapping.skip)
        .map((mapping) => ({
          name: mapping.targetField,
          type: mapping.fieldType as any,
          required: mapping.required,
        })),
      usageCount: 0,
      createdAt: new Date().toISOString(),
    }

    // In a real app, this would save to the backend
    toast({
      title: "Template Saved",
      description: `${newTemplateName} has been saved as a custom template.`,
    })

    setNewTemplateName("")
    setNewTemplateDescription("")
    setShowTemplateDialog(false)
  }, [newTemplateName, newTemplateDescription, fieldMappings, toast])

  // Field mapping handlers
  const updateFieldMapping = useCallback((index: number, updates: Partial<FieldMapping>) => {
    setFieldMappings((prev) => prev.map((mapping, i) => (i === index ? { ...mapping, ...updates } : mapping)))
  }, [])

  // Validation handlers
  const handleValidateData = useCallback(() => {
    const errors: ValidationResult["errors"] = []
    const warnings: ValidationResult["warnings"] = []

    previewData.forEach((row, index) => {
      fieldMappings.forEach((mapping) => {
        if (mapping.skip) return

        const value = row[mapping.sourceColumn]

        // Required field validation
        if (mapping.required && (!value || value.toString().trim() === "")) {
          errors.push({
            row: index + 1,
            field: mapping.targetField,
            message: "Required field is empty",
            severity: "error",
          })
        }

        // Email validation
        if (mapping.fieldType === "email" && value && importSettings.validateEmails) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            errors.push({
              row: index + 1,
              field: mapping.targetField,
              message: "Invalid email format",
              severity: "error",
            })
          }
        }

        // Phone validation
        if (mapping.fieldType === "phone" && value && importSettings.validatePhones) {
          const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
          if (!phoneRegex.test(value.replace(/[\s\-$$$$]/g, ""))) {
            warnings.push({
              row: index + 1,
              field: mapping.targetField,
              message: "Phone number format may be invalid",
            })
          }
        }

        // URL validation
        if (mapping.fieldType === "url" && value) {
          try {
            new URL(value)
          } catch {
            warnings.push({
              row: index + 1,
              field: mapping.targetField,
              message: "URL format may be invalid",
            })
          }
        }
      })
    })

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      totalRows: previewData.length,
      validRows:
        previewData.length - errors.filter((e, i, arr) => arr.findIndex((err) => err.row === e.row) === i).length,
    }

    setValidationResult(result)
    setShowValidationDialog(true)

    toast({
      title: "Validation Complete",
      description: `Found ${errors.length} errors and ${warnings.length} warnings.`,
      variant: errors.length > 0 ? "destructive" : "default",
    })
  }, [previewData, fieldMappings, importSettings, toast])

  // Import handlers
  const handleStartImport = useCallback(() => {
    if (!uploadedFile || !validationResult) {
      toast({
        title: "Cannot Start Import",
        description: "Please upload a file and validate the data first.",
        variant: "destructive",
      })
      return
    }

    if (!validationResult.isValid) {
      toast({
        title: "Validation Errors Found",
        description: "Please fix all validation errors before importing.",
        variant: "destructive",
      })
      return
    }

    const newJob: ImportJob = {
      id: `job-${Date.now()}`,
      filename: uploadedFile.name,
      status: "processing",
      progress: 0,
      totalRecords: previewData.length,
      processedRecords: 0,
      successfulRecords: 0,
      failedRecords: 0,
      duplicateRecords: 0,
      createdAt: new Date().toISOString(),
      user: "Current User",
      errors: [],
    }

    setImportJobs((prev) => [newJob, ...prev])
    setCurrentJob(newJob)
    setActiveTab("history")

    toast({
      title: "Import Started",
      description: `Import of ${uploadedFile.name} has been started.`,
    })
  }, [uploadedFile, validationResult, previewData, toast])

  const handlePauseJob = useCallback(
    (jobId: string) => {
      setImportJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: "cancelled" as const } : job)))

      toast({
        title: "Import Paused",
        description: "Import job has been paused.",
      })
    },
    [toast],
  )

  const handleCancelJob = useCallback(
    (jobId: string) => {
      setImportJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: "cancelled" as const } : job)))

      toast({
        title: "Import Cancelled",
        description: "Import job has been cancelled.",
      })
    },
    [toast],
  )

  const handleRetryJob = useCallback(
    (jobId: string) => {
      setImportJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? {
                ...job,
                status: "processing" as const,
                progress: 0,
                processedRecords: 0,
                successfulRecords: 0,
                failedRecords: 0,
                duplicateRecords: 0,
              }
            : job,
        ),
      )

      toast({
        title: "Import Restarted",
        description: "Import job has been restarted.",
      })
    },
    [toast],
  )

  const handleDeleteJob = useCallback(
    (jobId: string) => {
      setImportJobs((prev) => prev.filter((job) => job.id !== jobId))

      toast({
        title: "Import Deleted",
        description: "Import job has been deleted.",
      })
    },
    [toast],
  )

  // Export handlers
  const handleExportHistory = useCallback(() => {
    const headers = [
      "Filename",
      "Status",
      "Total Records",
      "Successful",
      "Failed",
      "Duplicates",
      "Created At",
      "Completed At",
      "User",
    ]

    const rows = importJobs.map((job) => [
      job.filename,
      job.status,
      job.totalRecords.toString(),
      job.successfulRecords.toString(),
      job.failedRecords.toString(),
      job.duplicateRecords.toString(),
      new Date(job.createdAt).toLocaleString(),
      job.completedAt ? new Date(job.completedAt).toLocaleString() : "",
      job.user,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `import_history_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "History Exported",
      description: "Import history has been exported to CSV.",
    })
  }, [importJobs, toast])

  // Filter handlers
  const filteredJobs = importJobs.filter((job) => {
    const matchesSearch =
      job.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: ImportJob["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: ImportJob["status"]) => {
    const variants = {
      completed: "default",
      processing: "secondary",
      failed: "destructive",
      cancelled: "outline",
    } as const

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Import</h1>
          <p className="text-muted-foreground">Import leads from CSV, Excel, or other data sources</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportHistory}>
            <Download className="mr-2 h-4 w-4" />
            Export History
          </Button>
          <Button onClick={() => setShowSettingsSheet(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="mapping" disabled={!uploadedFile}>
            Mapping
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!uploadedFile}>
            Preview
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload File
                </CardTitle>
                <CardDescription>Upload your lead data file (CSV, Excel, or TSV)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const file = e.dataTransfer.files[0]
                    if (file) handleFileSelect(file)
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Drop your file here or click to browse</p>
                    <p className="text-xs text-muted-foreground">
                      Supports CSV, Excel (.xlsx, .xls), and TSV files up to 10MB
                    </p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.tsv"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileSelect(file)
                  }}
                  className="hidden"
                />

                {uploadedFile && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        <span className="text-sm font-medium">{uploadedFile.name}</span>
                      </div>
                      <Badge variant="secondary">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</Badge>
                    </div>

                    {isUploading && (
                      <div className="space-y-2">
                        <Progress value={uploadProgress} />
                        <p className="text-xs text-muted-foreground text-center">
                          Uploading... {Math.round(uploadProgress)}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Import Templates
                </CardTitle>
                <CardDescription>Choose a template or create your own</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  {templates.slice(0, 3).map((template) => (
                    <div
                      key={template.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                        selectedTemplate?.id === template.id ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{template.name}</p>
                          <p className="text-xs text-muted-foreground">{template.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {template.usageCount} uses
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadTemplate(template)
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowTemplateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  View All Templates
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mapping Tab */}
        <TabsContent value="mapping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Field Mapping
              </CardTitle>
              <CardDescription>Map your file columns to lead fields</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fieldMappings.length > 0 && (
                <div className="space-y-3">
                  {fieldMappings.map((mapping, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-center p-3 border rounded-lg">
                      <div className="col-span-3">
                        <Label className="text-xs text-muted-foreground">Source Column</Label>
                        <p className="text-sm font-medium">{mapping.sourceColumn}</p>
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <div className="col-span-3">
                        <Label className="text-xs text-muted-foreground">Target Field</Label>
                        <Select
                          value={mapping.targetField}
                          onValueChange={(value) => updateFieldMapping(index, { targetField: value })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="firstName">First Name</SelectItem>
                            <SelectItem value="lastName">Last Name</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="company">Company</SelectItem>
                            <SelectItem value="jobTitle">Job Title</SelectItem>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="industry">Industry</SelectItem>
                            <SelectItem value="leadSource">Lead Source</SelectItem>
                            <SelectItem value="notes">Notes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-2">
                        <Label className="text-xs text-muted-foreground">Field Type</Label>
                        <Select
                          value={mapping.fieldType}
                          onValueChange={(value) => updateFieldMapping(index, { fieldType: value })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="url">URL</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="tags">Tags</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-1 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={mapping.required}
                            onCheckedChange={(checked) => updateFieldMapping(index, { required: checked })}
                          />
                          <Label className="text-xs">Required</Label>
                        </div>
                      </div>

                      <div className="col-span-1 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={mapping.skip}
                            onCheckedChange={(checked) => updateFieldMapping(index, { skip: checked })}
                          />
                          <Label className="text-xs">Skip</Label>
                        </div>
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setFieldMappings((prev) => prev.filter((_, i) => i !== index))
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setShowTemplateDialog(true)}>
                  <Save className="mr-2 h-4 w-4" />
                  Save as Template
                </Button>

                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleValidateData} disabled={fieldMappings.length === 0}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Validate Data
                  </Button>
                  <Button onClick={() => setActiveTab("preview")} disabled={fieldMappings.length === 0}>
                    Preview Data
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Data Preview
              </CardTitle>
              <CardDescription>Review your data before importing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {previewData.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{previewData.length} records</Badge>
                      {validationResult && (
                        <div className="flex items-center gap-2">
                          <Badge variant={validationResult.isValid ? "default" : "destructive"}>
                            {validationResult.validRows} valid
                          </Badge>
                          {validationResult.errors.length > 0 && (
                            <Badge variant="destructive">{validationResult.errors.length} errors</Badge>
                          )}
                          {validationResult.warnings.length > 0 && (
                            <Badge variant="outline">{validationResult.warnings.length} warnings</Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={handleValidateData}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Validate
                      </Button>
                      <Button onClick={handleStartImport} disabled={!validationResult?.isValid}>
                        <Play className="mr-2 h-4 w-4" />
                        Start Import
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {fieldMappings
                            .filter((mapping) => !mapping.skip)
                            .map((mapping, index) => (
                              <TableHead key={index} className="font-medium">
                                {mapping.targetField}
                                {mapping.required && <span className="text-red-500 ml-1">*</span>}
                              </TableHead>
                            ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.slice(0, 10).map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {fieldMappings
                              .filter((mapping) => !mapping.skip)
                              .map((mapping, colIndex) => (
                                <TableCell key={colIndex} className="max-w-[200px] truncate">
                                  {row[mapping.sourceColumn] || "-"}
                                </TableCell>
                              ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {previewData.length > 10 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Showing first 10 of {previewData.length} records
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Import History
              </CardTitle>
              <CardDescription>View and manage your import jobs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search imports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Import Jobs */}
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(job.status)}
                          <div>
                            <p className="font-medium">{job.filename}</p>
                            <p className="text-sm text-muted-foreground">
                              by {job.user} • {new Date(job.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getStatusBadge(job.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {job.status === "processing" && (
                                <>
                                  <DropdownMenuItem onClick={() => handlePauseJob(job.id)}>
                                    <Pause className="mr-2 h-4 w-4" />
                                    Pause
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleCancelJob(job.id)}>
                                    <Square className="mr-2 h-4 w-4" />
                                    Cancel
                                  </DropdownMenuItem>
                                </>
                              )}
                              {job.status === "failed" && (
                                <DropdownMenuItem onClick={() => handleRetryJob(job.id)}>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Retry
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleDeleteJob(job.id)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {job.status === "processing" && (
                        <div className="space-y-2">
                          <Progress value={job.progress} />
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>
                              {job.processedRecords} of {job.totalRecords} processed
                            </span>
                            <span>{Math.round(job.progress)}%</span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-medium text-green-600">{job.successfulRecords}</p>
                          <p className="text-muted-foreground">Successful</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-red-600">{job.failedRecords}</p>
                          <p className="text-muted-foreground">Failed</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-yellow-600">{job.duplicateRecords}</p>
                          <p className="text-muted-foreground">Duplicates</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{job.totalRecords}</p>
                          <p className="text-muted-foreground">Total</p>
                        </div>
                      </div>

                      {job.errors.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-sm font-medium text-red-600 mb-2">Recent Errors ({job.errors.length})</p>
                          <div className="space-y-1">
                            {job.errors.slice(0, 3).map((error, index) => (
                              <p key={index} className="text-xs text-muted-foreground">
                                Row {error.row}: {error.message} ({error.field})
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredJobs.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No import jobs found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Validation Dialog */}
      <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Validation Results
            </DialogTitle>
            <DialogDescription>Review validation results before importing</DialogDescription>
          </DialogHeader>

          {validationResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{validationResult.validRows}</p>
                  <p className="text-sm text-green-700">Valid Records</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{validationResult.errors.length}</p>
                  <p className="text-sm text-red-700">Errors</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{validationResult.warnings.length}</p>
                  <p className="text-sm text-yellow-700">Warnings</p>
                </div>
              </div>

              {validationResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Errors ({validationResult.errors.length})
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {validationResult.errors.map((error, index) => (
                      <div key={index} className="text-sm p-2 bg-red-50 rounded border-l-2 border-red-500">
                        <span className="font-medium">Row {error.row}:</span> {error.message} ({error.field})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {validationResult.warnings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-yellow-600 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Warnings ({validationResult.warnings.length})
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {validationResult.warnings.map((warning, index) => (
                      <div key={index} className="text-sm p-2 bg-yellow-50 rounded border-l-2 border-yellow-500">
                        <span className="font-medium">Row {warning.row}:</span> {warning.message} ({warning.field})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowValidationDialog(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowValidationDialog(false)
                    if (validationResult.isValid) {
                      handleStartImport()
                    }
                  }}
                  disabled={!validationResult.isValid}
                >
                  {validationResult.isValid ? "Start Import" : "Fix Errors First"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Import Templates</DialogTitle>
            <DialogDescription>Choose from existing templates or create a new one</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="existing" className="space-y-4">
            <TabsList>
              <TabsTrigger value="existing">Existing Templates</TabsTrigger>
              <TabsTrigger value="create">Create Template</TabsTrigger>
            </TabsList>

            <TabsContent value="existing" className="space-y-4">
              <div className="grid gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                      selectedTemplate?.id === template.id ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => {
                      handleTemplateSelect(template)
                      setShowTemplateDialog(false)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge variant="outline" className="text-xs capitalize">
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{template.fields.length} fields</span>
                          <span>{template.usageCount} uses</span>
                          <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownloadTemplate(template)
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTemplateSelect(template)
                            setShowTemplateDialog(false)
                          }}
                        >
                          Use Template
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <div className="flex flex-wrap gap-1">
                        {template.fields.slice(0, 8).map((field) => (
                          <Badge key={field.name} variant="secondary" className="text-xs">
                            {field.name}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </Badge>
                        ))}
                        {template.fields.length > 8 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.fields.length - 8} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      placeholder="Enter template name"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-description">Description</Label>
                    <Input
                      id="template-description"
                      placeholder="Enter template description"
                      value={newTemplateDescription}
                      onChange={(e) => setNewTemplateDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Template Fields</Label>
                  <div className="border rounded-lg p-4 space-y-2">
                    {fieldMappings
                      .filter((mapping) => !mapping.skip)
                      .map((mapping, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{mapping.fieldType}</Badge>
                            <span className="font-medium">{mapping.targetField}</span>
                            {mapping.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}

                    {fieldMappings.filter((mapping) => !mapping.skip).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No fields mapped. Please map fields in the mapping tab first.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveTemplate}
                    disabled={!newTemplateName.trim() || fieldMappings.filter((m) => !m.skip).length === 0}
                  >
                    Save Template
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Settings Sheet */}
      <Sheet open={showSettingsSheet} onOpenChange={setShowSettingsSheet}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Import Settings</SheetTitle>
            <SheetDescription>Configure import behavior and validation rules</SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-6">
            {/* Duplicate Handling */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Duplicate Handling</Label>
              <Select
                value={importSettings.duplicateHandling}
                onValueChange={(value) => setImportSettings((prev) => ({ ...prev, duplicateHandling: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skip">Skip Duplicates</SelectItem>
                  <SelectItem value="update">Update Existing</SelectItem>
                  <SelectItem value="create">Create Anyway</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">How to handle records with duplicate email addresses</p>
            </div>

            {/* Validation Settings */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Data Validation</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Validate Email Addresses</Label>
                    <p className="text-sm text-muted-foreground">Check email format and syntax</p>
                  </div>
                  <Switch
                    checked={importSettings.validateEmails}
                    onCheckedChange={(checked) => setImportSettings((prev) => ({ ...prev, validateEmails: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Validate Phone Numbers</Label>
                    <p className="text-sm text-muted-foreground">Check phone number format</p>
                  </div>
                  <Switch
                    checked={importSettings.validatePhones}
                    onCheckedChange={(checked) => setImportSettings((prev) => ({ ...prev, validatePhones: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Default Values */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Default Values</Label>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Lead Source</Label>
                  <Input
                    placeholder="e.g., Import, Website, etc."
                    value={importSettings.defaultSource}
                    onChange={(e) => setImportSettings((prev) => ({ ...prev, defaultSource: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lead Status</Label>
                  <Select
                    value={importSettings.defaultStatus}
                    onValueChange={(value) => setImportSettings((prev) => ({ ...prev, defaultStatus: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="unqualified">Unqualified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Owner</Label>
                  <Select
                    value={importSettings.defaultOwner}
                    onValueChange={(value) => setImportSettings((prev) => ({ ...prev, defaultOwner: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Owner</SelectItem>
                      <SelectItem value="current">Current User</SelectItem>
                      <SelectItem value="john">John Smith</SelectItem>
                      <SelectItem value="sarah">Sarah Johnson</SelectItem>
                      <SelectItem value="mike">Mike Davis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Processing Settings */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Processing</Label>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Batch Size</Label>
                  <Select
                    value={importSettings.batchSize.toString()}
                    onValueChange={(value) =>
                      setImportSettings((prev) => ({ ...prev, batchSize: Number.parseInt(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50 records</SelectItem>
                      <SelectItem value="100">100 records</SelectItem>
                      <SelectItem value="250">250 records</SelectItem>
                      <SelectItem value="500">500 records</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Number of records to process at once</p>
                </div>

                <div className="space-y-2">
                  <Label>Assign Tags</Label>
                  <Input
                    placeholder="e.g., imported, q1-2024"
                    value={importSettings.assignTags}
                    onChange={(e) => setImportSettings((prev) => ({ ...prev, assignTags: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground">Comma-separated tags to assign to all imported leads</p>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Notifications</Label>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Import Completion Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when imports complete</p>
                </div>
                <Switch
                  checked={importSettings.sendNotifications}
                  onCheckedChange={(checked) => setImportSettings((prev) => ({ ...prev, sendNotifications: checked }))}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-6 border-t">
            <Button variant="outline" onClick={() => setShowSettingsSheet(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowSettingsSheet(false)
                toast({
                  title: "Settings Saved",
                  description: "Import settings have been updated.",
                })
              }}
            >
              Save Settings
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
