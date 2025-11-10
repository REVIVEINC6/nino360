"use client"

import { useEffect, useState } from "react"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent } from "@dnd-kit/core"
import { BoardColumn } from "./board-column"
import { ApplicationCard } from "./application-card"
import { listBoard, moveStage, canMove } from "@/app/(dashboard)/talent/applicants/actions"
import { useToast } from "@/hooks/use-toast"
import { ErrorState } from "./error-state"
import { EmptyState } from "./empty-state"

interface ApplicantsBoardProps {
  context: any
}

export function ApplicantsBoard({ context }: ApplicantsBoardProps) {
  const [columns, setColumns] = useState<any[]>([])
  const [cards, setCards] = useState<any[]>([])
  const [activeCard, setActiveCard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const loadBoard = async () => {
    try {
      setLoading(true)
      const data = await listBoard({})
      setColumns(data.columns)
      setCards(data.cards)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBoard()
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    const card = cards.find((c) => c.id === event.active.id)
    setActiveCard(card)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)

    if (!over || active.id === over.id) return

    const cardId = active.id as string
    const toStage = over.id as string

    // Optimistic update
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, stage: toStage } : c)))

    try {
      // Check if move is allowed
      const check = await canMove({ application_id: cardId, to_stage: toStage })

      if (!check.ok) {
        toast({
          title: "Cannot move application",
          description: check.missing_fields?.join(", "),
          variant: "destructive",
        })
        // Rollback
        loadBoard()
        return
      }

      // Perform move
      await moveStage({ application_id: cardId, to_stage: toStage })

      toast({
        title: "Application moved",
        description: `Moved to ${toStage} stage`,
      })
    } catch (err: any) {
      toast({
        title: "Error moving application",
        description: err.message,
        variant: "destructive",
      })
      // Rollback
      loadBoard()
    }
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadBoard} />
  }

  if (!loading && cards.length === 0) {
    return <EmptyState />
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 min-w-max">
          {columns.map((column) => (
            <BoardColumn
              key={column.key}
              column={column}
              cards={cards.filter((c) => c.stage === column.stage)}
              context={context}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeCard && (
          <div className="rotate-3 opacity-80">
            <ApplicationCard card={activeCard} context={context} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
