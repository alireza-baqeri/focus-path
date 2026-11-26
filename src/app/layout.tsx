import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "sonner";
import { KeyboardShortcutsModal } from "@/components/ui/keyboard-shortcuts";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#02020a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3008"),
  title: {
    default: "Focus Path — Your Ultimate Productivity Hub",
    template: "%s | Focus Path",
  },
  description: "Plan your day, build lasting habits, and visualize long-term progress. Focus Path combines time-tracking, Pomodoro sessions, course management, and deep analytics.",
  keywords: ["productivity", "time tracking", "pomodoro", "habit tracker", "course tracker", "analytics", "focus", "time management"],
  manifest: "/manifest.json",
  authors: [{ name: "Focus Path Team" }],
  creator: "Focus Path",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Focus Path",
    title: "Focus Path — Your Ultimate Productivity Hub",
    description: "Plan your day, build lasting habits, and visualize long-term progress with deep analytics.",
    images: [{ url: "/landing.png", width: 1200, height: 630, alt: "Focus Path Dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Focus Path — Your Ultimate Productivity Hub",
    description: "Plan your day, build lasting habits, and visualize long-term progress.",
    images: ["/landing.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "darkreader-lock": "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <meta name="darkreader-lock" />
      </head>
      <body suppressHydrationWarning className={`font-sans antialiased bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 flex flex-col min-h-screen overflow-x-hidden w-full max-w-[100vw]`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <KeyboardShortcutsModal />
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              toastOptions={{
                className: "font-sans",
                duration: 4000,
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
