import type React from "react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"
import "./globals.css"

// Client-only wrappers (dynamically imported without SSR) to avoid pulling client components
// into this server layout during prerender.
const ThemeProvider = dynamic(() => import("@/components/client/theme-provider-wrapper"), { ssr: false })
const Toaster = dynamic(() => import("@/components/client/toaster-wrapper"), { ssr: false })
const ErrorBoundary = dynamic(() => import("@/components/client/error-boundary-wrapper"), { ssr: false })

// NOTE: fonts are intentionally omitted during this temporary build-debug layout.

export const metadata: Metadata = {
  // Used to resolve absolute URLs for OpenGraph/Twitter images at build time
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ThemeProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
