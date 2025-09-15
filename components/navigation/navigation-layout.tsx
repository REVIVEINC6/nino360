"use client"

import type React from "react"
import { useSmartNavigation } from "./smart-navigation-provider"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Star, Clock } from "lucide-react"

interface NavigationLayoutProps {
  children?: React.ReactNode
}

export function NavigationLayout({ children }: NavigationLayoutProps) {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    searchQuery,
    setSearchQuery,
    filteredItems,
    recentItems,
    favoriteItems,
    navigate,
    toggleFavorite,
  } = useSmartNavigation()

  const handleSelect = (href: string) => {
    navigate(href)
  }

  return (
    <>
      {children}
      <CommandDialog open={isCommandPaletteOpen} onOpenChange={setIsCommandPaletteOpen}>
        <CommandInput placeholder="Search navigation..." value={searchQuery} onValueChange={setSearchQuery} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {favoriteItems.length > 0 && (
            <CommandGroup heading="Favorites">
              {favoriteItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.title}
                  onSelect={() => handleSelect(item.href)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(item)
                    }}
                    className="opacity-50 hover:opacity-100"
                  >
                    <Star className="h-3 w-3 fill-current" />
                  </button>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {recentItems.length > 0 && (
            <CommandGroup heading="Recent">
              {recentItems.slice(0, 5).map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.title}
                  onSelect={() => handleSelect(item.href)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <Clock className="h-3 w-3 opacity-50" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandGroup heading="All Pages">
            {filteredItems.map((item) => (
              <CommandItem
                key={item.id}
                value={item.title}
                onSelect={() => handleSelect(item.href)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(item)
                  }}
                  className="opacity-50 hover:opacity-100"
                >
                  <Star className={`h-3 w-3 ${item.isFavorite ? "fill-current" : ""}`} />
                </button>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
