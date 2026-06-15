"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type Member = {
  _id: string;
  name: string;
  role: string;
  department: string;
};

export default function CreateTask() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [tag, setTag] = useState("General");
  const [assignedTo, setAssignedTo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch("/api/members");
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        }
      } catch (error) {
        console.error("Error loading members:", error);
      } finally {
        setLoadingMembers(false);
      }
    }
    fetchMembers();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      setSubmitting(true);
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          tag,
          assignedTo,
          status: "todo",
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to create task.");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col pb-12">
      <Navbar />

      <main className="max-w-2xl w-full mx-auto px-6 mt-12 flex-grow flex flex-col justify-center animate-slide-up">
        <div className="glass-panel p-8 rounded-3xl border border-slate-900 shadow-xl">
          <div className="mb-6.5">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              Create New Task
            </h2>
            <p className="text-slate-400 text-sm">
              Define a new objective, set its priority, assign it to a team member, and track it on the Kanban board.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-2">
                What is the task name?
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Design Marketing Flyer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4.5 py-3.5 bg-slate-950/60 border border-slate-900 rounded-2xl text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-2">
                Describe the details
              </label>
              <textarea
                required
                rows={4}
                placeholder="Provide task specifics, links, goals, and prerequisites..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4.5 py-3.5 bg-slate-950/60 border border-slate-900 rounded-2xl text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              />
            </div>

            {/* Priority & Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-2">
                  Task Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4.5 py-3.5 bg-slate-950/60 border border-slate-900 rounded-2xl text-sm text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-2">
                  Department Domain
                </label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-4.5 py-3.5 bg-slate-950/60 border border-slate-900 rounded-2xl text-sm text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="General">General</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Logistics">Logistics</option>
                </select>
              </div>
            </div>

            {/* Assigned Member */}
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-2">
                Assign Lead Member
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                disabled={loadingMembers}
                className="w-full px-4.5 py-3.5 bg-slate-950/60 border border-slate-900 rounded-2xl text-sm text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer disabled:opacity-50"
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member._id} value={member.name}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
              {loadingMembers && (
                <span className="text-[10px] text-slate-500 mt-1 block">Loading members directory...</span>
              )}
            </div>

            {/* Submit buttons */}
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-2xl font-bold text-sm transition-colors"
              >
                Back to Board
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/15 transition-all duration-300 disabled:opacity-50"
              >
                {submitting ? "Committing..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}