export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 xs:px-4 py-4">
          <div className="flex items-center gap-2 xs:gap-4">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-7 w-24 xs:h-8 xs:w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 xs:px-4 py-6 xs:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-8">
          {/* Main Checkout Form Skeleton */}
          <div className="lg:col-span-2 space-y-6 xs:space-y-8">
            {/* Shipping Information Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-4 xs:p-6">
              <div className="h-6 w-32 xs:w-48 bg-gray-200 rounded animate-pulse mb-4 xs:mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-16 xs:w-20 bg-gray-200 rounded animate-pulse mb-1 xs:mb-2" />
                    <div className="h-10 xs:h-12 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Options Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-4 xs:p-6">
              <div className="h-6 w-24 xs:w-32 bg-gray-200 rounded animate-pulse mb-3 xs:mb-4" />
              <div className="space-y-2 xs:space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-3 p-2 xs:p-3 border rounded-lg">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-20 xs:w-32 bg-gray-200 rounded animate-pulse mb-1" />
                      <div className="h-3 w-16 xs:w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-12 xs:w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Information Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-4 xs:p-6">
              <div className="h-6 w-32 xs:w-48 bg-gray-200 rounded animate-pulse mb-4 xs:mb-6" />
              <div className="space-y-3 xs:space-y-4">
                <div>
                  <div className="h-4 w-16 xs:w-24 bg-gray-200 rounded animate-pulse mb-1 xs:mb-2" />
                  <div className="h-10 xs:h-12 w-full bg-gray-200 rounded animate-pulse" />
                </div>
                <div>
                  <div className="h-4 w-20 xs:w-32 bg-gray-200 rounded animate-pulse mb-1 xs:mb-2" />
                  <div className="h-10 xs:h-12 w-full bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                  <div>
                    <div className="h-4 w-16 xs:w-24 bg-gray-200 rounded animate-pulse mb-1 xs:mb-2" />
                    <div className="h-10 xs:h-12 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div>
                    <div className="h-4 w-10 xs:w-12 bg-gray-200 rounded animate-pulse mb-1 xs:mb-2" />
                    <div className="h-10 xs:h-12 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 xs:p-6">
              <div className="h-6 w-24 xs:w-32 bg-gray-200 rounded animate-pulse mb-4 xs:mb-6" />
              
              {/* Cart Items Skeleton */}
              <div className="space-y-3 xs:space-y-4 mb-4 xs:mb-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 xs:gap-3">
                    <div className="w-10 xs:w-12 h-10 xs:h-12 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-16 xs:w-24 bg-gray-200 rounded animate-pulse mb-1" />
                      <div className="h-3 w-12 xs:w-20 bg-gray-200 rounded animate-pulse mb-1" />
                      <div className="h-3 w-10 xs:w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-12 xs:w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Totals Skeleton */}
              <div className="border-t pt-3 xs:pt-4 space-y-1 xs:space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-12 xs:w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-10 xs:w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Security Notice Skeleton */}
              <div className="mt-4 xs:mt-6 p-3 xs:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-32 xs:w-48 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              {/* Place Order Button Skeleton */}
              <div className="h-12 xs:h-14 w-full bg-gray-200 rounded-lg animate-pulse mt-4 xs:mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 