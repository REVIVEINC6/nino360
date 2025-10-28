"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Upload, FileSpreadsheet, Users, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImportDataStepProps {
  tenantId: string
  onComplete: () => void
}

export function ImportDataStep({ tenantId, onComplete }: ImportDataStepProps) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)

  const importTypes = [
    { id: "users", name: "Users", icon: Users, description: "Import user accounts from CSV" },
    { id: "clients", name: "Clients", icon: Briefcase, description: "Import client data from CSV" },
    { id: "candidates", name: "Candidates", icon: FileSpreadsheet, description: "Import candidate profiles" },
  ]

  const handleFileUpload = async (type: string, file: File) => {
    setUploading(true)
    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: "Success",
        description: `${type} data imported successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import data",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm">
        Import existing data from CSV files. You can skip this step and add data later.
      </p>

      {importTypes.map((type) => {
        const Icon = type.icon
        return (
          <Card key={type.id} className="backdrop-blur-xl bg-white/5 border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{type.name}</h3>
                  <p className="text-white/60 text-sm">{type.description}</p>
                </div>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(type.name, file)
                  }}
                  disabled={uploading}
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  <Upload className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">Upload CSV</span>
                </div>
              </label>
            </div>
          </Card>
        )
      })}

      <button
        onClick={onComplete}
        className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white py-2 px-4 rounded-lg transition-colors mt-6"
      >
        {uploading ? "Uploading..." : "Continue"}
      </button>
    </div>
  )
}
