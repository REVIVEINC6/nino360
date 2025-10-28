"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Palette, Type, Eye } from "lucide-react"
import { updateBranding, uploadLogo } from "@/app/(app)/tenant/branding/actions"
import { useToast } from "@/hooks/use-toast"

export function TenantBrandingContent() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [logoUrl, setLogoUrl] = useState("/placeholder.svg?height=80&width=200")
  const [faviconUrl, setFaviconUrl] = useState("/placeholder.svg?height=32&width=32")
  const [primaryColor, setPrimaryColor] = useState("#3b82f6")
  const [secondaryColor, setSecondaryColor] = useState("#8b5cf6")
  const [accentColor, setAccentColor] = useState("#ec4899")
  const [fontFamily, setFontFamily] = useState("Inter")

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const { url } = await uploadLogo(formData)
      setLogoUrl(url)
      toast({
        title: "Logo uploaded",
        description: "Your logo has been uploaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateBranding({
        logo: logoUrl,
        favicon: faviconUrl,
        primaryColor,
        secondaryColor,
        accentColor,
        fontFamily,
      })
      toast({
        title: "Branding updated",
        description: "Your branding settings have been saved.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update branding. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Branding
        </h1>
        <p className="text-muted-foreground mt-2">Customize your organization's branding and appearance</p>
      </div>

      <Tabs defaultValue="logo" className="space-y-6">
        <TabsList className="bg-white/50 backdrop-blur-sm border border-white/20">
          <TabsTrigger
            value="logo"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Logo & Assets
          </TabsTrigger>
          <TabsTrigger
            value="colors"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
          >
            <Palette className="h-4 w-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger
            value="typography"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
          >
            <Type className="h-4 w-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logo" className="space-y-6">
          <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
            <div className="space-y-6">
              <div>
                <Label>Company Logo</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your company logo (recommended: 200x80px, PNG or SVG)
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-48 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <img
                      src={logoUrl || "/placeholder.svg"}
                      alt="Logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </label>
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label>Favicon</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your favicon (recommended: 32x32px, PNG or ICO)
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <img
                      src={faviconUrl || "/placeholder.svg"}
                      alt="Favicon"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div>
                    <Input type="file" accept="image/*" className="hidden" id="favicon-upload" />
                    <Button asChild variant="outline">
                      <label htmlFor="favicon-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Favicon
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-6">
          <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
            <div className="space-y-6">
              <div>
                <Label htmlFor="primary-color">Primary Color</Label>
                <p className="text-sm text-muted-foreground mb-2">Main brand color used for buttons and accents</p>
                <div className="flex items-center gap-4">
                  <Input
                    id="primary-color"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <p className="text-sm text-muted-foreground mb-2">Secondary brand color for gradients and highlights</p>
                <div className="flex items-center gap-4">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accent-color">Accent Color</Label>
                <p className="text-sm text-muted-foreground mb-2">Accent color for special elements and CTAs</p>
                <div className="flex items-center gap-4">
                  <Input
                    id="accent-color"
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
            <div className="space-y-6">
              <div>
                <Label htmlFor="font-family">Font Family</Label>
                <p className="text-sm text-muted-foreground mb-2">Choose the primary font for your application</p>
                <select
                  id="font-family"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>

              <div>
                <Label>Font Preview</Label>
                <div className="mt-2 p-6 border border-gray-300 rounded-lg bg-white" style={{ fontFamily }}>
                  <h1 className="text-4xl font-bold mb-2">Heading 1</h1>
                  <h2 className="text-3xl font-semibold mb-2">Heading 2</h2>
                  <h3 className="text-2xl font-medium mb-2">Heading 3</h3>
                  <p className="text-base mb-2">
                    This is a paragraph of body text. The quick brown fox jumps over the lazy dog.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This is smaller text used for captions and descriptions.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
            <div className="space-y-6">
              <div>
                <Label>Brand Preview</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Preview how your branding will look across the application
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-6 border border-gray-200 rounded-lg bg-white" style={{ fontFamily }}>
                  <div className="flex items-center justify-between mb-6">
                    <img src={logoUrl || "/placeholder.svg"} alt="Logo" className="h-10" />
                    <div className="flex gap-2">
                      <Button style={{ backgroundColor: primaryColor }} className="text-white">
                        Primary Button
                      </Button>
                      <Button style={{ backgroundColor: secondaryColor }} className="text-white">
                        Secondary Button
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>
                      Welcome to Your Dashboard
                    </h2>
                    <p className="text-muted-foreground">
                      This is how your branding will appear throughout the application.
                    </p>
                    <div className="flex gap-2">
                      <div className="w-20 h-20 rounded-lg" style={{ backgroundColor: primaryColor }} />
                      <div className="w-20 h-20 rounded-lg" style={{ backgroundColor: secondaryColor }} />
                      <div className="w-20 h-20 rounded-lg" style={{ backgroundColor: accentColor }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        >
          {loading ? "Saving..." : "Save Branding"}
        </Button>
      </div>
    </div>
  )
}
