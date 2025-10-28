import type React from "react"
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 backdrop-blur-xl bg-background/50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Nino360
          </h1>
        </div>
      </header>
      {children}
    </div>
  )
}
