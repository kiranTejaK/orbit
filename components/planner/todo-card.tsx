"use client";

import { Check, Calendar, MoreHorizontal, Pencil, Trash2, GripVertical, FileText } from "lucide-react";
import { Todo } from "@/types";
import { TODO_PRIORITY_COLORS } from "@/lib/constants";
import { formatDate } from "@/utils/format";
import { useState } from "react";

interface TodoCardProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onSelect?: (todo: Todo) => void;
}

export function TodoCard({ todo, onToggle, onEdit, onDelete, onSelect }: TodoCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const isCompleted = todo.status === "COMPLETED";

  const priorityStyle = TODO_PRIORITY_COLORS[todo.priority] || TODO_PRIORITY_COLORS.MEDIUM;


  // Calculate overdue status
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const isOverdue =
    !isCompleted && todo.dueDate && todo.dueDate.split("T")[0] < todayStr;
  const isDueToday =
    !isCompleted && todo.dueDate && todo.dueDate.split("T")[0] === todayStr;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(todo));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`group relative flex items-start gap-3 p-3.5 sm:p-4 rounded-xl transition-all duration-200 hover-lift ${
        isCompleted ? "opacity-75" : ""
      }`}
      style={{
        background: "var(--card-bg)",
        border: `1px solid ${
          isOverdue
            ? "rgba(239, 68, 68, 0.3)"
            : isDueToday
            ? "rgba(99, 102, 241, 0.3)"
            : "var(--border)"
        }`,
      }}
    >
      {/* Drag handle icon */}
      <div
        className="cursor-grab active:cursor-grabbing text-slate-400 opacity-30 group-hover:opacity-100 transition-opacity pt-1"
        title="Drag to reorder or move section"
      >
        <GripVertical size={16} />
      </div>

      {/* Custom Checkbox */}
      <button
        onClick={() => onToggle(todo)}
        className={`w-5 h-5 mt-0.5 rounded-lg flex items-center justify-center transition-all flex-shrink-0 border ${
          isCompleted
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "border-slate-400 dark:border-slate-600 hover:border-indigo-500 bg-muted-bg/30"
        }`}
        title={isCompleted ? "Reopen task" : "Mark complete"}
        aria-label={isCompleted ? "Reopen task" : "Mark complete"}
      >
        {isCompleted && <Check size={13} strokeWidth={3} />}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelect && onSelect(todo)}>
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h4
            className={`text-sm font-semibold truncate ${
              isCompleted ? "line-through text-muted" : "text-foreground"
            }`}
          >
            {todo.title}
          </h4>

          {/* Priority Pill */}
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1"
            style={{
              background: priorityStyle.bg,
              color: priorityStyle.text,
              border: `1px solid ${priorityStyle.border}`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: priorityStyle.dot }}
            />
            {todo.priority}
          </span>
        </div>

        {/* Description snippet */}
        {todo.description && (
          <p className="text-xs text-muted line-clamp-1 mb-2">
            {todo.description}
          </p>
        )}

        {/* Metadata Footer */}
        <div className="flex items-center gap-3 flex-wrap text-xs text-muted mt-2">
          {/* Due Date Indicator */}
          {todo.dueDate && (
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-[11px] ${
                isOverdue
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : isDueToday
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  : "bg-muted-bg text-muted border border-border"
              }`}
            >
              <Calendar size={12} />
              <span>
                {isDueToday
                  ? "Today"
                  : isOverdue
                  ? `Overdue (${formatDate(todo.dueDate)})`
                  : formatDate(todo.dueDate)}
              </span>
            </div>
          )}

          {/* Tags */}
          {todo.tags && todo.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {todo.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-[10px] rounded bg-muted-bg text-muted border border-border font-medium"
                >
                  #{tag}
                </span>
              ))}
              {todo.tags.length > 3 && (
                <span className="text-[10px] text-muted">+{todo.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Notes indicator */}
          {todo.notes && (
            <span className="inline-flex items-center gap-1 text-[11px] text-indigo-400">
              <FileText size={12} /> Notes
            </span>
          )}
        </div>
      </div>

      {/* Action Menu */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setShowMenu((v) => !v)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-muted-bg transition-all"
          title="Task options"
        >
          <MoreHorizontal size={16} />
        </button>

        {showMenu && (
          <div
            className="absolute right-0 top-9 z-30 w-36 rounded-xl shadow-xl p-1 animate-in fade-in-0 zoom-in-95"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
            onMouseLeave={() => setShowMenu(false)}
          >
            <button
              onClick={() => {
                setShowMenu(false);
                onEdit(todo);
              }}
              className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-2 text-foreground hover:bg-muted-bg transition-all"
            >
              <Pencil size={13} className="text-muted" /> Edit Task
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                onDelete(todo.id);
              }}
              className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-2 text-red-500 hover:bg-red-500/10 transition-all"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
