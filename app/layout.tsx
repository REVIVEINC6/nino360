import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Nino360 - Superintelligent Enterprise OS | AI-Powered Business Platform",
  description:
    "The world's first Superintelligent Enterprise OS unifying Generative AI, Intelligent AI, Machine Learning, Automation, and Blockchain trust across CRM, HRMS, ATS, Finance, VMS, Training, and Project Management.",
  keywords: [
    "Enterprise AI",
    "Generative AI",
    "HRMS",
    "CRM",
    "ATS",
    "Finance",
    "VMS",
    "Automation",
    "Blockchain",
    "Machine Learning",
  ],
  authors: [{ name: "Nino360" }],
  openGraph: {
    title: "Nino360 - Superintelligent Enterprise OS",
    description: "Reimagine Enterprise Intelligence with AI-powered business transformation",
    url: "https://nino360.com",
    siteName: "Nino360",
    images: [
      {
        url: "/logo-gradient-box.png",
        width: 1200,
        height: 630,
        alt: "Nino360 Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nino360 - Superintelligent Enterprise OS",
    description: "Reimagine Enterprise Intelligence with AI-powered business transformation",
    images: ["/logo-gradient-box.png"],
  },
  icons: {
    icon: "/logo-primary.png",
    apple: "/logo-primary.png",
  },
  generator: "sreekar",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ErrorBoundary>{children}</ErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
