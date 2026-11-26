"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  LayoutDashboard, Calendar, BookOpen, BarChart2, Settings, 
  Search, Moon, Sun, Keyboard, X
} from "lucide-react";
import { useTheme } from "next-themes";

export function KeyboardShortcutsModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  // Toggle the cmdk dialog with Ctrl+K or Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      // Close with Escape
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      
      {/* Command Palette */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg">
        <Command className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 border-b border-gray-200 dark:border-gray-800">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <Command.Input 
              placeholder="Type a command or search..." 
              className="w-full py-4 text-sm bg-transparent outline-none placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
            />
            <button 
              onClick={() => setOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <Command.List className="max-h-[320px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-gray-400">
              No results found.
            </Command.Empty>

            {session && (
              <Command.Group heading="Navigation" className="text-xs text-gray-400 px-2 py-1.5 font-semibold uppercase tracking-wider">
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/"))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-500/10 data-[selected=true]:text-blue-600 dark:data-[selected=true]:text-blue-400 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="flex-1">Go to Dashboard</span>
                  <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700">G D</kbd>
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/timetable"))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-500/10 data-[selected=true]:text-blue-600 dark:data-[selected=true]:text-blue-400 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="flex-1">Go to Timetable</span>
                  <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700">G T</kbd>
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/courses"))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-500/10 data-[selected=true]:text-blue-600 dark:data-[selected=true]:text-blue-400 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="flex-1">Go to Courses</span>
                  <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700">G C</kbd>
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/analytics"))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-500/10 data-[selected=true]:text-blue-600 dark:data-[selected=true]:text-blue-400 transition-colors"
                >
                  <BarChart2 className="w-4 h-4" />
                  <span className="flex-1">Go to Analytics</span>
                  <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700">G A</kbd>
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/settings"))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-500/10 data-[selected=true]:text-blue-600 dark:data-[selected=true]:text-blue-400 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="flex-1">Go to Settings</span>
                  <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700">G S</kbd>
                </Command.Item>
              </Command.Group>
            )}

            <Command.Group heading="Actions" className="text-xs text-gray-400 px-2 py-1.5 font-semibold uppercase tracking-wider mt-2">
              <Command.Item
                onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-500/10 data-[selected=true]:text-blue-600 dark:data-[selected=true]:text-blue-400 transition-colors"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="flex-1">Toggle Theme</span>
                <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700">⌘ D</kbd>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Keyboard Shortcuts" className="text-xs text-gray-400 px-2 py-1.5 font-semibold uppercase tracking-wider mt-2">
              <div className="px-3 py-2 text-xs text-gray-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>Open Command Palette</span>
                  <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">⌘ K</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Pomodoro: Start / Pause</span>
                  <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">Space</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Pomodoro: Reset</span>
                  <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">R</kbd>
                </div>
              </div>
            </Command.Group>
          </Command.List>

          <div className="px-4 py-2.5 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Keyboard className="w-3.5 h-3.5" />
              <span>Navigate with ↑↓ keys, select with Enter</span>
            </div>
            <span>ESC to close</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
