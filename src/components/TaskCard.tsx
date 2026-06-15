"use client";

import React from "react";

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  tag: string;
  assignedTo?: string;
};

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
};

export default function TaskCard({ task, onEdit, onDelete, onDragStart }: TaskCardProps) {
  // Get priority-specific styling
  const getPriorityConfig = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return {
          glow: "hover:shadow-rose-500/10 border-rose-950/40 hover:border-rose-500/30",
          badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          dot: "bg-rose-400",
        };
      case "medium":
        return {
          glow: "hover:shadow-amber-500/10 border-amber-950/40 hover:border-amber-500/30",
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          dot: "bg-amber-400",
        };
      case "low":
      default:
        return {
          glow: "hover:shadow-cyan-500/10 border-cyan-950/40 hover:border-cyan-500/30",
          badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
          dot: "bg-cyan-400",
        };
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "development":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "design":
        return "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20";
      case "marketing":
        return "bg-violet-500/10 text-violet-400 border-violet-500/20";
      case "logistics":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const styleConfig = getPriorityConfig(task.priority);

  // Generate initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      className={`glass-card p-5 rounded-2xl flex flex-col gap-4 cursor-grab active:cursor-grabbing select-none group w-full ${styleConfig.glow}`}
    >
      {/* Card Header: Priority & Action buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {/* Priority Badge */}
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${styleConfig.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${styleConfig.dot}`}></span>
            {task.priority.toUpperCase()}
          </span>

          {/* Department / Category Tag */}
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getTagColor(task.tag)}`}>
            {task.tag}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Edit Task"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete Task"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Content: Title & Description */}
      <div>
        <h4 className="font-bold text-white text-base leading-snug group-hover:text-cyan-400 transition-colors duration-200 mb-1.5">
          {task.title}
        </h4>
        <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
          {task.description}
        </p>
      </div>

      {/* Card Footer: Assignee & Date */}
      <div className="flex justify-between items-center border-t border-slate-900/60 pt-3.5 mt-1">
        <div className="flex items-center gap-2">
          {/* Initials Avatar */}
          <div
            className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-900`}
            style={{ backgroundColor: task.assignedTo ? "#06B6D4" : "#475569" }}
            title={task.assignedTo ? `Assigned to ${task.assignedTo}` : "Unassigned"}
          >
            {getInitials(task.assignedTo)}
          </div>
          <span className="text-[11px] text-slate-400 font-medium truncate max-w-[120px]">
            {task.assignedTo || "Unassigned"}
          </span>
        </div>

        <span className="text-[10px] text-slate-500">
          Task card
        </span>
      </div>
    </div>
  );
}
