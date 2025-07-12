import { HeroSkeleton, ProductGridSkeleton } from '../components/Skeleton';

export default function Loading() {
  return (
    <div className="space-y-8 xs:space-y-10 sm:space-y-12 px-2 xs:px-4 py-4 xs:py-6">
      {/* Hero Section */}
      <HeroSkeleton />

      {/* BrandBar Pills */}
      <div className="flex gap-2 xs:gap-3 flex-wrap justify-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-7 w-20 xs:h-8 xs:w-24 bg-gray-200 rounded-full animate-pulse"
          />
        ))}
      </div>

      {/* New Arrivals Section */}
      <div className="space-y-3 xs:space-y-4">
        <div className="h-5 w-32 xs:h-6 xs:w-40 bg-gray-200 rounded animate-pulse" />
        <ProductGridSkeleton count={4} />
      </div>

      {/* Top Selling Section */}
      <div className="space-y-3 xs:space-y-4">
        <div className="h-5 w-32 xs:h-6 xs:w-40 bg-gray-200 rounded animate-pulse" />
        <ProductGridSkeleton count={4} />
      </div>

      {/* Dress Style Section */}
      <div className="space-y-2 xs:space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 xs:h-24 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>

      {/* Happy Customer Testimonials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 h-24 xs:h-28 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
