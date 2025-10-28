import { Suspense } from "react"
import { GettingStartedContent } from "@/components/onboarding/getting-started-content"

export default function GettingStartedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GettingStartedContent />
    </Suspense>
  )
}
