"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

type Member = {
  _id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  avatarColor: string;
  createdAt?: string;
};

type Task = {
  _id: string;
  title: string;
  status: string;
  priority: string;
  assignedTo?: string;
};

export default function Directory() {
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Development");

  // Selection Detail Drawer
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [membersRes, tasksRes] = await Promise.all([
          fetch("/api/members"),
          fetch("/api/tasks"),
        ]);
        const membersData = await membersRes.json();
        const tasksData = await tasksRes.json();

        setMembers(Array.isArray(membersData) ? membersData : []);
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      } catch (error) {
        console.error("Error loading directory data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, email, department }),
      });

      if (response.ok) {
        const newMember = await response.json();
        setMembers((prev) => [...prev, newMember].sort((a, b) => a.name.localeCompare(b.name)));
        setName("");
        setRole("");
        setEmail("");
        setDepartment("Development");
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Error creating member:", error);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the directory?`)) return;

    try {
      const response = await fetch(`/api/members/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMembers((prev) => prev.filter((m) => m._id !== id));
        if (selectedMember?._id === id) {
          setSelectedMember(null);
        }
      }
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  // Helper for Member Initials
  const getInitials = (n: string) => {
    return n
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Filter members list
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "all" || member.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  // Get tasks assigned to selected member
  const memberTasks = selectedMember
    ? tasks.filter((t) => t.assignedTo === selectedMember.name)
    : [];

  return (
    <div className="min-h-screen flex flex-col pb-12">
      <Navbar />

      {/* Directory Banner */}
      <div className="max-w-7xl w-full mx-auto px-6 mt-8">
        <div className="glass-panel p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              Club Member Directory
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              Meet and connect with your team members. Review departments, roles, and current task lists.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-violet-500/10 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Onboard Member
          </button>
        </div>
      </div>

      {/* Main content split panel */}
      <div className="max-w-7xl w-full mx-auto px-6 mt-8 flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Onboarding Form Modal / Panel */}
        {showAddForm && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-900 col-span-1 lg:col-span-3 animate-slide-up">
            <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-slate-900/60">
              <h3 className="text-lg font-extrabold text-white">Onboard a New Member</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chinmay Babu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-white focus:outline-none focus:border-violet-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Club Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Lead"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-white focus:outline-none focus:border-violet-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. chinmay@club.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-white focus:outline-none focus:border-violet-600"
                />
              </div>
              <div className="flex gap-3 items-end">
                <div className="flex-grow">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-violet-600 cursor-pointer"
                  >
                    <option value="Management">Management</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors whitespace-nowrap h-[34px]"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Directory Search & Grid List (Spans 2 columns if drawer open, 3 if closed) */}
        <div className={`col-span-1 lg:col-span-${selectedMember ? "2" : "3"} flex flex-col gap-6`}>
          
          {/* Controls */}
          <div className="glass-panel p-4.5 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search member name or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-white focus:outline-none focus:border-violet-600"
              />
            </div>
            
            <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-900 rounded-xl px-3 py-1.5 self-stretch sm:self-auto justify-between sm:justify-start">
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Dept:</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-950">All Departments</option>
                <option value="Management" className="bg-slate-950">Management</option>
                <option value="Development" className="bg-slate-950">Development</option>
                <option value="Design" className="bg-slate-950">Design</option>
                <option value="Marketing" className="bg-slate-950">Marketing</option>
                <option value="Operations" className="bg-slate-950">Operations</option>
              </select>
            </div>
          </div>

          {/* Grid List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-slate-900 border-t-violet-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="glass-panel p-16 rounded-3xl border border-slate-900 text-center">
              <span className="block text-slate-600 font-medium mb-1">No profiles found</span>
              <span className="text-slate-500 text-xs">Try adjusting your search query or onboard a new member</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <div
                  key={member._id}
                  onClick={() => setSelectedMember(member)}
                  className={`glass-card p-5 rounded-2xl cursor-pointer text-left relative group ${
                    selectedMember?._id === member._id
                      ? "border-violet-500/40 shadow-lg shadow-violet-500/5 bg-slate-900/60"
                      : "hover:border-slate-800"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Member Avatar */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-slate-950 text-sm shadow-inner shrink-0"
                      style={{ backgroundColor: member.avatarColor }}
                    >
                      {getInitials(member.name)}
                    </div>
                    {/* Member Details */}
                    <div className="overflow-hidden pr-6">
                      <h4 className="font-extrabold text-white text-sm truncate leading-snug group-hover:text-violet-400 transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-slate-400 text-xs font-semibold truncate mt-0.5">{member.role}</p>
                      
                      <span className="inline-block mt-2 px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-900 text-[9px] font-bold text-slate-500">
                        {member.department}
                      </span>
                    </div>
                  </div>

                  {/* Absolute Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMember(member._id, member.name);
                    }}
                    className="absolute top-4 right-4 p-1 hover:bg-rose-500/10 text-slate-600 hover:text-rose-400 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Remove Profile"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Member Detail Drawer / Side Panel */}
        {selectedMember && (
          <div className="glass-panel p-6 rounded-3xl border border-violet-500/15 col-span-1 flex flex-col gap-6 animate-slide-up sticky top-24">
            
            {/* Drawer Header */}
            <div className="flex justify-between items-start border-b border-slate-900/60 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-slate-950 text-base shrink-0"
                  style={{ backgroundColor: selectedMember.avatarColor }}
                >
                  {getInitials(selectedMember.name)}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base leading-none mb-1">
                    {selectedMember.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-semibold">{selectedMember.role}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Fields */}
            <div className="flex flex-col gap-3.5 text-xs">
              <div className="flex justify-between border-b border-slate-950/60 pb-2">
                <span className="text-slate-500 font-bold">DEPARTMENT</span>
                <span className="text-slate-300 font-extrabold">{selectedMember.department}</span>
              </div>
              <div className="flex justify-between border-b border-slate-950/60 pb-2">
                <span className="text-slate-500 font-bold">EMAIL</span>
                <span className="text-slate-300 font-medium truncate max-w-[180px]" title={selectedMember.email || "No email"}>
                  {selectedMember.email || "N/A"}
                </span>
              </div>
            </div>

            {/* Assigned Tasks lists */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Active Deliverables ({memberTasks.length})
              </h4>
              <div className="flex flex-col gap-2.5 max-h-[250px] overflow-y-auto pr-1">
                {memberTasks.length === 0 ? (
                  <div className="p-5 border border-dashed border-slate-900 rounded-2xl text-center text-slate-600 text-xs">
                    No active tasks assigned.
                  </div>
                ) : (
                  memberTasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-3 bg-slate-900/40 border border-slate-950 rounded-xl flex flex-col gap-1.5"
                    >
                      <span className="font-extrabold text-white text-[11px] leading-tight line-clamp-1">{task.title}</span>
                      <div className="flex justify-between items-center text-[9px] font-bold">
                        {/* Status tag */}
                        <span
                          className={`px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            task.status === "done"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : task.status === "in_progress"
                              ? "bg-violet-500/10 text-violet-400"
                              : "bg-cyan-500/10 text-cyan-400"
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                        
                        {/* Priority tag */}
                        <span className="text-slate-500 uppercase">{task.priority}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
