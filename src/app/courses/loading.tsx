export default function CoursesLoading() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2">
              <div className="w-48 h-5 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="w-72 h-3 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div className="w-28 h-9 rounded-xl bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-pulse">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4">
              <div className="w-full h-4 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
              <div className="w-2/3 h-3 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Progress bar */}
          <div className="h-32 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <div className="w-1/3 h-5 rounded bg-gray-200 dark:bg-gray-700 mb-4" />
            <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
          {/* Sections */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4">
              <div className="w-1/2 h-5 rounded bg-gray-200 dark:bg-gray-700 mb-4" />
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3 py-2">
                  <div className="w-5 h-5 rounded bg-gray-200 dark:bg-gray-700 shrink-0" />
                  <div className="flex-1 h-4 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="w-12 h-4 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
