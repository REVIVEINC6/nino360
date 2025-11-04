import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, ArrowLeft, Home } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-red-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-md glass-panel">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Access Denied</CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-400">
              You don't have permission to access this page
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>This page requires specific permissions that your account doesn't currently have.</p>
            <p>If you believe you should have access, please contact your administrator or tenant owner.</p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full" variant="default">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild className="w-full bg-transparent" variant="outline">
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-500">
              Need help?{" "}
              <Link href="/settings" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
