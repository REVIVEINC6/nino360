export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded-lg w-96 mx-auto mb-6 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-lg w-2/3 mx-auto animate-pulse" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 border border-white/20 shadow-xl">
              <div className="h-8 bg-gray-200 rounded-lg w-48 mb-6 animate-pulse" />
              <div className="space-y-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 border border-white/20 shadow-xl">
                  <div className="h-6 bg-gray-200 rounded-lg w-32 mb-4 animate-pulse" />
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-4 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
