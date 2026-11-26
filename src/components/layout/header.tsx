"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  LayoutDashboard,
  Calendar,
  BookOpen,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { StreakBadge } from "@/components/widgets/streak-badge";
import { PomodoroModal } from "@/components/pomodoro/pomodoro-modal";

const emptySubscribe = () => () => {};

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const isOpen = openPath === pathname;
  const setIsOpen = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      setOpenPath((prevOpenPath) => {
        const currentOpen = prevOpenPath === pathname;
        const resolved = typeof next === "function" ? next(currentOpen) : next;
        return resolved ? pathname : null;
      });
    },
    [pathname]
  );
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const appLinks = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Time Table", href: "/timetable", icon: Calendar },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
  ];

  const marketingLinks = [
    { name: "Guide", href: "/guide", icon: BookOpen },
    { name: "About", href: "/about", icon: LayoutDashboard },
  ];

  const activeLinks = session ? appLinks : marketingLinks;

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, setIsOpen]);

  // Lock body & document scroll completely when mobile menu is open
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [isOpen]);

  // Automatically close mobile menu if viewport resized to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#02020a]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <img
              src="/logo.png"
              alt="Focus Path Logo"
              className="w-9 h-9 rounded-full shadow-lg shadow-blue-500/20"
            />
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Focus Path
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {activeLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {session ? (
            <>
              {/* Streak Badge visible on mobile & desktop */}
              <StreakBadge />
              <PomodoroModal />
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Desktop Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden md:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors focus:outline-none relative"
            title="Toggle Theme"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute inset-0 m-auto h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </div>
          </button>

          {session && <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden md:block"></div>}

          {/* Desktop User Avatar & Dropdown */}
          {session && (
            <div className="hidden md:flex items-center gap-3 group relative">
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold cursor-pointer transition-transform hover:scale-105">
                {session.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                  <p className="text-sm font-semibold truncate">{session.user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user?.email}</p>
                </div>

                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}

          {/* Mobile Hamburger Button with Animated Icon Transition */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="p-2 -mr-1 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 active:scale-95 transition-all md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.div
                  key="close-icon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu-icon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Menu & Backdrop (Rendered into document.body to avoid parent containment issues) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop Overlay */}
                <motion.div
                  key="mobile-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm touch-none md:hidden"
                  aria-hidden="true"
                />

                {/* Slide-in Menu Drawer */}
                <motion.div
                  key="mobile-drawer"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Mobile navigation menu"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="fixed top-0 right-0 z-[100] w-full max-w-[320px] sm:max-w-sm h-dvh bg-white dark:bg-[#02020a] border-l border-gray-200 dark:border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto overscroll-contain touch-pan-y md:hidden"
                >
                  <div className="flex flex-col">
                    {/* Drawer Header with Logo and Close Button */}
                    <div className="h-16 px-5 flex items-center justify-between border-b border-gray-200/80 dark:border-white/10 shrink-0">
                      <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2.5 transition-transform hover:scale-105"
                      >
                        <img
                          src="/logo.png"
                          alt="Focus Path Logo"
                          className="w-8 h-8 rounded-full shadow-lg shadow-blue-500/20"
                        />
                        <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                          Focus Path
                        </span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                        className="p-2 -mr-1 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 active:scale-95 transition-all focus:outline-none"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="p-4 space-y-6">
                      {/* User Profile Section (if authenticated) */}
                      {session && (
                        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-blue-500/10 to-transparent dark:from-blue-500/5 dark:to-transparent border border-blue-500/15 dark:border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold flex items-center justify-center text-base shadow-md shadow-blue-500/20 shrink-0">
                              {session.user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {session.user?.name || "User"}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {session.user?.email}
                              </p>
                            </div>
                            <StreakBadge />
                          </div>
                        </div>
                      )}

                      {/* Nav Links */}
                      <div className="space-y-1">
                        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                          Navigation
                        </p>
                        {activeLinks.map((link) => {
                          const Icon = link.icon;
                          const isActive = pathname === link.href;
                          return (
                            <Link
                              key={link.name}
                              href={link.href}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                isActive
                                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-lg transition-colors ${
                                    isActive
                                      ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                      : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span>{link.name}</span>
                              </div>
                              {isActive && (
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                              )}
                            </Link>
                          );
                        })}
                      </div>

                      {/* Account / Settings (if authenticated) */}
                      {session && (
                        <div className="space-y-1 pt-2 border-t border-gray-200/60 dark:border-white/5">
                          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                            Account
                          </p>
                          <Link
                            href="/settings"
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              pathname === "/settings"
                                ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                                <Settings className="w-4 h-4" />
                              </div>
                              <span>Settings</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setIsOpen(false);
                              signOut({ callbackUrl: "/login" });
                            }}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full text-left"
                          >
                            <div className="p-2 rounded-lg bg-red-100/50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <span>Sign out</span>
                          </button>
                        </div>
                      )}

                      {/* Theme Toggle Switch */}
                      <div className="pt-2 border-t border-gray-200/60 dark:border-white/5">
                        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                          Appearance
                        </p>
                        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                          <div className="flex items-center gap-2.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Sun className="w-4 h-4 text-amber-500 dark:hidden" />
                            <Moon className="w-4 h-4 text-blue-400 hidden dark:block" />
                            <span>Theme</span>
                          </div>
                          <div className="flex items-center bg-gray-200/80 dark:bg-white/10 p-0.5 rounded-lg text-xs font-medium">
                            <button
                              type="button"
                              onClick={() => setTheme("light")}
                              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                                theme === "light"
                                  ? "bg-white text-gray-900 shadow-sm font-semibold"
                                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                              }`}
                            >
                              <Sun className="w-3.5 h-3.5" />
                              <span>Light</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setTheme("dark")}
                              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                                theme === "dark"
                                  ? "bg-gray-900 text-white shadow-sm font-semibold"
                                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                              }`}
                            >
                              <Moon className="w-3.5 h-3.5" />
                              <span>Dark</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section for Non-authenticated Visitors */}
                  {!session && (
                    <div className="p-4 border-t border-gray-200/80 dark:border-white/10 space-y-2.5 bg-gray-50/50 dark:bg-white/[0.02] shrink-0">
                      <Link href="/login" onClick={() => setIsOpen(false)} className="block">
                        <Button
                          variant="outline"
                          className="w-full justify-center rounded-xl py-2.5 text-sm font-semibold border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/login" onClick={() => setIsOpen(false)} className="block">
                        <Button
                          className="w-full justify-center rounded-xl py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
                        >
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  );
}
