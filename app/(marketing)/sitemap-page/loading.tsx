export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="border-b border-white/20 bg-white/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-16">
          <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-4" />
          <div className="h-6 w-96 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <div className="h-10 w-10 bg-gray-200 rounded-xl animate-pulse mb-6" />
              <div className="space-y-3">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
