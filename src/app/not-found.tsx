import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        {/* Large 404 Text */}
        <div className="relative">
          <h1 className="text-[150px] sm:text-[200px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center">
              <Search className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Page Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          Focus Path • Your Productivity Hub
        </p>
      </div>
    </div>
  );
}
