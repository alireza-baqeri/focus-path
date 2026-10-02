import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Focus Path",
  description: "Productivity and Time Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
