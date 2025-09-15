"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  FileText,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Download,
  Share,
  Eye,
  Upload,
  Folder,
  File,
  ImageIcon,
  FileSpreadsheet,
} from "lucide-react"

const documents = [
  {
    id: 1,
    name: "TechCorp Enterprise Agreement.pdf",
    type: "contract",
    size: "2.4 MB",
    company: "TechCorp Inc.",
    uploadedBy: "John Smith",
    uploadedAt: "2024-01-15",
    status: "signed",
    tags: ["contract", "enterprise", "signed"],
  },
  {
    id: 2,
    name: "DataFlow Proposal v2.docx",
    type: "proposal",
    size: "1.8 MB",
    company: "DataFlow Solutions",
    uploadedBy: "Sarah Johnson",
    uploadedAt: "2024-01-14",
    status: "pending",
    tags: ["proposal", "v2", "pending"],
  },
  {
    id: 3,
    name: "CloudTech NDA.pdf",
    type: "nda",
    size: "0.5 MB",
    company: "CloudTech Ltd.",
    uploadedBy: "Mike Chen",
    uploadedAt: "2024-01-13",
    status: "executed",
    tags: ["nda", "legal", "executed"],
  },
  {
    id: 4,
    name: "Product Demo Slides.pptx",
    type: "presentation",
    size: "15.2 MB",
    company: "General",
    uploadedBy: "Alex Wilson",
    uploadedAt: "2024-01-12",
    status: "active",
    tags: ["demo", "presentation", "sales"],
  },
]

const folders = [
  { name: "Contracts", count: 12, icon: Folder },
  { name: "Proposals", count: 8, icon: Folder },
  { name: "NDAs", count: 15, icon: Folder },
  { name: "Presentations", count: 6, icon: Folder },
  { name: "Templates", count: 4, icon: Folder },
]

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const getFileIcon = (type: string) => {
    switch (type) {
      case "contract":
      case "nda":
        return <FileText className="h-4 w-4 text-red-500" />
      case "proposal":
        return <File className="h-4 w-4 text-blue-500" />
      case "presentation":
        return <FileSpreadsheet className="h-4 w-4 text-orange-500" />
      case "image":
        return <ImageIcon className="h-4 w-4 text-green-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "signed":
      case "executed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">AI-enhanced document repository and contract storage</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+23 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contracts</CardTitle>
            <File className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">12 pending signature</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Badge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 GB</div>
            <p className="text-xs text-muted-foreground">of 10 GB limit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Tagged</CardTitle>
            <Badge className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">Auto-categorized</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Folders Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Folders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {folders.map((folder) => (
              <div key={folder.name} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <folder.icon className="h-4 w-4 text-blue-500" />
                <span className="flex-1 text-sm">{folder.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {folder.count}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Documents List */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Document Library</CardTitle>
              <CardDescription>Manage contracts, proposals, and sales materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.type)}
                          <div>
                            <div className="font-medium">{doc.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{doc.company}</TableCell>
                      <TableCell className="text-muted-foreground">{doc.size}</TableCell>
                      <TableCell>{doc.uploadedBy}</TableCell>
                      <TableCell className="text-muted-foreground">{doc.uploadedAt}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {doc.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {doc.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{doc.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
