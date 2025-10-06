"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => {
  // If the AvatarImage inside uses the Nino360 logo, we want to render it larger.
  // We detect this by looking for a data attribute or a src prop on props.children when available.
  const isNinoLogo = (() => {
    try {
      const children = (props as any).children
      if (!children) return false
      // If children is an element (AvatarImage) check its props.src
      const child = Array.isArray(children) ? children[0] : children
      const src = child?.props?.src || ""
      return typeof src === "string" && src.includes("nino360-primary.png")
    } catch (e) {
      return false
    }
  })()

  const sizeClass = isNinoLogo ? "h-20 w-20" : "h-10 w-10"

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(`relative flex ${sizeClass} shrink-0 overflow-hidden rounded-full`, className)}
      {...props}
    />
  )
})
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => {
  // If this image is the Nino360 logo, ensure it fills the larger avatar size gracefully
  const src = (props as any).src || ""
  const isNinoLogo = typeof src === "string" && src.includes("nino360-primary.png")
  const imgClass = isNinoLogo ? "aspect-square h-full w-full object-contain" : "aspect-square h-full w-full"
  return <AvatarPrimitive.Image ref={ref} className={cn(imgClass, className)} {...props} />
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
