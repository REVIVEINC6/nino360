import { Suspense } from "react"
import { LoginForm } from "@/components/auth/LoginForm"
import { AIMarketingPanel } from "@/components/ai/AIMarketingPanel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

function LoginFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export default function AuthPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2 grid-cols-1">
      {/* Left Half - Authentication */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to Nino360</h1>
            <p className="text-muted-foreground">Sign in to access your multi-tenant HRMS platform</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign in to your account</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoginFormSkeleton />}>
                <LoginForm />
              </Suspense>
            </CardContent>
          </Card>

          <footer className="text-center text-sm text-muted-foreground space-x-4">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/support" className="hover:underline">
              Support
            </Link>
          </footer>
        </div>
      </div>

      {/* Right Half - AI Marketing Generator */}
      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 via-background to-primary/10 relative overflow-hidden">
        {/* Animated background dots */}
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-primary rounded-full animate-pulse delay-75" />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary rounded-full animate-pulse delay-150" />
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-primary rounded-full animate-pulse delay-300" />
        </div>

        <div className="w-full max-w-2xl space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Generative + Intelligent AI
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Prompt the Product</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Generate compelling marketing content with AI. Create headlines, copy, SEO metadata, and image prompts in
              seconds.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Marketing Generator</CardTitle>
              <CardDescription>Create up to 3 variants of marketing content tailored to your audience</CardDescription>
            </CardHeader>
            <CardContent>
              <AIMarketingPanel />
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Sign in to unlock advanced features with RBAC + FBAC controls
          </p>
        </div>
      </div>
    </div>
  )
}
