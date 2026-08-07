"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from "lucide-react";

interface PlannerCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  calendarCounts: Record<string, { total: number; completed: number; pending: number }>;
  onQuickAddForDate?: (dateStr: string) => void;
}

export function PlannerCalendar({
  selectedDate,
  onSelectDate,
  calendarCounts,
  onQuickAddForDate,
}: PlannerCalendarProps) {
  // Calendar current view month/year state
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate grid matrix for current month
  const calendarCells = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ dateStr: string; dayNum: number; isCurrentMonth: boolean }> = [];

    // Prev month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const d = new Date(year, month - 1, day);
      const dateStr = d.toISOString().split("T")[0];
      cells.push({ dateStr, dayNum: day, isCurrentMonth: false });
    }

    // Current month days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const mStr = String(month + 1).padStart(2, "0");
      const dStr = String(day).padStart(2, "0");
      const dateStr = `${year}-${mStr}-${dStr}`;
      cells.push({ dateStr, dayNum: day, isCurrentMonth: true });
    }

    // Next month padding to fill 35 or 42 grid cells
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, month + 1, day);
      const dateStr = d.toISOString().split("T")[0];
      cells.push({ dateStr, dayNum: day, isCurrentMonth: false });
    }

    return cells;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    onSelectDate(todayStr);
  };

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="rounded-2xl p-4 sm:p-5 shadow-sm transition-all"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Calendar Navigation Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon size={18} className="text-indigo-400" />
          <h3 className="font-bold text-base sm:text-lg" style={{ color: "var(--foreground)" }}>
            {monthLabel}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border border-border hover:bg-muted-bg text-foreground"
          >
            Today
          </button>
          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-border hover:bg-muted-bg text-muted hover:text-foreground transition-all"
            title="Previous month"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-border hover:bg-muted-bg text-muted hover:text-foreground transition-all"
            title="Next month"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center mb-2">
        {daysOfWeek.map((day) => (
          <span
            key={day}
            className="text-[11px] font-bold uppercase tracking-wider py-1 text-muted"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarCells.map((cell) => {
          const isToday = cell.dateStr === todayStr;
          const isSelected = cell.dateStr === selectedDate;
          const counts = calendarCounts[cell.dateStr];
          const totalTasks = counts?.total || 0;
          const pendingTasks = counts?.pending || 0;

          return (
            <button
              key={cell.dateStr}
              onClick={() => onSelectDate(cell.dateStr)}
              className={`relative min-h-[46px] p-1.5 rounded-xl text-center flex flex-col items-center justify-between transition-all group ${
                !cell.isCurrentMonth ? "opacity-35" : ""
              }`}
              style={{
                background: isSelected
                  ? "rgba(99, 102, 241, 0.15)"
                  : isToday
                  ? "var(--muted-bg)"
                  : "transparent",
                border: isSelected
                  ? "2px solid #6366f1"
                  : isToday
                  ? "1px solid rgba(99, 102, 241, 0.4)"
                  : "1px solid transparent",
              }}
            >
              {/* Day Number */}
              <span
                className={`text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center ${
                  isToday
                    ? "bg-indigo-500 text-white font-bold"
                    : isSelected
                    ? "text-indigo-400 font-bold"
                    : "text-foreground"
                }`}
              >
                {cell.dayNum}
              </span>

              {/* Task Count Indicators */}
              <div className="flex items-center justify-center gap-1 mt-1 min-h-[14px]">
                {totalTasks > 0 && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      pendingTasks > 0
                        ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {totalTasks}
                  </span>
                )}
              </div>

              {/* Quick Add Hover Icon */}
              {onQuickAddForDate && cell.isCurrentMonth && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAddForDate(cell.dateStr);
                  }}
                  className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded bg-accent text-white"
                  title={`Add task for ${cell.dateStr}`}
                >
                  <Plus size={10} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
