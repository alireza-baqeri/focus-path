import Link from "next/link";
import { Mail, Heart } from "lucide-react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function TwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#02020a] relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Newsletter Section */}
        <div className="py-12 border-b border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                <Mail className="w-5 h-5 text-blue-400" />
                Stay in the loop
              </h3>
              <p className="text-gray-400 text-sm mt-1">Get productivity tips and product updates delivered to your inbox.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-64 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-sm transition-colors"
              />
              <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-500/25 shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 py-16">
          {/* Column 1: Brand */}
          <div className="col-span-1 flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Focus Path Logo" className="w-10 h-10 rounded-full shadow-lg shadow-purple-500/20" />
              <span className="font-bold text-2xl tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                Focus Path
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mt-2">
              The ultimate productivity platform. Plan your day, build habits, and visualize long-term progress.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              <a href="https://github.com/alireza-baqeri" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <GithubIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold mb-1 text-sm uppercase tracking-wider">Product</h3>
            <Link href="/" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Features</Link>
            <Link href="/analytics" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Deep Analytics</Link>
            <Link href="/timetable" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Smart Timetable</Link>
            <Link href="/courses" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Course Tracker</Link>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold mb-1 text-sm uppercase tracking-wider">Resources</h3>
            <Link href="/guide" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">User Guide</Link>
            <Link href="/about" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">About Us</Link>
            <Link href="/guide#pomodoro" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Pomodoro Technique</Link>
            <a href="https://github.com/alireza-baqeri" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Developer Blog</a>
          </div>

          {/* Column 4: Legal & Status */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold mb-1 text-sm uppercase tracking-wider">Legal</h3>
            <span className="text-sm text-gray-400 cursor-not-allowed hover:text-white/60 transition-colors">Privacy Policy</span>
            <span className="text-sm text-gray-400 cursor-not-allowed hover:text-white/60 transition-colors">Terms of Service</span>
            <span className="text-sm text-gray-400 cursor-not-allowed hover:text-white/60 transition-colors">Cookie Policy</span>
            
            {/* System Status */}
            <div className="mt-4 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400">All systems operational</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <p className="text-gray-500 text-sm">
              © {currentYear} Focus Path. All rights reserved.
            </p>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500">v1.0.0</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>by</span>
            <a 
              href="https://github.com/alireza-baqeri" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors font-medium"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              alireza-baqeri
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
