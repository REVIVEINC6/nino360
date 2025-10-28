import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-bold bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-none">
            404
          </h1>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent blur-3xl -z-10" />
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Page Not Found</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
            <Link href="javascript:history.back()">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/crm" className="text-sm text-primary hover:underline">
              CRM
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/talent" className="text-sm text-primary hover:underline">
              Talent/ATS
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/hrms" className="text-sm text-primary hover:underline">
              HRMS
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/finance" className="text-sm text-primary hover:underline">
              Finance
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/settings" className="text-sm text-primary hover:underline">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
