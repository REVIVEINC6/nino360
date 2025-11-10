"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitBranch, Clock, Shield, Settings } from "lucide-react"
import { StagesTab } from "./stages-tab"
import { SLATab } from "./sla-tab"
import { DedupeTab } from "./dedupe-tab"
import { GeneralTab } from "./general-tab"
import { motion } from "framer-motion"

export function CRMSettingsContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-panel p-6"
    >
      <Tabs defaultValue="stages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass-card">
          <TabsTrigger
            value="stages"
            className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20"
          >
            <GitBranch className="mr-2 h-4 w-4" />
            Stages
          </TabsTrigger>
          <TabsTrigger
            value="sla"
            className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20"
          >
            <Clock className="mr-2 h-4 w-4" />
            SLAs
          </TabsTrigger>
          <TabsTrigger
            value="dedupe"
            className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20"
          >
            <Shield className="mr-2 h-4 w-4" />
            Dedupe Rules
          </TabsTrigger>
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20"
          >
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stages">
          <StagesTab />
        </TabsContent>

        <TabsContent value="sla">
          <SLATab />
        </TabsContent>

        <TabsContent value="dedupe">
          <DedupeTab />
        </TabsContent>

        <TabsContent value="general">
          <GeneralTab />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
