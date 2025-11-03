"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, List, Sparkles, ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ContactList {
  id: string
  name: string
  kind: "static" | "segment"
  count: number
}

interface ListsSidebarProps {
  lists: ContactList[]
  selectedListId?: string
  onSelectList: (id: string | undefined) => void
  onCreateList: () => void
  onManageList: (id: string) => void
}

export function ListsSidebar({ lists, selectedListId, onSelectList, onCreateList, onManageList }: ListsSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  const staticLists = lists.filter((l) => l.kind === "static")
  const segments = lists.filter((l) => l.kind === "segment")

  return (
    <div className="w-64 rounded-lg border backdrop-blur-xl bg-white/5 border-white/10 shadow-[0_0_1px_#ffffff33] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Lists & Segments</h3>
        <Button variant="ghost" size="sm" onClick={onCreateList}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {/* All Contacts */}
          <Button
            variant={!selectedListId ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelectList(undefined)}
          >
            <List className="mr-2 h-4 w-4" />
            All Contacts
            <Badge variant="secondary" className="ml-auto">
              {lists.reduce((sum, l) => sum + l.count, 0)}
            </Badge>
          </Button>

          {/* Static Lists */}
          {staticLists.length > 0 && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <ChevronRight className={`mr-2 h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                  <List className="mr-2 h-4 w-4" />
                  Lists
                  <Badge variant="secondary" className="ml-auto">
                    {staticLists.length}
                  </Badge>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1">
                {staticLists.map((list) => (
                  <Button
                    key={list.id}
                    variant={selectedListId === list.id ? "secondary" : "ghost"}
                    className="w-full justify-start pl-8"
                    onClick={() => onSelectList(list.id)}
                  >
                    <span className="truncate">{list.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {list.count}
                    </Badge>
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Smart Segments */}
          {segments.length > 0 && (
            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <ChevronRight className="mr-2 h-4 w-4 transition-transform rotate-90" />
                  <Sparkles className="mr-2 h-4 w-4" />
                  Smart Segments
                  <Badge variant="secondary" className="ml-auto">
                    {segments.length}
                  </Badge>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1">
                {segments.map((segment) => (
                  <Button
                    key={segment.id}
                    variant={selectedListId === segment.id ? "secondary" : "ghost"}
                    className="w-full justify-start pl-8"
                    onClick={() => onSelectList(segment.id)}
                  >
                    <span className="truncate">{segment.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {segment.count}
                    </Badge>
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
