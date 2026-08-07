"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Calendar as CalendarIcon, CheckSquare, Sun, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useTodos, TodoFilterOptions } from "@/hooks/use-todos";
import { Todo } from "@/types";

import { PlannerBoard } from "@/components/planner/planner-board";
import { PlannerCalendar } from "@/components/planner/planner-calendar";
import { TodoForm } from "@/components/planner/todo-form";
import { TodoDetailModal } from "@/components/planner/todo-detail-modal";
import { useDebounce } from "@/hooks/use-debounce";

export default function PlannerPage() {
  const {
    todos,
    loading,
    calendarCounts,
    fetchTodos,
    fetchCalendarCounts,
    createTodo,
    updateTodo,
    patchTodo,
    toggleComplete,
    deleteTodo,
  } = useTodos();

  const [activeSection, setActiveSection] = useState("today");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [quickAddDate, setQuickAddDate] = useState<string | undefined>();

  // Fetch todos whenever filter controls change
  useEffect(() => {
    fetchTodos({
      section: activeSection !== "all" && !search ? (activeSection as TodoFilterOptions["section"]) : undefined,
      q: debouncedSearch || undefined,
      date: search ? undefined : activeSection === "date" ? selectedDate : undefined,
    });
  }, [activeSection, selectedDate, debouncedSearch, fetchTodos, search]);


  // Fetch calendar counts for month range
  useEffect(() => {
    const d = new Date(selectedDate);
    const startDate = new Date(d.getFullYear(), d.getMonth() - 1, 1).toISOString().split("T")[0];
    const endDate = new Date(d.getFullYear(), d.getMonth() + 2, 0).toISOString().split("T")[0];
    fetchCalendarCounts(startDate, endDate);
  }, [selectedDate, fetchCalendarCounts, todos]);

  const handleSelectCalendarDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setActiveSection("date");
    fetchTodos({ date: dateStr, q: debouncedSearch || undefined });
  };

  const handleCreateTask = async (data: Partial<Todo>) => {
    await createTodo(data as Parameters<typeof createTodo>[0]);
    const d = new Date(selectedDate);
    const startDate = new Date(d.getFullYear(), d.getMonth() - 1, 1).toISOString().split("T")[0];
    const endDate = new Date(d.getFullYear(), d.getMonth() + 2, 0).toISOString().split("T")[0];
    fetchCalendarCounts(startDate, endDate);
    fetchTodos({ section: activeSection as TodoFilterOptions["section"] });
  };

  const handleUpdateTask = async (data: Partial<Todo>) => {
    if (!editingTodo) return;
    await updateTodo(editingTodo.id, data);
    setEditingTodo(null);
  };


  const handleDropTaskToSection = async (task: Todo, targetSection: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const todayIso = `${todayStr}T09:00:00.000Z`;

    if (targetSection === "today") {
      await patchTodo(task.id, { dueDate: todayIso, status: "PENDING" });
    } else if (targetSection === "no_due_date") {
      await patchTodo(task.id, { dueDate: null });
    } else if (targetSection === "completed_today") {
      await patchTodo(task.id, { status: "COMPLETED" });
    }
    fetchTodos({ section: activeSection as any });
  };

  return (
    <AppShell
      title="Daily Planner"
      description="Organize tasks, set momentum, and track daily progress with Orbit."
    >
      {/* Top Action & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title, tag, or notes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all border border-border bg-card focus:outline-none focus:border-accent"
          />
        </div>

        {/* New Task Trigger */}
        <button
          onClick={() => {
            setEditingTodo(null);
            setQuickAddDate(undefined);
            setIsFormOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-lg hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          }}
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Planner Board & Sections) */}
        <div className="lg:col-span-2 space-y-6">
          <PlannerBoard
            todos={todos}
            activeSection={activeSection}
            onChangeSection={setActiveSection}
            onToggleComplete={toggleComplete}
            onEdit={(todo) => {
              setEditingTodo(todo);
              setIsFormOpen(true);
            }}
            onDelete={deleteTodo}
            onSelectTodo={setSelectedTodo}
            onDropTaskToSection={handleDropTaskToSection}
          />
        </div>

        {/* Right Column (Month Calendar & Widgets) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Interactive Month Calendar */}
          <PlannerCalendar
            selectedDate={selectedDate}
            onSelectDate={handleSelectCalendarDate}
            calendarCounts={calendarCounts}
            onQuickAddForDate={(dateStr) => {
              setQuickAddDate(dateStr);
              setEditingTodo(null);
              setIsFormOpen(true);
            }}
          />
        </div>
      </div>

      {/* Create / Edit Form Modal */}
      <TodoForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={editingTodo ? handleUpdateTask : handleCreateTask}
        initialData={editingTodo}
        defaultDate={quickAddDate}
      />

      {/* Task Detail Inspector Modal */}
      <TodoDetailModal
        todo={selectedTodo}
        onClose={() => setSelectedTodo(null)}
        onEdit={(todo) => {
          setSelectedTodo(null);
          setEditingTodo(todo);
          setIsFormOpen(true);
        }}
        onDelete={(id) => {
          setSelectedTodo(null);
          deleteTodo(id);
        }}
        onToggle={toggleComplete}
      />
    </AppShell>
  );
}
