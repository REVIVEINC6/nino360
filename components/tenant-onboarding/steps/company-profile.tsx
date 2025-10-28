"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveCompanyProfile } from "@/app/(dashboard)/tenant/onboarding/actions"
import { useToast } from "@/hooks/use-toast"

interface CompanyProfileStepProps {
  tenantId: string
  onComplete: () => void
}

export function CompanyProfileStep({ tenantId, onComplete }: CompanyProfileStepProps) {
  const { toast } = useToast()
  const [profile, setProfile] = useState({
    legal_name: "",
    industry: "",
    company_size: "",
    website: "",
    address_line1: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    phone: "",
    timezone: "UTC",
    locale: "en-US",
    currency: "USD",
    fiscal_year_start: 1,
  })

  const handleSave = async () => {
    try {
      await saveCompanyProfile({
        tenant_id: tenantId,
        ...profile,
      })
      toast({
        title: "Success",
        description: "Company profile saved successfully",
      })
      onComplete()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save company profile",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white">Legal Company Name *</Label>
          <Input
            placeholder="Acme Corporation"
            value={profile.legal_name}
            onChange={(e) => setProfile({ ...profile, legal_name: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Industry</Label>
          <Select value={profile.industry} onValueChange={(v) => setProfile({ ...profile, industry: v })}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Company Size</Label>
          <Select value={profile.company_size} onValueChange={(v) => setProfile({ ...profile, company_size: v })}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 employees</SelectItem>
              <SelectItem value="11-50">11-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="201-500">201-500 employees</SelectItem>
              <SelectItem value="501+">501+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Website</Label>
          <Input
            type="url"
            placeholder="https://example.com"
            value={profile.website}
            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-white">Address</Label>
          <Input
            placeholder="123 Main Street"
            value={profile.address_line1}
            onChange={(e) => setProfile({ ...profile, address_line1: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">City</Label>
          <Input
            placeholder="San Francisco"
            value={profile.city}
            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">State/Province</Label>
          <Input
            placeholder="CA"
            value={profile.state}
            onChange={(e) => setProfile({ ...profile, state: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Country</Label>
          <Input
            placeholder="United States"
            value={profile.country}
            onChange={(e) => setProfile({ ...profile, country: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Zip/Postal Code</Label>
          <Input
            placeholder="94102"
            value={profile.zipcode}
            onChange={(e) => setProfile({ ...profile, zipcode: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Phone</Label>
          <Input
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Timezone</Label>
          <Select value={profile.timezone} onValueChange={(v) => setProfile({ ...profile, timezone: v })}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="America/New_York">Eastern Time</SelectItem>
              <SelectItem value="America/Chicago">Central Time</SelectItem>
              <SelectItem value="America/Denver">Mountain Time</SelectItem>
              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
              <SelectItem value="Europe/London">London</SelectItem>
              <SelectItem value="Asia/Kolkata">India</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Currency</Label>
          <Select value={profile.currency} onValueChange={(v) => setProfile({ ...profile, currency: v })}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD - US Dollar</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="GBP">GBP - British Pound</SelectItem>
              <SelectItem value="INR">INR - Indian Rupee</SelectItem>
              <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Fiscal Year Start</Label>
          <Select
            value={String(profile.fiscal_year_start)}
            onValueChange={(v) => setProfile({ ...profile, fiscal_year_start: Number.parseInt(v) })}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, i) => (
                <SelectItem key={i} value={String(i + 1)}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white py-2 px-4 rounded-lg transition-colors"
      >
        Save Company Profile
      </button>
    </div>
  )
}
