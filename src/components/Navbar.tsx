"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isLinkActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/75 backdrop-blur-md border-b border-slate-900 px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:text-cyan-400 transition-colors duration-300">
              devChart
            </span>
            <span className="ml-1.5 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md">
              ClubHub
            </span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-4">
          <Link
            href="/dashboard"
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              isLinkActive("/dashboard")
                ? "bg-slate-900 text-cyan-400 border border-slate-800 glow-teal"
                : "text-slate-400 hover:text-white hover:bg-slate-900/50"
            }`}
          >
            Board
          </Link>

          <Link
            href="/announcements"
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              isLinkActive("/announcements")
                ? "bg-slate-900 text-violet-400 border border-slate-800 glow-violet"
                : "text-slate-400 hover:text-white hover:bg-slate-900/50"
            }`}
          >
            Bulletin
          </Link>

          <Link
            href="/directory"
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              isLinkActive("/directory")
                ? "bg-slate-900 text-rose-400 border border-slate-800 glow-rose"
                : "text-slate-400 hover:text-white hover:bg-slate-900/50"
            }`}
          >
            Directory
          </Link>

          <span className="h-5 w-[1px] bg-slate-800 mx-1 hidden sm:block"></span>

          <Link
            href="/create-task"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/15 hover:shadow-indigo-600/25 transition-all duration-300 hover:scale-[1.02]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </Link>
        </div>
      </div>
    </nav>
  );
}