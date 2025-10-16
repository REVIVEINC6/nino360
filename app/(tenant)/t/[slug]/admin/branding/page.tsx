"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function BrandingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [branding, setBranding] = useState({
    primary_color: "#8B5CF6",
    secondary_color: "#4F46E5",
    logo_url: "",
    company_name: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadBranding()
  }, [])

  const loadBranding = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.from("tenants").select("name, logo_url, primary_color").single()

      if (error) throw error

      if (data) {
        setBranding({
          primary_color: data.primary_color || "#8B5CF6",
          secondary_color: "#4F46E5",
          logo_url: data.logo_url || "",
          company_name: data.name || "",
        })
      }
    } catch (error) {
      console.error("Failed to load branding:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase
        .from("tenants")
        .update({
          name: branding.company_name,
          logo_url: branding.logo_url,
          primary_color: branding.primary_color,
        })
        .eq("id", "current-tenant-id") // In production, get actual tenant ID

      if (error) throw error

      toast({
        title: "Branding updated",
        description: "Your workspace branding has been saved",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update branding",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Branding</h1>
          <p className="text-muted-foreground">Customize your workspace appearance</p>
        </div>

        <Card className="glass-panel border-white/10 p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={branding.company_name}
                onChange={(e) => setBranding({ ...branding, company_name: e.target.value })}
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <div className="flex gap-2">
                <Input
                  id="logo_url"
                  value={branding.logo_url}
                  onChange={(e) => setBranding({ ...branding, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="bg-white/5 border-white/10 flex-1"
                />
                <Button variant="outline" className="border-white/10 bg-transparent">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {branding.logo_url && (
                <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <img
                    src={branding.logo_url || "/placeholder.svg"}
                    alt="Logo preview"
                    className="h-16 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={branding.primary_color}
                    onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })}
                    className="w-20 h-10 p-1 bg-white/5 border-white/10"
                  />
                  <Input
                    value={branding.primary_color}
                    onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })}
                    className="bg-white/5 border-white/10 flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary_color"
                    type="color"
                    value={branding.secondary_color}
                    onChange={(e) => setBranding({ ...branding, secondary_color: e.target.value })}
                    className="w-20 h-10 p-1 bg-white/5 border-white/10"
                  />
                  <Input
                    value={branding.secondary_color}
                    onChange={(e) => setBranding({ ...branding, secondary_color: e.target.value })}
                    className="bg-white/5 border-white/10 flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-muted-foreground mb-4">Preview:</p>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg" style={{ backgroundColor: branding.primary_color }}></div>
                <div className="w-24 h-24 rounded-lg" style={{ backgroundColor: branding.secondary_color }}></div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
