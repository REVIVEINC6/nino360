import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-[600px] w-full" />
    </div>
  )
}
