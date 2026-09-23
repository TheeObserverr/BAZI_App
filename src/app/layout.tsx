import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ba Zi Calculator",
  description: "Calculate your Four Pillars birth chart and 10-year luck cycles.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fbf7f0] text-[#241c15]">
        <header className="border-b border-[#e3d5c0] bg-[#fbf7f0]/95 backdrop-blur sticky top-0 z-10">
          <nav className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="font-semibold tracking-tight text-lg text-[#7a2e2e]">
              命 Ba Zi Calculator
            </Link>
            <div className="flex gap-6 text-sm">
              <Link href="/" className="hover:text-[#7a2e2e] transition-colors">
                Calculator
              </Link>
              <Link href="/day-masters" className="hover:text-[#7a2e2e] transition-colors">
                Day Masters
              </Link>
              <Link href="/enneagram" className="hover:text-[#7a2e2e] transition-colors">
                Enneagram
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#e3d5c0] mt-16">
          <div className="max-w-4xl mx-auto px-6 py-6 text-xs text-[#7a6f61] leading-relaxed">
            Nothing you enter here is stored, logged, or shared — all calculations happen in your
            browser, and only the derived chart data (not your name or contact details) is sent to
            generate the AI reading. For your own privacy, consider entering an approximate rather
            than exact birth time. This tool is for reflection and entertainment; it is not
            professional advice.
          </div>
        </footer>
      </body>
    </html>
  );
}
