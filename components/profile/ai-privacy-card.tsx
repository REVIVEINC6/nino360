"use client"

import { useState } from "react"
import { Brain, Download, Save, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { saveAiPrivacy } from "@/app/(app)/profile/actions"
import type { AiPrivacyInput } from "@/lib/profile/validators"

interface AiPrivacyCardProps {
  initialConfig: AiPrivacyInput
}

export function AiPrivacyCard({ initialConfig }: AiPrivacyCardProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [config, setConfig] = useState<AiPrivacyInput>(initialConfig)
  const { toast } = useToast()

  const handleSave = async (exportRequest = false) => {
    setIsSaving(true)
    const result = await saveAiPrivacy({ ...config, exportRequest })

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: result.message,
      })
    }

    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="prompt-logging" className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Log AI Prompts
        </Label>
        <Switch
          id="prompt-logging"
          checked={config.promptLogging}
          onCheckedChange={(checked) => setConfig({ ...config, promptLogging: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tone">AI Tone</Label>
        <Select value={config.tone} onValueChange={(value: any) => setConfig({ ...config, tone: value })}>
          <SelectTrigger className="bg-white/5 border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Preferred Model</Label>
        <Select value={config.model || "gpt-4"} onValueChange={(value) => setConfig({ ...config, model: value })}>
          <SelectTrigger className="bg-white/5 border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
            <SelectItem value="claude-3">Claude 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => handleSave(false)}
          disabled={isSaving}
          className="flex-1 bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] hover:from-[#4338CA] hover:to-[#7C3AED]"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
        <Button
          onClick={() => handleSave(true)}
          disabled={isSaving}
          variant="outline"
          className="bg-white/5 border-white/10 hover:bg-white/10"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>
    </div>
  )
}
