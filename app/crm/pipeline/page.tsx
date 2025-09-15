"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Target, Plus, DollarSign, Calendar, TrendingUp, AlertCircle } from "lucide-react"

interface Deal {
  id: string
  title: string
  company: string
  contact: string
  avatar: string
  value: string
  probability: number
  closeDate: string
  stage: string
}

const initialDeals: Deal[] = [
  {
    id: "1",
    title: "Enterprise Software License",
    company: "TechCorp Inc.",
    contact: "John Smith",
    avatar: "/placeholder.svg?height=32&width=32&text=JS",
    value: "$450,000",
    probability: 95,
    closeDate: "2024-01-15",
    stage: "negotiation",
  },
  {
    id: "2",
    title: "Cloud Migration Project",
    company: "DataFlow Solutions",
    contact: "Sarah Johnson",
    avatar: "/placeholder.svg?height=32&width=32&text=SJ",
    value: "$280,000",
    probability: 75,
    closeDate: "2024-01-22",
    stage: "proposal",
  },
  {
    id: "3",
    title: "AI Analytics Platform",
    company: "CloudTech Ltd.",
    contact: "Mike Chen",
    avatar: "/placeholder.svg?height=32&width=32&text=MC",
    value: "$125,000",
    probability: 60,
    closeDate: "2024-02-05",
    stage: "qualification",
  },
]

const stages = [
  { id: "prospecting", title: "Prospecting", color: "bg-blue-100 text-blue-800" },
  { id: "qualification", title: "Qualification", color: "bg-yellow-100 text-yellow-800" },
  { id: "proposal", title: "Proposal", color: "bg-orange-100 text-orange-800" },
  { id: "negotiation", title: "Negotiation", color: "bg-purple-100 text-purple-800" },
  { id: "closed-won", title: "Closed Won", color: "bg-green-100 text-green-800" },
]

function DealCard({ deal }: { deal: Deal }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return "text-green-600"
    if (probability >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm">{deal.title}</h4>
            <p className="text-xs text-muted-foreground">{deal.company}</p>
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={deal.avatar || "/placeholder.svg"} alt={deal.contact} />
              <AvatarFallback className="text-xs">
                {deal.contact
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{deal.contact}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">{deal.value}</span>
            <span className={`text-xs font-medium ${getProbabilityColor(deal.probability)}`}>{deal.probability}%</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {deal.closeDate}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DroppableStage({ stage, deals }: { stage: any; deals: Deal[] }) {
  const getStageValue = (deals: Deal[]) => {
    return deals.reduce((total, deal) => {
      return total + Number.parseInt(deal.value.replace(/[$,]/g, ""))
    }, 0)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Badge className={stage.color}>{stage.title}</Badge>
        <span className="text-sm text-muted-foreground">${(getStageValue(deals) / 1000).toFixed(0)}K</span>
      </div>

      <SortableContext items={deals.map((deal) => deal.id)} strategy={verticalListSortingStrategy}>
        <div className="min-h-[400px] p-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export default function PipelinePage() {
  const [deals, setDeals] = useState(initialDeals)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find which stage the item is being dropped into
    const overStage = stages.find((stage) => stage.id === overId)
    if (overStage) {
      setDeals((deals) => deals.map((deal) => (deal.id === activeId ? { ...deal, stage: overStage.id } : deal)))
    }

    setActiveId(null)
  }

  const getDealsByStage = (stageId: string) => {
    return deals.filter((deal) => deal.stage === stageId)
  }

  const activeDeal = activeId ? deals.find((deal) => deal.id === activeId) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground">Kanban view of opportunities with AI suggestions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Opportunity
        </Button>
      </div>

      {/* Pipeline Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground">+15.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weighted Pipeline</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.8M</div>
            <p className="text-xs text-muted-foreground">Based on probability</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$285K</div>
            <p className="text-xs text-muted-foreground">+5.7% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Close Rate</CardTitle>
            <Badge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            AI Pipeline Insights
          </CardTitle>
          <CardDescription>Smart recommendations to accelerate your deals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-800">High Close Probability</p>
              <p className="text-xs text-green-600">TechCorp deal shows 95% close probability - send final proposal</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm font-medium text-orange-800">Stalled Deal Alert</p>
              <p className="text-xs text-orange-600">DataFlow deal hasn't moved in 14 days - schedule follow-up</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800">Upsell Opportunity</p>
              <p className="text-xs text-blue-600">CloudTech shows expansion signals - propose additional modules</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Kanban */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Pipeline</CardTitle>
          <CardDescription>Drag and drop deals between stages</CardDescription>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {stages.map((stage) => (
                <DroppableStage key={stage.id} stage={stage} deals={getDealsByStage(stage.id)} />
              ))}
            </div>

            <DragOverlay>{activeDeal ? <DealCard deal={activeDeal} /> : null}</DragOverlay>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  )
}
