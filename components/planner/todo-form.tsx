"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Tag, AlertCircle, StickyNote } from "lucide-react";

import { Todo, TodoPriority, TodoStatus } from "@/types";
import { TODO_PRIORITIES, TODO_STATUSES } from "@/lib/constants";

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    dueDate?: string;
    startDate?: string;
    priority?: TodoPriority;
    status?: TodoStatus;
    notes?: string;
    tags?: string[];
  }) => Promise<void>;
  initialData?: Todo | null;
  defaultDate?: string;
}

export function TodoForm({ isOpen, onClose, onSubmit, initialData, defaultDate }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("MEDIUM");
  const [status, setStatus] = useState<TodoStatus>("PENDING");
  const [notes, setNotes] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setDueDate(initialData.dueDate ? initialData.dueDate.split("T")[0] : "");
      setStartDate(initialData.startDate ? initialData.startDate.split("T")[0] : "");
      setPriority(initialData.priority || "MEDIUM");
      setStatus(initialData.status || "PENDING");
      setNotes(initialData.notes || "");
      setTagsInput(initialData.tags ? initialData.tags.join(", ") : "");
    } else {
      setTitle("");
      setDescription("");
      setDueDate(defaultDate || new Date().toISOString().split("T")[0]);
      setStartDate(defaultDate || "");
      setPriority("MEDIUM");
      setStatus("PENDING");
      setNotes("");
      setTagsInput("");
    }
  }, [initialData, defaultDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate ? `${dueDate}T09:00:00.000Z` : undefined,
        startDate: startDate ? `${startDate}T09:00:00.000Z` : undefined,
        priority,
        status,
        notes: notes.trim() || undefined,
        tags: parsedTags,
      });
      onClose();
    } catch {
      // Error handled by hook toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div
        className="relative w-full max-w-lg rounded-2xl p-6 shadow-2xl z-50 overflow-y-auto max-h-[90vh] transition-all animate-in fade-in-0 zoom-in-95"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
        }}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
          <h2 className="text-lg font-bold">
            {initialData ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-muted-bg text-muted"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-muted">
              Task Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Finalize Q3 System Architecture Doc"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm transition-all border border-border bg-muted-bg/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-muted">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief context or key action items..."
              className="w-full px-3.5 py-2.5 rounded-xl text-sm transition-all border border-border bg-muted-bg/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
            />
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-muted flex items-center gap-1">
                <Calendar size={13} /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm border border-border bg-muted-bg/50 focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-muted flex items-center gap-1">
                <Calendar size={13} /> Start Date (Optional)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm border border-border bg-muted-bg/50 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Priority & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-muted flex items-center gap-1">
                <AlertCircle size={13} /> Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TodoPriority)}
                className="w-full px-3 py-2 rounded-xl text-sm border border-border bg-muted-bg/50 focus:outline-none focus:border-accent"
              >
                {TODO_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-muted">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TodoStatus)}
                className="w-full px-3 py-2 rounded-xl text-sm border border-border bg-muted-bg/50 focus:outline-none focus:border-accent"
              >
                {TODO_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-muted flex items-center gap-1">
              <Tag size={13} /> Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="work, feature, sprint-12"
              className="w-full px-3.5 py-2 rounded-xl text-sm transition-all border border-border bg-muted-bg/50 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Detailed Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-muted flex items-center gap-1">
              <StickyNote size={13} /> Detailed Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional documentation, links, or sub-tasks..."
              className="w-full px-3.5 py-2 rounded-xl text-sm transition-all border border-border bg-muted-bg/50 focus:outline-none focus:border-accent resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all border border-border hover:bg-muted-bg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all shadow-md"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              }}
            >
              {loading ? "Saving..." : initialData ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
