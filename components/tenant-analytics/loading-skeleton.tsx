export function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="glass-card p-6 space-y-4">
        <div className="h-8 w-64 bg-muted animate-shimmer rounded" />
        <div className="h-4 w-32 bg-muted animate-shimmer rounded" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-6">
            <div className="space-y-3">
              <div className="h-4 w-24 bg-muted animate-shimmer rounded" />
              <div className="h-8 w-32 bg-muted animate-shimmer rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <div className="h-64 bg-muted animate-shimmer rounded" />
      </div>
    </div>
  )
}
