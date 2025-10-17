"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { updatePlanModule, createModule } from "@/app/(dashboard)/admin/modules/actions"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Module {
  id: string
  name: string
  key: string
  description?: string
}

interface Plan {
  id: string
  name: string
}

interface PlanModule {
  plan_id: string
  module_id: string
  enabled: boolean
}

interface ModulesMatrixProps {
  modules: Module[]
  plans: Plan[]
  planModules: PlanModule[]
}

export function ModulesMatrix({ modules, plans, planModules }: ModulesMatrixProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [newModule, setNewModule] = useState({ name: "", key: "", description: "" })

  const isEnabled = (planId: string, moduleId: string) => {
    return planModules.some((pm) => pm.plan_id === planId && pm.module_id === moduleId && pm.enabled)
  }

  const handleToggle = async (planId: string, moduleId: string, enabled: boolean) => {
    const key = `${planId}:${moduleId}`
    setLoading(key)
    try {
      await updatePlanModule(planId, moduleId, enabled)
      toast.success(enabled ? "Module enabled" : "Module disabled")
    } catch (error) {
      toast.error("Failed to update module access")
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  const handleCreate = async () => {
    if (!newModule.name || !newModule.key) {
      toast.error("Name and key are required")
      return
    }

    try {
      await createModule(newModule)
      toast.success("Module created successfully")
      setCreateOpen(false)
      setNewModule({ name: "", key: "", description: "" })
    } catch (error) {
      toast.error("Failed to create module")
      console.error(error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Module</DialogTitle>
              <DialogDescription>Add a new module to the platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Module Name</Label>
                <Input
                  id="name"
                  value={newModule.name}
                  onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                  placeholder="e.g., CRM"
                />
              </div>
              <div>
                <Label htmlFor="key">Module Key</Label>
                <Input
                  id="key"
                  value={newModule.key}
                  onChange={(e) => setNewModule({ ...newModule, key: e.target.value })}
                  placeholder="e.g., crm"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newModule.description}
                  onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create Module</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Module</TableHead>
              {plans.map((plan) => (
                <TableHead key={plan.id} className="text-center">
                  {plan.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((module) => (
              <TableRow key={module.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{module.name}</div>
                    <div className="text-xs text-muted-foreground">{module.key}</div>
                  </div>
                </TableCell>
                {plans.map((plan) => {
                  const key = `${plan.id}:${module.id}`
                  const enabled = isEnabled(plan.id, module.id)
                  return (
                    <TableCell key={key} className="text-center">
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => handleToggle(plan.id, module.id, checked)}
                        disabled={loading === key}
                      />
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
