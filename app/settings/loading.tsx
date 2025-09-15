export default function SettingsLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="animate-pulse space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-20 bg-gray-200 rounded"></div>
            <div className="h-10 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Search */}
        <div className="h-10 bg-gray-200 rounded w-80"></div>

        {/* Tabs */}
        <div className="h-10 bg-gray-200 rounded w-96"></div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>

        {/* System Health Card */}
        <div className="h-64 bg-gray-200 rounded"></div>

        {/* Quick Access Card */}
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}
