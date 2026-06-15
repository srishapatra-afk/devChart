import Navbar from "@/components/Navbar";
import Link from "next/link";
import connectDB from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Gracefully connect to DB, log status, but don't fail rendering if DB is not configured yet
  let dbConnected = false;
  try {
    await connectDB();
    dbConnected = true;
  } catch (error) {
    console.warn("Database connection could not be established during landing page render:", error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col items-center justify-center relative">
        {/* Glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-cyan-600/5 blur-3xl pointer-events-none"></div>

        <div className="text-center max-w-3xl z-10 animate-slide-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 mb-6 glow-teal">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Next-Gen Club Collaboration
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-none">
            Streamline Your Club Projects with{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-500 bg-clip-text text-transparent">
              devChart
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            An all-in-one workspace for student clubs. Organize tasks on a Kanban board, publish real-time team announcements, and coordinate members in a visual directory.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold rounded-2xl text-center shadow-lg shadow-cyan-500/20 hover:scale-[1.03] transition-all duration-300"
            >
              Launch Dashboard
            </Link>
            <Link
              href="/announcements"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold rounded-2xl text-center backdrop-blur-sm hover:scale-[1.03] transition-all duration-300"
            >
              Read Announcements
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <section className="w-full mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
          {/* Card 1: Kanban Board */}
          <div className="glass-card rounded-3xl p-8 flex flex-col items-start text-left group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Interactive Kanban Board</h3>
            <p className="text-slate-400 leading-relaxed">
              Track project progress visually. Drag tasks between columns, set priority ranks, assign member leads, and tag domains dynamically.
            </p>
          </div>

          {/* Card 2: Team Bulletin */}
          <div className="glass-card rounded-3xl p-8 flex flex-col items-start text-left group">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Real-time Bulletin Board</h3>
            <p className="text-slate-400 leading-relaxed">
              Keep members aligned. Publish urgent bulletins, upcoming workshops, and event alerts. Interact with team updates using emoji reactions.
            </p>
          </div>

          {/* Card 3: Member Directory */}
          <div className="glass-card rounded-3xl p-8 flex flex-col items-start text-left group">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Member Directory</h3>
            <p className="text-slate-400 leading-relaxed">
              Map out sub-teams and responsibilities. Search club leads, review member profiles, and examine active tasks assigned to specific individuals.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-slate-950/40 border-t border-slate-950/60 mt-16 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} devChart. Built for Student Club Success.</p>
          <div className="flex gap-4">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${dbConnected ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${dbConnected ? "bg-emerald-500" : "bg-yellow-500"}`}></span>
              {dbConnected ? "System Online" : "Sandbox Offline"}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}