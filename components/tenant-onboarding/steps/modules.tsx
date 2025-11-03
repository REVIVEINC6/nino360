"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Users, Briefcase, DollarSign, BarChart, Zap, Bot, Building, Calendar } from "lucide-react"
import { saveModules } from "@/app/(dashboard)/tenant/onboarding/actions"
import { useToast } from "@/hooks/use-toast"

interface ModulesStepProps {
  tenantId: string
  onComplete: () => void
}

export function ModulesStep({ tenantId, onComplete }: ModulesStepProps) {
  const { toast } = useToast()
  const [modules, setModules] = useState({
    crm: true,
    talent: true,
    bench: true,
    vms: true,
    projects: true,
    finance: true,
    hrms: true,
    automation: false,
    reports: true,
    copilot: false,
  })

  const moduleList = [
    { id: "crm", name: "CRM", icon: Briefcase, description: "Client relationship management" },
    { id: "talent", name: "Talent (ATS)", icon: Users, description: "Applicant tracking system" },
    { id: "bench", name: "Bench", icon: Users, description: "Consultant bench management" },
    { id: "vms", name: "VMS", icon: Building, description: "Vendor management system" },
    { id: "projects", name: "Projects", icon: Calendar, description: "Project management" },
    { id: "finance", name: "Finance", icon: DollarSign, description: "Financial management" },
    { id: "hrms", name: "HRMS", icon: Users, description: "Human resource management" },
    { id: "automation", name: "Automation", icon: Zap, description: "Workflow automation" },
    { id: "reports", name: "Reports", icon: BarChart, description: "Analytics and reporting" },
    { id: "copilot", name: "AI Copilot", icon: Bot, description: "AI-powered assistant" },
  ]

  const handleSave = async () => {
    try {
      await saveModules({
        tenant_id: tenantId,
        modules,
      })
      toast({
        title: "Success",
        description: "Modules configured successfully",
      })
      onComplete()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save module configuration",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm">Enable the modules you need. You can change these settings later.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {moduleList.map((module) => {
          const Icon = module.icon
          return (
            <Card key={module.id} className="backdrop-blur-xl bg-white/5 border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">{module.name}</h3>
                    <p className="text-white/60 text-xs">{module.description}</p>
                  </div>
                </div>
                <Switch
                  checked={modules[module.id as keyof typeof modules]}
                  onCheckedChange={(checked) => setModules({ ...modules, [module.id]: checked })}
                />
              </div>
            </Card>
          )
        })}
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white py-2 px-4 rounded-lg transition-colors mt-6"
      >
        Save Module Configuration
      </button>
    </div>
  )
}
