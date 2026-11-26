export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-2">
            <div className="w-40 h-5 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="w-80 h-3 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-24 h-3 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="w-16 h-7 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
            <div className="w-32 h-3 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="w-20 h-3 rounded bg-gray-200 dark:bg-gray-700 mb-3" />
            <div className="w-14 h-7 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
            <div className="w-36 h-3 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 h-[340px]">
          <div className="w-40 h-4 rounded bg-gray-200 dark:bg-gray-700 mb-6" />
          <div className="w-full h-[260px] rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 h-[340px]">
          <div className="w-36 h-4 rounded bg-gray-200 dark:bg-gray-700 mb-6" />
          <div className="w-48 h-48 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mt-8" />
        </div>
      </div>

      {/* Contribution board placeholder */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 animate-pulse">
        <div className="w-48 h-5 rounded bg-gray-200 dark:bg-gray-700 mb-4" />
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 49 }).map((_, i) => (
            <div key={i} className="aspect-square rounded bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    </div>
  );
}
