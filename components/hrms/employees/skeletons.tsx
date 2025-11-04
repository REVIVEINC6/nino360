import { Skeleton } from "@/components/ui/skeleton"

export function EmployeeSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[200px] bg-white/10" />
              <Skeleton className="h-3 w-[150px] bg-white/10" />
            </div>
            <Skeleton className="h-8 w-[100px] bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  )
}
