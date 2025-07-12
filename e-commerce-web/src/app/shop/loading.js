import { FilterBarSkeleton, ProductGridSkeleton } from '../../components/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen">
      <FilterBarSkeleton />
      <div className="p-2 xs:p-4">
        <div className="h-7 w-20 xs:h-8 xs:w-24 bg-gray-200 rounded animate-pulse mb-4 xs:mb-6" />
        <ProductGridSkeleton count={12} />
      </div>
    </div>
  );
}
