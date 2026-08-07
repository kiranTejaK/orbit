"use client";

import Link from "next/link";
import { Calendar as CalendarIcon, ArrowRight } from "lucide-react";

export function MiniCalendar() {
  const now = new Date();
  const monthName = now.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  const todayDate = now.getDate();
  const dayName = now.toLocaleDateString("en-US", { weekday: "short" });

  return (
    <div
      className="rounded-2xl p-5 shadow-sm transition-all"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon size={18} className="text-cyan-400" />
          <h3 className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
            Calendar
          </h3>
        </div>
        <Link
          href="/planner"
          className="text-xs font-semibold flex items-center gap-1 transition-all text-cyan-400 hover:text-cyan-300"
        >
          View Full <ArrowRight size={13} />
        </Link>
      </div>

      <div className="flex items-center justify-center p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-500/20">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            {dayName}, {monthName}
          </span>
          <div className="text-4xl font-extrabold text-foreground mt-1">
            {todayDate}
          </div>
          <span className="text-[11px] text-muted block mt-1">
            Stay aligned with your daily goals
          </span>
        </div>
      </div>
    </div>
  );
}
