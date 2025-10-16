import type React from "react"
import { Suspense } from "react"

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">N</span>
              </div>
              <span className="text-xl font-bold">NINO360 Vendor Portal</span>
            </div>
            <nav className="flex items-center gap-6">
              <a href="/vendor/dashboard" className="text-sm font-medium hover:text-primary">
                Dashboard
              </a>
              <a href="/vendor/submissions" className="text-sm font-medium hover:text-primary">
                Submissions
              </a>
              <a href="/vendor/compliance" className="text-sm font-medium hover:text-primary">
                Compliance
              </a>
              <a href="/vendor/invoices" className="text-sm font-medium hover:text-primary">
                Invoices
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </main>
    </div>
  )
}
