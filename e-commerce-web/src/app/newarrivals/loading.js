import { FilterBarSkeleton, ProductGridSkeleton } from '../../components/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen">
      <FilterBarSkeleton />
      <div className="p-4">
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-6" />
        <ProductGridSkeleton count={12} />
      </div>
    </div>
  );
}
