"use client";

import { useState } from "react";
import {
  Sun,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Inbox,
  Filter,
  Sparkles,
} from "lucide-react";
import { Todo } from "@/types";
import { TodoCard } from "./todo-card";


interface PlannerBoardProps {
  todos: Todo[];
  activeSection: string;
  onChangeSection: (section: string) => void;
  onToggleComplete: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onSelectTodo: (todo: Todo) => void;
  onDropTaskToSection?: (task: Todo, targetSection: string) => void;
}

export function PlannerBoard({
  todos,
  activeSection,
  onChangeSection,
  onToggleComplete,
  onEdit,
  onDelete,
  onSelectTodo,
  onDropTaskToSection,
}: PlannerBoardProps) {
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);

  const sections = [
    { id: "today", label: "Today", icon: Sun, color: "#6366f1" },
    { id: "upcoming", label: "Upcoming", icon: Clock, color: "#06b6d4" },
    { id: "overdue", label: "Overdue", icon: AlertTriangle, color: "#ef4444" },
    { id: "completed_today", label: "Completed Today", icon: CheckCircle2, color: "#10b981" },
    { id: "no_due_date", label: "No Due Date", icon: Inbox, color: "#8b5cf6" },
    { id: "all", label: "All Tasks", icon: Filter, color: "#94a3b8" },
  ];

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    setDragOverSection(sectionId);
  };

  const handleDragLeave = () => {
    setDragOverSection(null);
  };

  const handleDrop = (e: React.DragEvent, targetSection: string) => {
    e.preventDefault();
    setDragOverSection(null);
    try {
      const taskData = e.dataTransfer.getData("application/json");
      if (taskData && onDropTaskToSection) {
        const task: Todo = JSON.parse(taskData);
        onDropTaskToSection(task, targetSection);
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation Tabs & Drag Drop Targets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          const isDragTarget = dragOverSection === sec.id;

          return (
            <button
              key={sec.id}
              onClick={() => onChangeSection(sec.id)}
              onDragOver={(e) => handleDragOver(e, sec.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, sec.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                isActive
                  ? "shadow-md"
                  : "hover:bg-muted-bg text-muted border-border"
              } ${isDragTarget ? "ring-2 ring-indigo-500 scale-105" : ""}`}
              style={{
                background: isActive ? "var(--accent)" : "var(--card-bg)",
                color: isActive ? "#ffffff" : undefined,
                borderColor: isActive ? "var(--accent)" : undefined,
              }}
            >
              <Icon size={15} style={{ color: isActive ? "#ffffff" : sec.color }} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Task Cards Container */}
      <div
        onDragOver={(e) => handleDragOver(e, activeSection)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, activeSection)}
        className={`min-h-[260px] rounded-2xl p-4 transition-all border ${
          dragOverSection === activeSection
            ? "border-dashed border-indigo-500 bg-indigo-500/5"
            : "border-transparent"
        }`}
      >
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: "var(--muted-bg)", border: "1px solid var(--border)" }}
            >
              <Sparkles size={24} className="text-indigo-400" />
            </div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
              No tasks found in this section
            </h3>
            <p className="text-xs text-muted max-w-xs">
              Everything is clear! Click the &quot;New Task&quot; button or double-click a date on the calendar to add one.
            </p>

          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggle={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
                onSelect={onSelectTodo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
