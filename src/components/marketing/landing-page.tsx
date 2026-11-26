"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  BarChart2,
  Clock,
  Sparkles,
  Users,
  Shield,
  Star,
  UserPlus,
  Calendar,
  TrendingUp,
  Quote,
  Zap,
  Check,
  Flame,
  Layers,
  Code2,
  Database,
  Lock,
} from "lucide-react";

/**
 * AnimatedCounter Component
 * 
 * Smoothly interpolates from 0 to target number using requestAnimationFrame
 * and ease-out cubic curve when scrolled into viewport.
 */
interface CounterProps {
  target: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

function AnimatedCounter({ target, suffix = "", decimals = 0, duration = 2000 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setValue(easeOut * target);

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };

    animId = requestAnimationFrame(animate);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isInView, target, duration]);

  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toString();

  return (
    <span ref={ref} className="tabular-nums font-extrabold">
      {formatted}{suffix}
    </span>
  );
}

/**
 * LandingPage Component
 * 
 * Production-ready public homepage for Focus Path.
 * Built with Next.js 16, React 19, Tailwind CSS v4, and Framer Motion.
 * Features:
 *  - Hero section with ambient glows and floating glass widgets
 *  - Stats counter section with viewport-triggered requestAnimationFrame counters
 *  - Technology stack & badges section
 *  - Enhanced 3-column feature highlights
 *  - How it works 3-step timeline with connecting line
 *  - Testimonials section with initials-based colored avatars
 *  - High-impact gradient CTA section
 */
export default function LandingPage() {
  // References for viewport animation triggers
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  const techRef = useRef<HTMLDivElement>(null);
  const techInView = useInView(techRef, { once: true, margin: "-60px" });

  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-60px" });

  const stepsRef = useRef<HTMLDivElement>(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: "-60px" });

  const testimonialsRef = useRef<HTMLDivElement>(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-60px" });

  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-60px" });

  // 1. Stats Counter Data
  const stats = [
    {
      icon: Users,
      target: 500,
      suffix: "+",
      decimals: 0,
      label: "Users",
      sublabel: "Focused learners & builders",
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10 border-purple-500/20",
      glowColor: "bg-purple-600/15",
    },
    {
      icon: Clock,
      target: 10,
      suffix: "K+",
      decimals: 0,
      label: "Sessions Tracked",
      sublabel: "Deep focus & study blocks logged",
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      glowColor: "bg-amber-600/15",
    },
    {
      icon: Shield,
      target: 99.9,
      suffix: "%",
      decimals: 1,
      label: "Uptime",
      sublabel: "Reliable tracking & instant local sync",
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      glowColor: "bg-emerald-600/15",
    },
    {
      icon: Star,
      target: 4.9,
      suffix: "/5",
      decimals: 1,
      label: "Rating",
      sublabel: "Loved by productivity enthusiasts",
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-500/10 border-yellow-500/20",
      glowColor: "bg-yellow-600/15",
    },
  ];

  // 2. Tech Stack Data
  const techBadges = [
    { name: "Next.js 16", desc: "App Router & SSR", icon: Zap, color: "text-white" },
    { name: "React 19", desc: "Concurrent Engine", icon: Code2, color: "text-blue-400" },
    { name: "Tailwind CSS v4", desc: "Modern CSS Config", icon: Layers, color: "text-cyan-400" },
    { name: "Framer Motion", desc: "Fluid 60fps Animations", icon: Sparkles, color: "text-pink-400" },
    { name: "Prisma & SQLite", desc: "Zero-Latency Local DB", icon: Database, color: "text-emerald-400" },
    { name: "NextAuth", desc: "Protected Sessions", icon: Lock, color: "text-amber-400" },
  ];

  // 3. How It Works Steps Data
  const steps = [
    {
      step: "01",
      title: "Create Your Account",
      subtitle: "Sign up in seconds",
      description:
        "Get started immediately without any friction. Define your daily goals, target study hours, and notification preferences in a clean, private workspace.",
      icon: UserPlus,
      color: "from-purple-500 to-indigo-500",
      borderGlow: "group-hover:border-purple-500/40",
      pillBg: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    },
    {
      step: "02",
      title: "Plan Your Day",
      subtitle: "Use timetable and journal",
      description:
        "Map out daily focus blocks with our unified 24-hour timetable. Pair schedule blocks with integrated Pomodoro sessions and concise evening reflections.",
      icon: Calendar,
      color: "from-amber-400 to-orange-500",
      borderGlow: "group-hover:border-amber-500/40",
      pillBg: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    },
    {
      step: "03",
      title: "Track & Grow",
      subtitle: "Watch your progress unfold",
      description:
        "Watch your consistency compound through GitHub-style 365-day heatmaps, course milestone trackers, and intelligent completion velocity forecasts.",
      icon: TrendingUp,
      color: "from-emerald-400 to-teal-500",
      borderGlow: "group-hover:border-emerald-500/40",
      pillBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    },
  ];

  // 4. Testimonials Data
  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Senior Software Engineer",
      initials: "AR",
      avatarBg: "from-purple-500 to-indigo-600",
      quote:
        "Focus Path completely transformed how I structure my deep work blocks. The timetable combined with GitHub-style streaks keeps me accountable every single day without feeling overwhelmed.",
      metric: "142-day focus streak",
    },
    {
      name: "Dr. Sarah Chen",
      role: "Medical Resident & Researcher",
      initials: "SC",
      avatarBg: "from-amber-400 to-rose-500",
      quote:
        "Between clinical rotations and studying for board certifications, I needed a tool that was fast, beautiful, and distraction-free. The velocity analytics and offline reliability make it unmatched.",
      metric: "1,200+ study hours logged",
    },
    {
      name: "Marcus Vance",
      role: "Product Designer & Indie Founder",
      initials: "MV",
      avatarBg: "from-emerald-400 to-teal-600",
      quote:
        "Most productivity apps are bloated with unnecessary complexity. Focus Path nails the essentials: frictionless daily journaling, intuitive course tracking, and dark mode aesthetics that inspire focus.",
      metric: "8 major milestones achieved",
    },
  ];

  return (
    <div className="min-h-screen bg-[#02020a] font-sans w-full max-w-[100vw] overflow-x-hidden relative selection:bg-purple-500/30 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute top-[65%] left-[-10%] w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[600px] bg-purple-800/20 rounded-full blur-[140px] -z-10 pointer-events-none" />

      {/* ======================================================== */}
      {/* 1. HERO SECTION                                         */}
      {/* ======================================================== */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-gray-300">Your Ultimate Productivity Hub</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight leading-[1.1] mb-6"
          >
            Focus on today. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-purple-500">
              Build a better tomorrow.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
          >
            Plan your day. Build good habits. Stay consistent. 
            Focus Path combines time-tracking, Pomodoro sessions, and deep analytics to help you reach your goals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(147,51,234,0.5)] w-full sm:w-auto"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative">Start Your Journey</span>
              <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 font-semibold text-gray-300 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:text-white transition-all backdrop-blur-md w-full sm:w-auto text-center"
            >
              How it works
            </a>
          </motion.div>
        </div>

        {/* Hero Image / Visual with Floating Badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 relative w-full max-w-2xl lg:max-w-none"
        >
          {/* Ambient Glow underneath image */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-amber-500/20 rounded-3xl blur-2xl -z-10" />

          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-900/40 group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
            <img
              src="/landing.png"
              alt="Focus Path Dashboard Visual"
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
            />

            {/* Floating Glass Pill 1: Streak */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute top-4 left-4 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#02020a]/80 backdrop-blur-xl border border-white/10 shadow-xl"
            >
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Flame className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">14-Day Streak</div>
                <div className="text-[10px] text-gray-400">Consistent focus logged</div>
              </div>
            </motion.div>

            {/* Floating Glass Pill 2: Pomodoro */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-6 right-4 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#02020a]/80 backdrop-blur-xl border border-white/10 shadow-xl"
            >
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Zap className="w-4 h-4 fill-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">25m Deep Work Active</div>
                <div className="text-[10px] text-emerald-400">Target: 4 sessions today</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ======================================================== */}
      {/* 2. STATS COUNTER SECTION (requestAnimationFrame + useInView) */}
      {/* ======================================================== */}
      <section ref={statsRef} className="relative z-10 py-12 border-y border-white/5 bg-white/[0.015] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative group p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/20 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.04] overflow-hidden"
                >
                  <div className={`absolute -right-6 -bottom-6 w-28 h-28 ${stat.glowColor} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
                  
                  <div className="relative z-10 flex items-start gap-4">
                    <div className={`p-3.5 rounded-2xl ${stat.iconBg} ${stat.iconColor} border shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight flex items-baseline">
                        <AnimatedCounter
                          target={stat.target}
                          suffix={stat.suffix}
                          decimals={stat.decimals}
                        />
                      </div>
                      <div className="text-base font-bold text-gray-200 mt-1">{stat.label}</div>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{stat.sublabel}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. TRUSTED BY / TECHNOLOGY BADGES SECTION                */}
      {/* ======================================================== */}
      <section ref={techRef} className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={techInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-3">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">Modern Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Engineered for Speed, Precision & Zero Friction
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto mt-2">
              Powered by cutting-edge web standards for smooth 60fps interactions and rock-solid local persistence.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {techBadges.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={techInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 group"
                >
                  <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${tech.color} mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-gray-200">{tech.name}</span>
                  <span className="text-[11px] text-gray-400 mt-0.5">{tech.desc}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. FEATURE HIGHLIGHTS (Enhanced existing cards)          */}
      {/* ======================================================== */}
      <section ref={featuresRef} className="border-t border-white/5 bg-white/[0.02] backdrop-blur-3xl py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">Feature Highlights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Everything you need to stay on track
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
              Designed for students, developers, and professionals who demand the absolute best from their time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <EnhancedFeatureCard
              icon={<Clock className="w-7 h-7 text-amber-400" />}
              tag="Time Architecture"
              title="Smart Timetable"
              description="Log your daily activities, sleep schedule, and journal entries all in one unified daily timeline."
              bullets={[
                "Visual 24-hour daily timeline grid",
                "Built-in Pomodoro focus timer integration",
                "Daily journal reflections & activity logs",
              ]}
              delay={0.1}
              inView={featuresInView}
            />
            <EnhancedFeatureCard
              icon={<BarChart2 className="w-7 h-7 text-purple-400" />}
              tag="Deep Insights"
              title="Deep Analytics"
              description="Visualize your habits with 365-day contribution boards, velocity calculations, and predictive completion tracking."
              bullets={[
                "GitHub-style annual contribution heatmap",
                "Productivity velocity trend calculations",
                "Category time breakdown & focus metrics",
              ]}
              delay={0.2}
              inView={featuresInView}
            />
            <EnhancedFeatureCard
              icon={<CheckCircle className="w-7 h-7 text-blue-400" />}
              tag="Progress Systems"
              title="Goal & Course Tracking"
              description="Import courses, track video completions, and manage long-term goals with our intuitive progress systems."
              bullets={[
                "Video course episode checklist & progress",
                "Target completion date estimations",
                "Milestone badges & habit streak protection",
              ]}
              delay={0.3}
              inView={featuresInView}
            />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. HOW IT WORKS SECTION (3 Steps with connecting line)   */}
      {/* ======================================================== */}
      <section id="how-it-works" ref={stepsRef} className="py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-3">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">Simple 3-Step Flow</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              How Focus Path Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
              Transform everyday intentions into disciplined, measurable momentum in three straightforward steps.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-[34px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-purple-500/30 via-amber-500/40 to-emerald-500/30 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 relative z-10">
              {steps.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 30 }}
                    animate={stepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: idx * 0.15 }}
                    className="flex flex-col items-center text-center group"
                  >
                    {/* Numbered Circle with Connecting Ring */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#02020a] border-2 border-white/20 flex items-center justify-center font-extrabold text-xl text-white shadow-xl shadow-purple-900/30 group-hover:scale-110 group-hover:border-white/50 transition-all duration-300 relative z-10">
                        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${item.color}`}>
                          {item.step}
                        </span>
                      </div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-amber-500/20 blur-md -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Step Card */}
                    <div className={`w-full p-8 rounded-3xl bg-white/[0.03] border border-white/10 ${item.borderGlow} hover:bg-white/[0.05] transition-all duration-300 backdrop-blur-xl flex flex-col items-center flex-1 shadow-lg`}>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 border ${item.pillBg}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.subtitle}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. TESTIMONIALS SECTION (Initials-based colored avatars)   */}
      {/* ======================================================== */}
      <section ref={testimonialsRef} className="py-24 border-t border-white/5 bg-white/[0.015] backdrop-blur-xl relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-3">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">Community Feedback</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Loved by Focused High-Achievers
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
              Here is what developers, medical scholars, and creators say about reclaiming their time with Focus Path.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300 backdrop-blur-xl shadow-xl flex flex-col justify-between group"
              >
                <div>
                  {/* Top: 5 Stars & Quote Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-white/10 group-hover:text-purple-400/30 transition-colors" />
                  </div>

                  {/* Quote Body */}
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Bottom: Avatar + Name + Role */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Initials-based colored avatar */}
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${item.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0 border border-white/20`}>
                      {item.initials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-400">{item.role}</div>
                    </div>
                  </div>

                  <span className="hidden sm:inline-block text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                    {item.metric}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. FULL-WIDTH GRADIENT CTA SECTION                       */}
      {/* ======================================================== */}
      <section ref={ctaRef} className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={ctaInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-b from-purple-900/30 via-indigo-950/20 to-[#02020a] p-10 sm:p-16 lg:p-20 text-center shadow-[0_0_100px_-20px_rgba(147,51,234,0.3)] backdrop-blur-2xl"
          >
            {/* Ambient CTA glow rings */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-medium text-gray-300">Unlock Your Maximum Potential</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400 tracking-tight leading-tight mb-6">
                Ready to take control of your time?
              </h2>

              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of professionals, students, and creators building disciplined, rewarding daily habits with Focus Path.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <Link
                  href="/login"
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-[0_0_50px_-10px_rgba(147,51,234,0.6)] hover:shadow-[0_0_70px_-5px_rgba(147,51,234,0.8)] w-full sm:w-auto"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative">Start Your Journey Today</span>
                  <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-medium text-gray-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Free to use. No credit card required.
                </span>
                <span className="hidden sm:inline text-gray-600">•</span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-purple-400" />
                  Instant 30-second setup
                </span>
                <span className="hidden sm:inline text-gray-600">•</span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-400" />
                  Private local storage
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/**
 * EnhancedFeatureCard Component
 * 
 * Elevates the existing 3 feature cards with interactive hover effects,
 * tags, bullet points, and staggered viewport entrance animations.
 */
function EnhancedFeatureCard({
  icon,
  tag,
  title,
  description,
  bullets,
  delay,
  inView,
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  bullets: string[];
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300 group shadow-lg flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-transform">
            {icon}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 group-hover:text-purple-300 transition-colors">
            {tag}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 leading-relaxed mb-6 text-sm sm:text-base">
          {description}
        </p>
      </div>

      <div className="pt-5 border-t border-white/5 space-y-2.5">
        {bullets.map((bullet, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{bullet}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
