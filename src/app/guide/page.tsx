import { CheckCircle2, Compass, PlayCircle, BarChart2, BookOpen, FileText, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Guide | Focus Path",
  description: "Complete guide on how to use Focus Path features.",
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-20">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 mb-6">
            Mastering Focus Path
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A comprehensive guide to leveraging every feature of your new productivity hub.
          </p>
        </div>

        <div className="space-y-16">
          
          {/* Section 1: Timetable & Day Logging */}
          <section className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 p-8 rounded-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Compass className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Smart Timetable</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              The Timetable is your daily command center. Here, you can log exactly how you spent your day. Instead of complex calendars, we use a streamlined block system.
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-gray-900 dark:text-white">Activity Logging:</strong> Add blocks of time (e.g., 60 minutes of &ldquo;Coding&rdquo; or 30 minutes of &ldquo;Reading&rdquo;). These feed directly into your analytics.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-gray-900 dark:text-white">Sleep Tracking:</strong> Log your wake-up and sleep times to maintain a healthy circadian rhythm.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-gray-900 dark:text-white">Daily Journal:</strong> Write down your thoughts, gratitude, or blockers for the day.</span>
              </li>
            </ul>
          </section>

          {/* Section 2: Pomodoro Timer */}
          <section className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 p-8 rounded-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <PlayCircle className="w-6 h-6 text-amber-500 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. Pomodoro Focus Timer</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Accessible from the top navigation bar at any time, the Pomodoro timer is your best friend for deep work.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Set your desired focus duration (default is 25 minutes). Once the timer completes, a chime will play, and the session time will be <strong className="text-gray-900 dark:text-white">automatically added</strong> to your daily Timetable under the &ldquo;Focus&rdquo; category. This seamless integration ensures every minute of hard work is tracked without manual entry.
            </p>
          </section>

          {/* Section 3: Deep Analytics */}
          <section className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 p-8 rounded-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <BarChart2 className="w-6 h-6 text-purple-500 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. Deep Analytics & Streaks</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Your dashboard and Analytics page transform your raw data into actionable insights.
            </p>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-gray-900 dark:text-white">Streak System:</strong> The flame icon in the header represents consecutive days you have logged an activity or watched a course video. Missing a day resets it, so stay consistent!</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-gray-900 dark:text-white">Activity Graph:</strong> A GitHub-style heat map visualizing your activity over the last 6 months. Darker colors mean more intense productivity.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-gray-900 dark:text-white">Predictive Completion:</strong> Based on your average learning speed, the app predicts exactly how many days it will take to finish your ongoing courses.</span>
              </li>
            </ul>
          </section>

          {/* Section 4: Academic Resources & Time Management Science */}
          <section className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 p-8 rounded-3xl mt-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10" />
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <BookOpen className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. The Science of Focus (Academic Resources)</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Focus Path is built on proven psychological and neurobiological principles of attention. If you want to dive deeper into the science of time management, explore these curated resources:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Resource 1 */}
              <div className="p-6 bg-gray-50 dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <PlayCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Huberman Lab: Focus & Concentration</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Stanford neurobiologist Dr. Andrew Huberman explains the science of focus, dopamine circuits, and how to train your brain for 90-minute ultradian cycles.
                </p>
                <a href="https://www.youtube.com/watch?v=hFL6qRIJZ_Y" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline flex items-center gap-1 font-medium">
                  Watch Lecture <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Resource 2 */}
              <div className="p-6 bg-gray-50 dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Deep Work by Cal Newport</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Georgetown University computer science professor Cal Newport defines &ldquo;Deep Work&rdquo; and explains why it is the most valuable skill in the 21st-century economy.
                </p>
                <a href="https://calnewport.com/deep-work-rules-for-focused-success-in-a-distracted-world/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline flex items-center gap-1 font-medium">
                  Read Summary <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Resource 3 */}
              <div className="p-6 bg-gray-50 dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">The Pomodoro Technique (Original Paper)</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Francesco Cirillo&apos;s original research on timeboxing and its effects on anxiety, cognitive load, and sustained productivity over long study sessions.
                </p>
                <a href="https://francescocirillo.com/products/the-pomodoro-technique" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline flex items-center gap-1 font-medium">
                  View Source <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
