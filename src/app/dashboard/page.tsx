"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  tag: string;
  assignedTo?: string;
  createdAt?: string;
};

type Member = {
  _id: string;
  name: string;
  role: string;
  department: string;
};

const COLUMNS = [
  { id: "todo", title: "To Do", border: "border-cyan-500/20", glow: "shadow-cyan-500/5", text: "text-cyan-400", dot: "bg-cyan-400" },
  { id: "in_progress", title: "In Progress", border: "border-violet-500/20", glow: "shadow-violet-500/5", text: "text-violet-400", dot: "bg-violet-400" },
  { id: "done", title: "Done", border: "border-emerald-500/20", glow: "shadow-emerald-500/5", text: "text-emerald-400", dot: "bg-emerald-400" },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");

  // Drag and Drop Visual Feedback States
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Form Field States
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPriority, setFormPriority] = useState("low");
  const [formTag, setFormTag] = useState("General");
  const [formAssignedTo, setFormAssignedTo] = useState("");
  const [formStatus, setFormStatus] = useState("todo");

  useEffect(() => {
    async function loadData() {
      try {
        const [tasksRes, membersRes] = await Promise.all([
          fetch("/api/tasks"),
          fetch("/api/members"),
        ]);
        const tasksData = await tasksRes.json();
        const membersData = await membersRes.json();

        setTasks(Array.isArray(tasksData) ? tasksData : []);
        setMembers(Array.isArray(membersData) ? membersData : []);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggedTaskId(id);
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    if (!taskId) return;

    // Optimistically update the status locally
    const originalTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: targetStatus } : t))
    );

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status on server");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      setTasks(originalTasks); // rollback
    } finally {
      setDraggedTaskId(null);
    }
  };

  // Open edit modal
  const openEditModal = (task: Task) => {
    setActiveTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormPriority(task.priority);
    setFormTag(task.tag);
    setFormAssignedTo(task.assignedTo || "");
    setFormStatus(task.status);
    setShowEditModal(true);
  };

  // Submit Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          priority: formPriority,
          tag: formTag,
          assignedTo: formAssignedTo,
          status: "todo",
        }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks((prev) => [...prev, newTask]);
        resetForm();
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Submit Update Task
  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask || !formTitle.trim() || !formDescription.trim()) return;

    try {
      const response = await fetch(`/api/tasks/${activeTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          priority: formPriority,
          tag: formTag,
          assignedTo: formAssignedTo,
          status: formStatus,
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prev) =>
          prev.map((t) => (t._id === activeTask._id ? updatedTask : t))
        );
        setShowEditModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete Task
  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        if (showEditModal) setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormPriority("low");
    setFormTag("General");
    setFormAssignedTo("");
    setFormStatus("todo");
    setActiveTask(null);
  };

  // Stats Calculations
  const totalCount = tasks.length;
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const completionRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // Filter Tasks for Board Display
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesTag = tagFilter === "all" || task.tag === tagFilter;
    return matchesSearch && matchesPriority && matchesTag;
  });

  return (
    <div className="min-h-screen flex flex-col pb-12">
      <Navbar />

      {/* Top Banner & Analytics Summary */}
      <div className="max-w-7xl w-full mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Welcome and Summary Widget */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between col-span-1 lg:col-span-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                Project Workspace
              </h2>
              <p className="text-slate-400 text-sm max-w-xl">
                Collaborate on student club initiatives. Assign task owners, categorize deliverables, and track workflows in real time.
              </p>
            </div>
            
            {/* Visual Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
                <span>TASK COMPLETION RATE</span>
                <span className="text-cyan-400">{completionRate}%</span>
              </div>
              <div className="w-full bg-slate-950/60 rounded-full h-3 overflow-hidden border border-slate-900">
                <div
                  className="bg-gradient-to-r from-violet-600 to-cyan-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Counts Widget */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between gap-4">
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Workflow Diagnostics
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-900/40 border border-slate-900 p-3.5 rounded-2xl">
                <span className="block text-2xl font-bold text-cyan-400">{todoCount}</span>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">To Do</span>
              </div>
              <div className="bg-slate-900/40 border border-slate-900 p-3.5 rounded-2xl">
                <span className="block text-2xl font-bold text-violet-400">{inProgressCount}</span>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Active</span>
              </div>
              <div className="bg-slate-900/40 border border-slate-900 p-3.5 rounded-2xl">
                <span className="block text-2xl font-bold text-emerald-400">{doneCount}</span>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Done</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-900/60 pt-3">
              <span>Total Work items:</span>
              <span className="font-bold text-white">{totalCount} tasks</span>
            </div>
          </div>

        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="max-w-7xl w-full mx-auto px-6 mt-8">
        <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          
          {/* Search bar */}
          <div className="relative flex-grow max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search task title or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-900 rounded-xl text-sm text-white focus:outline-none focus:border-violet-600 transition-colors"
            />
          </div>

          {/* Filters dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Priority Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-900 rounded-xl px-3 py-1.5">
              <span className="text-xs text-slate-500 font-medium">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-950">All</option>
                <option value="low" className="bg-slate-950">Low</option>
                <option value="medium" className="bg-slate-950">Medium</option>
                <option value="high" className="bg-slate-950">High</option>
              </select>
            </div>

            {/* Tag Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-900 rounded-xl px-3 py-1.5">
              <span className="text-xs text-slate-500 font-medium">Domain:</span>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-950">All</option>
                <option value="Development" className="bg-slate-950">Development</option>
                <option value="Design" className="bg-slate-950">Design</option>
                <option value="Marketing" className="bg-slate-950">Marketing</option>
                <option value="Logistics" className="bg-slate-950">Logistics</option>
                <option value="General" className="bg-slate-950">General</option>
              </select>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition-all duration-300 shadow-md shadow-cyan-500/10 flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          </div>

        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="max-w-7xl w-full mx-auto px-6 mt-8 flex-grow flex flex-col">
        {loading ? (
          <div className="flex-grow flex items-center justify-center py-24">
            <div className="relative w-12 h-12">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-900 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow items-start">
            {COLUMNS.map((column) => {
              const columnTasks = filteredTasks.filter((task) => task.status === column.id);
              const isOver = dragOverColumn === column.id;

              return (
                <div
                  key={column.id}
                  onDragOver={(e) => handleDragOver(e, column.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.id)}
                  className={`flex flex-col h-full min-h-[500px] max-h-[800px] glass-panel rounded-3xl p-5 border transition-all duration-300 ${
                    isOver
                      ? "border-cyan-400/40 bg-slate-900/60 scale-[1.005]"
                      : `${column.border} bg-slate-950/20`
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex justify-between items-center mb-4.5 pb-3.5 border-b border-slate-900/60">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${column.dot}`}></span>
                      <h3 className="font-extrabold text-white text-base tracking-wide uppercase">
                        {column.title}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-400">
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Tasks List */}
                  <div className="flex flex-col gap-4 overflow-y-auto flex-grow pb-4 pr-1">
                    {columnTasks.length === 0 ? (
                      <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-900 rounded-2xl">
                        <span className="text-slate-600 text-xs mb-1 font-medium">Empty Lane</span>
                        <span className="text-slate-500 text-[10px]">No tasks are here</span>
                      </div>
                    ) : (
                      columnTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onEdit={openEditModal}
                          onDelete={handleDeleteTask}
                          onDragStart={handleDragStart}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel max-w-lg w-full rounded-3xl p-6.5 border border-slate-800/80 shadow-2xl relative">
            
            {/* Close button */}
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-extrabold text-white mb-5">Draft New Task</h3>

            <form onSubmit={handleCreateTask} className="flex flex-col gap-4.5">
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="What is the objective?"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-900 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-1.5">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain the work items..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-900 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-900 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-1.5">
                    Domain / Tag
                  </label>
                  <select
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-900 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="General">General</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-1.5">
                  Assign Lead
                </label>
                <select
                  value={formAssignedTo}
                  onChange={(e) => setFormAssignedTo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-900 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => (
                    <option key={member._id} value={member.name}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold text-sm shadow-lg shadow-cyan-500/15 transition-all"
                >
                  Commit Task
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Task Edit Modal */}
      {showEditModal && activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel max-w-lg w-full rounded-3xl p-6.5 border border-slate-800/80 shadow-2xl relative">
            
            {/* Close button */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-extrabold text-white mb-5">Edit Task Details</h3>

            <form onSubmit={handleUpdateTask} className="flex flex-col gap-4.5">
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Task title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-900 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-1.5">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain the work items..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-900 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-1.5">
                    Stage
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-900 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-900 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-1.5">
                    Domain
                  </label>
                  <select
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-900 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="General">General</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-1.5">
                  Assign Lead
                </label>
                <select
                  value={formAssignedTo}
                  onChange={(e) => setFormAssignedTo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-900 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => (
                    <option key={member._id} value={member.name}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => handleDeleteTask(activeTask._id)}
                  className="px-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-950/40 text-rose-400 rounded-xl font-bold text-sm transition-colors"
                  title="Delete Task"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-grow py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-grow py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold text-sm shadow-lg shadow-cyan-500/15 transition-all"
                >
                  Update Task
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}