export default function TimetableLoading() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2">
              <div className="w-40 h-5 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="w-64 h-3 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-20 h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
            <div className="w-20 h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
            <div className="w-20 h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
      
      {/* Calendar grid skeleton */}
      <div className="grid grid-cols-7 gap-2 animate-pulse">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={`h-${i}`} className="h-8 rounded bg-gray-200 dark:bg-gray-700" />
        ))}
        {Array.from({ length: 28 }).map((_, i) => (
          <div key={`c-${i}`} className="h-24 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
        ))}
      </div>
    </div>
  );
}
