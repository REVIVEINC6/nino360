"use client"

import { useState } from "react"
import { Sparkles, Save, Send, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OfferEditorProps {
  offer: any
  onSave: (data: any) => void
  onGeneratePdf: () => void
  onAiDraft: () => void
}

export function OfferEditor({ offer, onSave, onGeneratePdf, onAiDraft }: OfferEditorProps) {
  const [comp, setComp] = useState(offer.comp || { base: 0, bonus: 0, equity: "", currency: "USD" })
  const [perks, setPerks] = useState(offer.perks || {})
  const [notes, setNotes] = useState(offer.notes || "")
  const [bodyMd, setBodyMd] = useState("")

  const handleSave = () => {
    onSave({ comp, perks, notes, template_body_md: bodyMd })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="comp" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="comp">Compensation</TabsTrigger>
          <TabsTrigger value="body">Offer Body</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="pdf">PDF</TabsTrigger>
        </TabsList>

        <TabsContent value="comp" className="space-y-4">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>Compensation Package</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Base Salary</Label>
                  <Input
                    type="number"
                    value={comp.base}
                    onChange={(e) => setComp({ ...comp, base: Number.parseFloat(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input value={comp.currency} onChange={(e) => setComp({ ...comp, currency: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bonus (Target)</Label>
                  <Input
                    type="number"
                    value={comp.bonus}
                    onChange={(e) => setComp({ ...comp, bonus: Number.parseFloat(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Equity</Label>
                  <Input
                    value={comp.equity}
                    onChange={(e) => setComp({ ...comp, equity: e.target.value })}
                    placeholder="e.g., 10,000 options"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Additional Perks</Label>
                <Textarea
                  value={JSON.stringify(perks, null, 2)}
                  onChange={(e) => {
                    try {
                      setPerks(JSON.parse(e.target.value))
                    } catch {}
                  }}
                  placeholder='{"benefits": "Health, Dental, Vision", "pto": "20 days"}'
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="body" className="space-y-4">
          <Card className="bg-black/20 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Offer Letter Body</CardTitle>
              <Button onClick={onAiDraft} variant="outline" size="sm">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Draft
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={bodyMd}
                onChange={(e) => setBodyMd(e.target.value)}
                placeholder="Write your offer letter in Markdown. Use {{variables}} for merge fields."
                rows={20}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Available variables: {`{{candidate.first_name}}, {{requisition.title}}, {{comp.base}}, {{valid_until}}`}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground">Preview will render here with merged variables...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pdf" className="space-y-4">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>PDF Generation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate a PDF version of this offer letter for sending to the candidate.
              </p>
              <Button onClick={onGeneratePdf} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Generate PDF
              </Button>
              {offer.pdf_path && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-green-400">PDF generated: {offer.pdf_path}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Label>Internal Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add internal notes (not visible to candidate)"
            rows={3}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button onClick={handleSave} variant="outline">
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button onClick={handleSave} className="bg-linear-to-r from-indigo-600 to-purple-600">
          <Send className="h-4 w-4 mr-2" />
          Save & Continue
        </Button>
      </div>
    </div>
  )
}
