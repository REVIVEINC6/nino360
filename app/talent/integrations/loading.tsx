export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse mx-auto w-96"></div>
        <div className="h-6 bg-gray-200 rounded animate-pulse mx-auto w-[600px]"></div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}
