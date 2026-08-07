"use client";

import Link from "next/link";
import { CheckSquare, ArrowRight, Sun, AlertTriangle, CalendarCheck2 } from "lucide-react";
import { Todo } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

interface PlannerWidgetProps {
  initialTodayTodos: Todo[];
  stats: {
    todayTotal: number;
    todayCompleted: number;
    overdueTotal: number;
    upcomingTotal: number;
  };
}

export function PlannerWidget({ initialTodayTodos, stats }: PlannerWidgetProps) {
  const [todos, setTodos] = useState(initialTodayTodos);

  const toggleTask = async (todo: Todo) => {
    const newStatus = todo.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      if (newStatus === "COMPLETED") toast.success("Task completed 🎉");
    } catch {
      toast.error("Error updating task");
    }
  };

  const completedCount = todos.filter((t) => t.status === "COMPLETED").length;
  const completionPercentage =
    todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div
      className="rounded-2xl p-5 shadow-sm transition-all"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Sun size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
              Today's Focus
            </h3>
            <p className="text-xs text-muted">
              {completedCount} of {todos.length} completed ({completionPercentage}%)
            </p>
          </div>
        </div>
        <Link
          href="/planner"
          className="text-xs font-semibold flex items-center gap-1 transition-all text-indigo-400 hover:text-indigo-300"
        >
          Open Planner <ArrowRight size={13} />
        </Link>
      </div>

      {/* Progress Ring / Bar */}
      <div className="w-full bg-muted-bg h-2 rounded-full overflow-hidden mb-4 border border-border">
        <div
          className="h-full transition-all duration-500 rounded-full"
          style={{
            width: `${completionPercentage}%`,
            background: "linear-gradient(90deg, #6366f1, #10b981)",
          }}
        />
      </div>

      {/* Quick Summary Badges */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2.5 rounded-xl bg-muted-bg/50 border border-border flex items-center gap-2">
          <AlertTriangle size={15} className="text-amber-400 flex-shrink-0" />
          <span className="text-xs font-semibold text-foreground">
            {stats.overdueTotal} Overdue
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-muted-bg/50 border border-border flex items-center gap-2">
          <CalendarCheck2 size={15} className="text-cyan-400 flex-shrink-0" />
          <span className="text-xs font-semibold text-foreground">
            {stats.upcomingTotal} Upcoming
          </span>
        </div>
      </div>

      {/* Today's Tasks Interactive List */}
      {todos.length === 0 ? (
        <div className="text-center py-6 text-xs text-muted">
          No tasks scheduled for today. Great job!
        </div>
      ) : (
        <div className="space-y-2">
          {todos.slice(0, 4).map((todo) => {
            const isDone = todo.status === "COMPLETED";
            return (
              <div
                key={todo.id}
                onClick={() => toggleTask(todo)}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer border hover:border-indigo-500/50 ${
                  isDone ? "bg-muted-bg/30 opacity-70" : "bg-muted-bg/60"
                }`}
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center text-white text-[10px] font-bold transition-all border ${
                    isDone
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-slate-400"
                  }`}
                >
                  {isDone && "✓"}
                </div>
                <span
                  className={`text-xs font-medium truncate flex-1 ${
                    isDone ? "line-through text-muted" : "text-foreground"
                  }`}
                >
                  {todo.title}
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-bg">
                  {todo.priority}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
