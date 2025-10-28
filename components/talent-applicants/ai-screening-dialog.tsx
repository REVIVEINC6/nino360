"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Brain, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { runAIScreening } from "@/app/(dashboard)/talent/applicants/actions"
import { useToast } from "@/hooks/use-toast"

interface AIScreeningDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicantIds: string[]
  onScreeningComplete?: () => void
}

export function AIScreeningDialog({ open, onOpenChange, applicantIds, onScreeningComplete }: AIScreeningDialogProps) {
  const [templateId, setTemplateId] = useState<string>("")
  const [screening, setScreening] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const { toast } = useToast()

  const handleScreen = async () => {
    if (!templateId) {
      toast({
        title: "Template required",
        description: "Please select a screening template",
        variant: "destructive",
      })
      return
    }

    setScreening(true)
    try {
      const response = await runAIScreening(applicantIds, templateId)

      if (response.success) {
        setResults(response.data || [])
        toast({
          title: "Screening complete",
          description: `Screened ${applicantIds.length} applicant(s) successfully`,
        })
        onScreeningComplete?.()
      } else {
        toast({
          title: "Screening failed",
          description: response.error || "Failed to run AI screening",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during screening",
        variant: "destructive",
      })
    } finally {
      setScreening(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI-Powered Screening
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          {results.length === 0 && (
            <div className="space-y-4">
              <div>
                <Label>Screening Template</Label>
                <Select value={templateId} onValueChange={setTemplateId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Skills Assessment</SelectItem>
                    <SelectItem value="experience">Experience Evaluation</SelectItem>
                    <SelectItem value="cultural">Cultural Fit Analysis</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive Screening</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Applicants to screen:</strong> {applicantIds.length}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  AI will analyze resumes, skills, experience, and other factors to provide a comprehensive screening
                  score and recommendations.
                </p>
              </div>

              <Button onClick={handleScreen} disabled={screening || !templateId} className="w-full">
                {screening ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Screening in progress...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Run AI Screening
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Results Section */}
          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Screening Complete</span>
              </div>

              <div className="space-y-3">
                {results.map((result, idx) => (
                  <div key={idx} className="p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{result.applicantName}</h4>
                        <p className="text-sm text-muted-foreground">{result.position}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{result.score}%</div>
                        <p className="text-xs text-muted-foreground">AI Score</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {result.recommendation === "strong_match" && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                        {result.recommendation === "maybe" && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                        {result.recommendation === "not_match" && <XCircle className="h-4 w-4 text-red-600" />}
                        <span className="text-sm font-medium capitalize">
                          {result.recommendation?.replace("_", " ")}
                        </span>
                      </div>

                      {result.strengths && result.strengths.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-green-600 mb-1">Strengths:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {result.strengths.map((strength: string, i: number) => (
                              <li key={i}>• {strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.concerns && result.concerns.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-red-600 mb-1">Concerns:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {result.concerns.map((concern: string, i: number) => (
                              <li key={i}>• {concern}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => {
                  setResults([])
                  setTemplateId("")
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
