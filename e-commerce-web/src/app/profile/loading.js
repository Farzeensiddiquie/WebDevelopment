export default function Loading() {
  return (
    <div className="min-h-screen bg-white px-2 xs:px-4 py-4 xs:py-6 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="h-7 w-24 xs:h-8 xs:w-32 bg-gray-200 rounded animate-pulse mb-4 xs:mb-6" />
        
        <div className="bg-white shadow rounded-lg p-4 xs:p-6 space-y-6">
          <div className="flex flex-col xs:flex-row items-center xs:space-x-4 space-y-2 xs:space-y-0">
            <div className="w-14 h-14 xs:w-16 xs:h-16 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-24 xs:w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 xs:w-48 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-3 xs:space-y-4">
            <div>
              <div className="h-4 w-16 xs:w-20 bg-gray-200 rounded animate-pulse mb-1 xs:mb-2" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
            <div>
              <div className="h-4 w-20 xs:w-24 bg-gray-200 rounded animate-pulse mb-1 xs:mb-2" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
            <div>
              <div className="h-4 w-12 xs:w-16 bg-gray-200 rounded animate-pulse mb-1 xs:mb-2" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          
          <div className="h-10 w-24 xs:w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
