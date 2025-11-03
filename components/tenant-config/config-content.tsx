"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfigHeader } from "./config-header"
import { BrandingForm } from "./branding-form"
import { LocaleForm } from "./locale-form"
import { PolicyEditor } from "./policy-editor"
import { IntegrationCards } from "./integration-cards"
import { FeatureFlagsGrid } from "./feature-flags-grid"
import { AdvancedPanel } from "./advanced-panel"

interface ConfigContentProps {
  context: any
}

export function ConfigContent({ context }: ConfigContentProps) {
  const [activeTab, setActiveTab] = useState("branding")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <ConfigHeader tenantName={context.name} saveStatus={saveStatus} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="locale">Locale & Timezone</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="flags">Feature Flags</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="mt-6">
          <BrandingForm
            branding={context.branding}
            onSaveStart={() => setSaveStatus("saving")}
            onSaveComplete={() => setSaveStatus("saved")}
          />
        </TabsContent>

        <TabsContent value="locale" className="mt-6">
          <LocaleForm
            locale={context.profile?.locale || {}}
            timezone={context.timezone}
            onSaveStart={() => setSaveStatus("saving")}
            onSaveComplete={() => setSaveStatus("saved")}
          />
        </TabsContent>

        <TabsContent value="policies" className="mt-6">
          <PolicyEditor
            policies={context.profile?.policies || {}}
            onSaveStart={() => setSaveStatus("saving")}
            onSaveComplete={() => setSaveStatus("saved")}
          />
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <IntegrationCards
            integrations={context.integrations}
            onSaveStart={() => setSaveStatus("saving")}
            onSaveComplete={() => setSaveStatus("saved")}
          />
        </TabsContent>

        <TabsContent value="flags" className="mt-6">
          <FeatureFlagsGrid
            flags={context.flags}
            plan={context.plan}
            onSaveStart={() => setSaveStatus("saving")}
            onSaveComplete={() => setSaveStatus("saved")}
          />
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <AdvancedPanel
            security={context.security}
            tenantId={context.tenantId}
            onSaveStart={() => setSaveStatus("saving")}
            onSaveComplete={() => setSaveStatus("saved")}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
