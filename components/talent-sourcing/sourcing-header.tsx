"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Upload, Mail, Users, FileSpreadsheet } from "lucide-react"

interface SourcingHeaderProps {
  onSearch?: (query: string) => void
  onUploadCSV?: () => void
  onUploadResumes?: () => void
  onEmailIntake?: () => void
  onReferrals?: () => void
}

export function SourcingHeader({
  onSearch,
  onUploadCSV,
  onUploadResumes,
  onEmailIntake,
  onReferrals,
}: SourcingHeaderProps) {
  return (
    <div className="border-b bg-card/50 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold">Talent Sourcing</h1>
          <p className="text-muted-foreground">Multi-channel candidate ingestion and AI-powered matching</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search candidates..." className="pl-9" onChange={(e) => onSearch?.(e.target.value)} />
        </div>

        <Button variant="outline" onClick={onUploadCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Upload CSV
        </Button>

        <Button variant="outline" onClick={onUploadResumes}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Resumes
        </Button>

        <Button variant="outline" onClick={onEmailIntake}>
          <Mail className="h-4 w-4 mr-2" />
          Email Intake
        </Button>

        <Button variant="outline" onClick={onReferrals}>
          <Users className="h-4 w-4 mr-2" />
          Referrals
        </Button>
      </div>
    </div>
  )
}
