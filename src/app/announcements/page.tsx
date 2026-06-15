"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

type Announcement = {
  _id: string;
  title: string;
  content: string;
  category: "Urgent" | "Event" | "General";
  author: string;
  reactions: {
    [key: string]: number;
  };
  createdAt: string;
};

type Member = {
  _id: string;
  name: string;
  role: string;
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Form
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"Urgent" | "Event" | "General">("General");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [annRes, memRes] = await Promise.all([
          fetch("/api/announcements"),
          fetch("/api/members"),
        ]);
        const annData = await annRes.json();
        const memData = await memRes.json();

        setAnnouncements(Array.isArray(annData) ? annData : []);
        setMembers(Array.isArray(memData) ? memData : []);
      } catch (error) {
        console.error("Error loading announcements data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author) return;

    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category, author }),
      });

      if (response.ok) {
        const newAnn = await response.json();
        setAnnouncements((prev) => [newAnn, ...prev]);
        setTitle("");
        setContent("");
        setCategory("General");
        setAuthor("");
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  const handleReact = async (id: string, emoji: string) => {
    // Optimistically update counts locally
    const originalAnnouncements = [...announcements];
    setAnnouncements((prev) =>
      prev.map((ann) => {
        if (ann._id === id) {
          const currentCount = ann.reactions[emoji] || 0;
          return {
            ...ann,
            reactions: {
              ...ann.reactions,
              [emoji]: currentCount + 1,
            },
          };
        }
        return ann;
      })
    );

    try {
      const response = await fetch(`/api/announcements/${id}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });

      if (!response.ok) {
        throw new Error("Failed to post reaction");
      }
    } catch (error) {
      console.error("Error posting reaction:", error);
      setAnnouncements(originalAnnouncements); // rollback
    }
  };

  // Filter list
  const filteredAnnouncements = announcements.filter((ann) => {
    return categoryFilter === "all" || ann.category === categoryFilter;
  });

  return (
    <div className="min-h-screen flex flex-col pb-12">
      <Navbar />

      {/* Announcements Banner */}
      <div className="max-w-7xl w-full mx-auto px-6 mt-8">
        <div className="glass-panel p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              Club Bulletin Board
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              Publish sub-team announcements, event reminders, or urgent notices. React to posts to stay engaged!
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-violet-500/10 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Write Announcement
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-4xl w-full mx-auto px-6 mt-8 flex-grow flex flex-col gap-6">
        
        {/* Post Announcement Form */}
        {showAddForm && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-900 animate-slide-up">
            <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-slate-900/60">
              <h3 className="text-lg font-extrabold text-white">Post Team Update</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handlePostAnnouncement} className="flex flex-col gap-4.5">
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-1.5">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandatory Stand-up meeting"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-white focus:outline-none focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-1.5">Announcement Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write the announcement message details here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-white focus:outline-none focus:border-violet-600 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as "Urgent" | "Event" | "General")}
                    className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-violet-600 cursor-pointer"
                  >
                    <option value="General">General Announcement</option>
                    <option value="Event">Event Alert</option>
                    <option value="Urgent">Urgent Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-1.5">Author</label>
                  <select
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-violet-600 cursor-pointer"
                  >
                    <option value="">Select Author...</option>
                    {members.map((member) => (
                      <option key={member._id} value={member.name}>
                        {member.name} ({member.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Bar */}
        <div className="glass-panel p-3.5 rounded-2xl flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex gap-2">
            {["all", "General", "Event", "Urgent"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  categoryFilter === cat
                    ? "bg-slate-900 border-slate-800 text-violet-400 glow-violet"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                {cat === "all" ? "All Updates" : cat}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase hidden sm:inline pr-2">
            {filteredAnnouncements.length} Bulletins
          </span>
        </div>

        {/* Announcements List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-slate-900 border-t-violet-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="glass-panel p-16 rounded-3xl border border-slate-900 text-center">
            <span className="block text-slate-600 font-medium mb-1">Bulletin is empty</span>
            <span className="text-slate-500 text-xs">Publish the first announcement to notify the club!</span>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredAnnouncements.map((ann) => {
              const isUrgent = ann.category === "Urgent";
              const formattedDate = ann.createdAt
                ? new Date(ann.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Just now";

              return (
                <article
                  key={ann._id}
                  className={`glass-panel p-6.5 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col gap-4 ${
                    isUrgent
                      ? "border-rose-500/40 bg-slate-950/60 shadow-lg shadow-rose-500/5 glow-rose animate-pulse-glow"
                      : "border-slate-900/60 hover:border-slate-800"
                  }`}
                >
                  {/* Category Flag */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-wider ${
                          isUrgent
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : ann.category === "Event"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                        }`}
                      >
                        {ann.category}
                      </span>
                      {isUrgent && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">{formattedDate}</span>
                  </div>

                  {/* Title & Body */}
                  <div>
                    <h3 className="font-extrabold text-white text-lg group-hover:text-violet-400 transition-colors mb-2.5">
                      {ann.title}
                    </h3>
                    <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                      {ann.content}
                    </p>
                  </div>

                  {/* Author, Date & Reactions */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center border-t border-slate-900/60 pt-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-violet-400">
                        {ann.author.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs text-slate-400 font-semibold">
                        {ann.author} <span className="text-[10px] font-medium text-slate-600 ml-1">leads updates</span>
                      </span>
                    </div>

                    {/* Reactions emoji list */}
                    <div className="flex items-center gap-2">
                      {["👍", "❤️", "🎉", "🚀"].map((emoji) => {
                        const count = ann.reactions[emoji] || 0;
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleReact(ann._id, emoji)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/70 border border-slate-900 rounded-xl hover:border-slate-800 text-xs font-semibold hover:scale-105 active:scale-95 transition-all text-slate-400 hover:text-white"
                          >
                            <span>{emoji}</span>
                            <span className="text-[10px] text-slate-500 font-bold">{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
