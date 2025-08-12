export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-brown-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-brown-100 rounded w-48 mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border">
                <div className="h-4 bg-brown-100 rounded w-24 mb-4"></div>
                <div className="h-8 bg-brown-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-brown-100 rounded w-32"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg border">
              <div className="h-6 bg-brown-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-brown-100 rounded w-48"></div>
                    <div className="h-4 bg-brown-100 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="h-6 bg-brown-200 rounded w-40 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-brown-100 rounded w-40"></div>
                    <div className="h-4 bg-brown-100 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
