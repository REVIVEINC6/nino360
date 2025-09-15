import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AINavigationProvider } from "@/components/navigation/ai-navigation-provider"
import { AuthProvider } from "@/hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nino360 - Enterprise AI Platform", // Updated from ESG OS to Nino360
  description: "Next-generation enterprise platform with AI-powered modules",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AINavigationProvider>
              {children}
              <Toaster />
            </AINavigationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
