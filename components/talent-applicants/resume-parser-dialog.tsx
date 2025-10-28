"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, Sparkles, CheckCircle2 } from "lucide-react"
import { parseResume } from "@/app/(dashboard)/talent/applicants/actions"
import { useToast } from "@/hooks/use-toast"

interface ResumeParserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicantId: string
  onParseComplete?: () => void
}

export function ResumeParserDialog({ open, onOpenChange, applicantId, onParseComplete }: ResumeParserDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [parsing, setParsing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
    }
  }

  const handleParse = async () => {
    if (!file) return

    setParsing(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("applicantId", applicantId)

      const response = await parseResume(formData)

      if (response.success) {
        setResult(response.data)
        toast({
          title: "Resume parsed successfully",
          description: "AI has extracted structured data from the resume.",
        })
        onParseComplete?.()
      } else {
        toast({
          title: "Parsing failed",
          description: response.error || "Failed to parse resume",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while parsing the resume",
        variant: "destructive",
      })
    } finally {
      setParsing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI-Powered Resume Parser
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="resume-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">{file ? file.name : "Click to upload resume"}</p>
              <p className="text-xs text-muted-foreground">Supports PDF, DOC, DOCX (Max 10MB)</p>
            </label>
          </div>

          {/* Parse Button */}
          {file && !result && (
            <Button onClick={handleParse} disabled={parsing} className="w-full">
              {parsing ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Parsing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Parse Resume
                </>
              )}
            </Button>
          )}

          {/* Results Section */}
          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Parsing Complete</span>
              </div>

              <div className="grid gap-4">
                {/* Personal Info */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <span className="ml-2">{result.name || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <span className="ml-2">{result.email || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="ml-2">{result.phone || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <span className="ml-2">{result.location || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {result.skills && result.skills.length > 0 && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Skills Extracted</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.skills.map((skill: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {result.experience && result.experience.length > 0 && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Experience</h4>
                    <div className="space-y-2">
                      {result.experience.map((exp: any, idx: number) => (
                        <div key={idx} className="text-sm">
                          <p className="font-medium">
                            {exp.title} at {exp.company}
                          </p>
                          <p className="text-muted-foreground text-xs">{exp.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {result.education && result.education.length > 0 && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Education</h4>
                    <div className="space-y-2">
                      {result.education.map((edu: any, idx: number) => (
                        <div key={idx} className="text-sm">
                          <p className="font-medium">{edu.degree}</p>
                          <p className="text-muted-foreground text-xs">
                            {edu.institution} - {edu.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={() => {
                  setFile(null)
                  setResult(null)
                  onOpenChange(false)
                }}
                className="w-full"
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
