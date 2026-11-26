export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-800" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading...</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we prepare your content</p>
      </div>
    </div>
  );
}
