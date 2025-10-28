import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Send, Save, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { getOfferDetail } from "../actions"
import { OfferEditor } from "@/components/talent-offers/offer-editor"
import { ApprovalTimeline } from "@/components/talent-offers/approval-timeline"
import { VersionTimeline } from "@/components/talent-offers/version-timeline"
import { EsignPanel } from "@/components/talent-offers/esign-panel"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OfferDetailPage({ params }: PageProps) {
  await cookies()
  const { id } = await params

  const result = await getOfferDetail(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const offer = result.data

  const statusColors: Record<string, string> = {
    draft: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    pending_approval: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    approved: "bg-green-500/20 text-green-300 border-green-500/30",
    sent: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    accepted: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    declined: "bg-red-500/20 text-red-300 border-red-500/30",
    expired: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/talent/offers">
              <Button variant="ghost" size="icon" className="text-purple-300 hover:text-purple-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{offer.offer_number}</h1>
              <p className="text-sm text-gray-400">
                {offer.candidate_name} • {offer.job_title}
              </p>
            </div>
            <Badge className={statusColors[offer.status] || statusColors.draft}>
              {offer.status.replace(/_/g, " ").toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 bg-transparent"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            {offer.status === "draft" && (
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Submit for Approval
              </Button>
            )}
            {offer.status === "approved" && (
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700">
                <Send className="mr-2 h-4 w-4" />
                Send Offer
              </Button>
            )}
            <Button
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 bg-transparent"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="editor" className="space-y-6">
          <TabsList className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/20">
            <TabsTrigger value="editor">Offer Editor</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="versions">Version History</TabsTrigger>
            <TabsTrigger value="esign">E-Sign Status</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            <OfferEditor offer={offer} />
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Approval Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ApprovalTimeline offerId={offer.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="versions" className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Version History</CardTitle>
              </CardHeader>
              <CardContent>
                <VersionTimeline offerId={offer.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="esign" className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">E-Signature Status</CardTitle>
              </CardHeader>
              <CardContent>
                <EsignPanel offer={offer} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
