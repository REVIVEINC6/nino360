import { Card } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-200 rounded-lg w-2/3 mx-auto mb-6 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="p-8 backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6 backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
                <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
