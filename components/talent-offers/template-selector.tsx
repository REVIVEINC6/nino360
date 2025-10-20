"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Loader2 } from "lucide-react"
import { listTemplates } from "@/app/(dashboard)/talent/offers/actions"
import { toast } from "sonner"

interface Template {
  id: string
  name: string
  description: string | null
  category: string
  variables: string[]
  body: string
}

interface TemplateSelectorProps {
  onSelect: (template: Template) => void
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false)
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadTemplates()
    }
  }, [open])

  const loadTemplates = async () => {
    setLoading(true)
    try {
      const result = await listTemplates()
      if (result.success && result.data) {
        setTemplates(result.data)
      } else {
        toast.error("Failed to load templates")
      }
    } catch (error) {
      console.error("[v0] Error loading templates:", error)
      toast.error("Failed to load templates")
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (template: Template) => {
    onSelect(template)
    setOpen(false)
    toast.success(`Template "${template.name}" applied`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 bg-transparent"
        >
          <FileText className="mr-2 h-4 w-4" />
          Use Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-white">Select Offer Template</DialogTitle>
          <DialogDescription className="text-gray-400">Choose a template to start your offer letter</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer bg-slate-800/50 backdrop-blur-sm border-purple-500/20 hover:border-purple-500/40 transition-all"
                onClick={() => handleSelect(template)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-white">{template.name}</CardTitle>
                      <CardDescription className="text-gray-400">{template.description}</CardDescription>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">{template.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Variables:</p>
                    <div className="flex flex-wrap gap-2">
                      {template.variables.map((variable) => (
                        <Badge key={variable} variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && templates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-600" />
            <p className="mt-4 text-gray-400">No templates available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
