export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading DPA...</p>
      </div>
    </div>
  )
}
