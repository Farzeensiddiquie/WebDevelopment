import { HeroSkeleton } from '../../components/Skeleton';

export default function Loading() {
  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Hero video placeholder */}
      <HeroSkeleton />

      {/* Browse by Brands Heading */}
      <div className="max-w-7xl mx-auto px-2 xs:px-4 pt-6 xs:pt-8">
        <div className="h-7 w-32 xs:h-8 xs:w-48 bg-gray-200 rounded animate-pulse mb-6 xs:mb-8 mx-auto" />
      </div>

      {/* Products Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-2 xs:px-4 pb-6 xs:pb-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xs:gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-3 xs:p-4 shadow-sm">
              <div className="w-full h-40 xs:h-48 bg-gray-200 rounded animate-pulse mb-3 xs:mb-4" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-1 xs:mb-2 mx-auto" />
              <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse mb-1 mx-auto" />
              <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse mb-1 mx-auto" />
              <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
