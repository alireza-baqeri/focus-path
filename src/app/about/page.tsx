import { Target, Zap, Clock, Heart, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about the philosophy and team behind Focus Path.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-20">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 mb-6">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-purple-500 mb-6">
            Our Philosophy
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Focus Path was built to bridge the gap between abstract goal setting and daily execution. We believe that grand achievements are simply the result of consistent, daily micro-habits.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-xl dark:shadow-[0_0_50px_-15px_rgba(147,51,234,0.3)] mb-20 border border-gray-200 dark:border-white/10" suppressHydrationWarning>
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-black/80 via-transparent to-transparent z-10" />
          <Image src="/footer-art.png" alt="Focus Path Journey" fill priority className="object-cover" />
        </div>

        {/* Core Values - 4 cards now */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">What We Believe In</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center border border-amber-200 dark:border-amber-500/20">
                <Clock className="w-6 h-6 text-amber-500 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Time is your only currency</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Every hour logged in Focus Path is an investment in your future self. By visualizing where your time goes through our Deep Analytics, you take back control of your day.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center border border-purple-200 dark:border-purple-500/20">
                <Zap className="w-6 h-6 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Deep Work matters</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                In a world full of distractions, the ability to focus is a superpower. Our built-in Pomodoro timers and smart timetables are specifically designed to cultivate deep, uninterrupted work sessions.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center border border-blue-200 dark:border-blue-500/20">
                <Heart className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Consistency over intensity</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                It&apos;s not about grinding 16 hours in one day — it&apos;s about showing up every day. Our streak system rewards consistency and builds long-term discipline through accountability.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/20">
                <Users className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Privacy first, always</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Your productivity data belongs to you. Focus Path uses local SQLite storage by default — no tracking, no third-party analytics, no selling your habits.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <div className="text-center p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">100%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Open Source</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">0</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Trackers</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">PWA</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Installable</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">∞</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Possibilities</div>
          </div>
        </div>

        {/* Closing CTA */}
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-white/[0.02] dark:to-white/[0.01] border border-gray-200 dark:border-white/5 text-center">
          <Target className="w-12 h-12 text-blue-500 dark:text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Start building your path today</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8">
            Join the journey. Track your progress, maintain your streak, and see what you are truly capable of achieving when you focus.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
