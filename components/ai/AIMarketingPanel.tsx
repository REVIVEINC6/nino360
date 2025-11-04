"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Copy, Check, Sparkles, RefreshCw } from "lucide-react"
import { aiMarketingSchema, type AIMarketingInput, type AIMarketingVariant } from "@/lib/validators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

const STORAGE_KEY = "nino360-ai-marketing-inputs"

export function AIMarketingPanel() {
  const [results, setResults] = useState<AIMarketingVariant[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AIMarketingInput>({
    resolver: zodResolver(aiMarketingSchema),
    defaultValues: {
      productName: "",
      persona: "SMB Owner",
      tone: "Professional",
      variants: 1,
      locale: "en-US",
      features: [],
      refine: "",
    },
  })

  // Load saved inputs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        Object.keys(data).forEach((key) => {
          setValue(key as keyof AIMarketingInput, data[key])
        })
      } catch (err) {
        console.error("[v0] Failed to load saved inputs:", err)
      }
    }
  }, [setValue])

  // Save inputs to localStorage
  const watchedValues = watch()
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchedValues))
  }, [watchedValues])

  const onSubmit = async (data: AIMarketingInput) => {
    setError(null)
    setResults(null)

    try {
      const response = await fetch("/api/ai/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || !result.ok) {
        setError(result.error?.message || "Couldn't generate copy right now. Please try again.")
        return
      }

      setResults(result.data)
      toast({
        title: "Marketing content generated!",
        description: `Created ${result.data.length} variant${result.data.length > 1 ? "s" : ""} successfully.`,
      })
    } catch (err) {
      console.error("[v0] AI marketing error:", err)
      setError("Couldn't generate copy right now. Please try again.")
    }
  }

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(section)
      setTimeout(() => setCopiedSection(null), 2000)
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      })
    } catch (err) {
      console.error("[v0] Copy failed:", err)
      toast({
        title: "Copy failed",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const useSampleProduct = () => {
    setValue("productName", "Nino360 HRMS")
    setValue("persona", "HR Lead")
    setValue("tone", "Professional")
    setValue("features", ["Advanced Reports", "SSO/SAML", "Custom Roles", "Audit Log"])
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="productName">Product Name *</Label>
            <Button type="button" variant="ghost" size="sm" onClick={useSampleProduct}>
              <Sparkles className="mr-2 h-3 w-3" />
              Use sample
            </Button>
          </div>
          <Input
            id="productName"
            placeholder="e.g., Nino360 HRMS"
            aria-invalid={!!errors.productName}
            aria-describedby={errors.productName ? "productName-error" : undefined}
            {...register("productName")}
          />
          {errors.productName && (
            <p id="productName-error" className="text-sm text-destructive">
              {errors.productName.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="persona">Target Persona</Label>
            <Select onValueChange={(value) => setValue("persona", value as any)} defaultValue="SMB Owner">
              <SelectTrigger id="persona">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SMB Owner">SMB Owner</SelectItem>
                <SelectItem value="HR Lead">HR Lead</SelectItem>
                <SelectItem value="CTO">CTO</SelectItem>
                <SelectItem value="Marketer">Marketer</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select onValueChange={(value) => setValue("tone", value as any)} defaultValue="Professional">
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Bold">Bold</SelectItem>
                <SelectItem value="Technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="variants">Variants</Label>
            <Select onValueChange={(value) => setValue("variants", Number.parseInt(value))} defaultValue="1">
              <SelectTrigger id="variants">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 variant</SelectItem>
                <SelectItem value="2">2 variants</SelectItem>
                <SelectItem value="3">3 variants</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locale">Locale</Label>
            <Select onValueChange={(value) => setValue("locale", value)} defaultValue="en-US">
              <SelectTrigger id="locale">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="en-GB">English (UK)</SelectItem>
                <SelectItem value="es-ES">Spanish</SelectItem>
                <SelectItem value="fr-FR">French</SelectItem>
                <SelectItem value="de-DE">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Features (FBAC-controlled after login)</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Advanced Reports", "SSO/SAML", "Custom Roles", "Audit Log"].map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  onCheckedChange={(checked) => {
                    const current = watch("features") || []
                    setValue("features", checked ? [...current, feature] : current.filter((f) => f !== feature))
                  }}
                />
                <Label htmlFor={feature} className="text-sm font-normal cursor-pointer">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="refine">Refine (optional)</Label>
          <Textarea
            id="refine"
            placeholder="Add specific guidance or requirements..."
            rows={3}
            {...register("refine")}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate marketing
              </>
            )}
          </Button>
          {results && (
            <Button type="submit" variant="outline" disabled={isSubmitting}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          )}
        </div>
      </form>

      {results && results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              {results.length} variant{results.length > 1 ? "s" : ""} ready to use
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="0" className="w-full">
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${results.length}, 1fr)` }}>
                {results.map((_, index) => (
                  <TabsTrigger key={index} value={String(index)}>
                    Variant {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              {results.map((variant, index) => (
                <TabsContent key={index} value={String(index)} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Headline</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(variant.headline, `headline-${index}`)}
                      >
                        {copiedSection === `headline-${index}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-lg font-semibold">{variant.headline}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Subheadline</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(variant.subhead, `subhead-${index}`)}
                      >
                        {copiedSection === `subhead-${index}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-muted-foreground">{variant.subhead}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Key Benefits</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(variant.bullets.join("\n"), `bullets-${index}`)}
                      >
                        {copiedSection === `bullets-${index}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      {variant.bullets.map((bullet, i) => (
                        <li key={i} className="text-sm">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Call to Action</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(variant.cta, `cta-${index}`)}
                      >
                        {copiedSection === `cta-${index}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="font-medium">{variant.cta}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">SEO Metadata</Label>
                    <div className="rounded-lg border p-3 space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Title:</span> {variant.seo.title}
                      </div>
                      <div>
                        <span className="font-medium">Description:</span> {variant.seo.description}
                      </div>
                      <div>
                        <span className="font-medium">Keywords:</span> {variant.seo.keywords.join(", ")}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Image Prompt</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(variant.imagePrompt, `image-${index}`)}
                      >
                        {copiedSection === `image-${index}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground italic">{variant.imagePrompt}</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
