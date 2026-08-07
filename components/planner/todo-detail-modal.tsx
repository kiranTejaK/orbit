"use client";

import { X, Calendar, Tag, Pencil, Trash2, CheckCircle2, Clock, StickyNote } from "lucide-react";
import { Todo } from "@/types";
import { TODO_PRIORITY_COLORS } from "@/lib/constants";
import { formatDate } from "@/utils/format";


interface TodoDetailModalProps {
  todo: Todo | null;
  onClose: () => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggle: (todo: Todo) => void;
}

export function TodoDetailModal({ todo, onClose, onEdit, onDelete, onToggle }: TodoDetailModalProps) {
  if (!todo) return null;

  const priorityStyle = TODO_PRIORITY_COLORS[todo.priority] || TODO_PRIORITY_COLORS.MEDIUM;
  const isCompleted = todo.status === "COMPLETED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div
        className="relative w-full max-w-lg rounded-2xl p-6 shadow-2xl z-50 overflow-y-auto max-h-[90vh] animate-in fade-in-0 zoom-in-95"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
        }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <span
            className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-flex items-center gap-1.5"
            style={{
              background: priorityStyle.bg,
              color: priorityStyle.text,
              border: `1px solid ${priorityStyle.border}`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: priorityStyle.dot }} />
            {todo.priority} Priority
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(todo);
              }}
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-muted-bg transition-all"
              title="Edit Task"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(todo.id);
              }}
              className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
              title="Delete Task"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-muted-bg transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className={`text-xl font-bold mb-3 ${isCompleted ? "line-through text-muted" : "text-foreground"}`}>
          {todo.title}
        </h2>

        {/* Description */}
        {todo.description && (
          <p className="text-sm text-muted leading-relaxed mb-6 whitespace-pre-wrap">
            {todo.description}
          </p>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {todo.dueDate && (
            <div className="p-3 rounded-xl border border-border bg-muted-bg/50">
              <span className="text-xs text-muted flex items-center gap-1 mb-1">
                <Calendar size={13} /> Due Date
              </span>
              <span className="text-sm font-semibold">{formatDate(todo.dueDate)}</span>
            </div>
          )}

          {todo.startDate && (
            <div className="p-3 rounded-xl border border-border bg-muted-bg/50">
              <span className="text-xs text-muted flex items-center gap-1 mb-1">
                <Clock size={13} /> Start Date
              </span>
              <span className="text-sm font-semibold">{formatDate(todo.startDate)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {todo.tags && todo.tags.length > 0 && (
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1 mb-2">
              <Tag size={13} /> Tags
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {todo.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs font-medium rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {todo.notes && (
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1 mb-2">
              <StickyNote size={13} /> Personal Notes
            </span>
            <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-sm leading-relaxed whitespace-pre-wrap">
              {todo.notes}
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
          <span className="text-xs text-muted">
            Created {formatDate(todo.createdAt)}
          </span>

          <button
            onClick={() => {
              onToggle(todo);
              onClose();
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              isCompleted
                ? "bg-muted-bg text-muted border border-border hover:bg-border"
                : "bg-emerald-500 text-white shadow-lg hover:bg-emerald-600"
            }`}
          >
            <CheckCircle2 size={16} />
            {isCompleted ? "Reopen Task" : "Mark as Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}
