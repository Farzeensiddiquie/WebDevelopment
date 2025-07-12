'use client';
import { useTheme } from '../context/ThemeContext';

export default function Skeleton({ className = "", ...props }) {
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();
  return (
    <div
      className={`animate-pulse ${scheme.card} ${className}`}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();
  return (
    <div className={`${scheme.card} rounded-xl p-3 sm:p-4 shadow-sm flex-shrink-0 w-full max-w-xs sm:max-w-full mx-auto`}>
      <div className="relative">
        <Skeleton className="w-full h-40 sm:h-48 mb-4" />
      </div>
      <Skeleton className="h-4 w-3/4 mb-2 mx-auto" />
      <Skeleton className="h-3 w-1/2 mb-1 mx-auto" />
      <Skeleton className="h-5 w-1/3 mb-1 mx-auto" />
      <Skeleton className="h-3 w-1/4 mx-auto" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();
  return (
    <div className="relative w-full h-48 xs:h-[60vw] md:h-[60vh] lg:h-[90vh] overflow-hidden">
      <Skeleton className="w-full h-full" />
      <div className="absolute inset-0 bg-black/70 z-10" />
      <div className="absolute top-2 left-2 z-30 w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-black/50" />
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-2 xs:px-4">
        <Skeleton className="w-3/4 h-6 xs:h-8 mb-2 xs:mb-4 bg-white/20" />
        <Skeleton className="w-1/2 h-4 xs:h-6 bg-white/20" />
      </div>
    </div>
  );
}

export function FilterBarSkeleton() {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 p-2 sm:p-4 border-b">
      <Skeleton className="h-8 w-20 sm:h-10 sm:w-24" />
      <Skeleton className="h-8 w-24 sm:h-10 sm:w-32" />
      <Skeleton className="h-8 w-20 sm:h-10 sm:w-28" />
      <Skeleton className="h-8 w-16 sm:h-10 sm:w-20" />
    </div>
  );
}

export function ProductDetailSkeleton() {
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();
  return (
    <div className={`min-h-screen ${scheme.card} px-2 py-4 sm:px-4 sm:py-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Product Images */}
          <div className="w-full lg:w-1/2">
            <div className="hidden lg:flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg" />
                ))}
              </div>
              {/* Main Image */}
              <Skeleton className="flex-1 aspect-square rounded-2xl" />
            </div>
            {/* Mobile View */}
            <div className="lg:hidden">
              <Skeleton className="aspect-square rounded-2xl mb-3 sm:mb-4" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/4 mb-3 sm:h-6 sm:mb-4" />
            <Skeleton className="h-6 w-1/3 mb-3 sm:h-8 sm:mb-4" />
            <Skeleton className="h-3 w-full mb-3 sm:h-4 sm:mb-4" />
            <Skeleton className="h-5 w-1/4 mb-2" />
            <div className="flex gap-2 mb-3 sm:mb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-5 w-1/4 mb-2" />
            <div className="flex gap-2 mb-3 sm:mb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-12 sm:h-8 sm:w-16 rounded-full" />
              ))}
            </div>
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-4">
              <Skeleton className="h-9 w-full xs:w-32 rounded-full" />
              <Skeleton className="h-9 w-full xs:w-32 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 