import { FilterBarSkeleton, ProductGridSkeleton } from '../../components/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header Skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 xs:px-4 py-4">
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-4">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-full h-10 xs:h-12 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="w-20 h-8 xs:w-24 xs:h-10 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 xs:px-4 py-6 xs:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 xs:gap-8">
          {/* Filters Sidebar Skeleton */}
          <div className="lg:col-span-1 mb-4 lg:mb-0">
            <div className="bg-white rounded-lg shadow-sm p-4 xs:p-6">
              <div className="h-6 w-12 xs:w-16 bg-gray-200 rounded animate-pulse mb-3 xs:mb-4" />
              <div className="space-y-3 xs:space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-16 xs:w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search Results Skeleton */}
          <div className="lg:col-span-3">
            <div className="mb-4 xs:mb-6">
              <div className="h-7 w-32 xs:h-8 xs:w-48 bg-gray-200 rounded animate-pulse mb-1 xs:mb-2" />
              <div className="h-4 w-40 xs:w-64 bg-gray-200 rounded animate-pulse" />
            </div>
            <ProductGridSkeleton count={9} />
          </div>
        </div>
      </div>
    </div>
  );
} 