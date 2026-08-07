"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Todo, TodoPriority, TodoStatus } from "@/types";

export interface TodoFilterOptions {
  section?: "today" | "upcoming" | "overdue" | "completed_today" | "no_due_date" | "all";
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  priority?: string;
  q?: string;
  sort?: string;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [calendarCounts, setCalendarCounts] = useState<Record<string, { total: number; completed: number; pending: number }>>({});

  const fetchTodos = useCallback(async (options: TodoFilterOptions = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (options.section) params.set("section", options.section);
      if (options.date) params.set("date", options.date);
      if (options.startDate) params.set("startDate", options.startDate);
      if (options.endDate) params.set("endDate", options.endDate);
      if (options.status) params.set("status", options.status);
      if (options.priority) params.set("priority", options.priority);
      if (options.q) params.set("q", options.q);
      if (options.sort) params.set("sort", options.sort);

      const res = await fetch(`/api/todos?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const json = await res.json();
      setTodos(json.data || []);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to load tasks");
    } finally {

      setLoading(false);
    }
  }, []);

  const fetchCalendarCounts = useCallback(async (startDate: string, endDate: string) => {
    try {
      const params = new URLSearchParams({
        calendarCounts: "true",
        startDate,
        endDate,
      });
      const res = await fetch(`/api/todos?${params.toString()}`);
      if (!res.ok) return;
      const json = await res.json();
      setCalendarCounts(json.data || {});
    } catch (err) {
      console.error("Error fetching calendar counts:", err);
    }
  }, []);

  const createTodo = useCallback(async (data: {
    title: string;
    description?: string;
    dueDate?: string;
    startDate?: string;
    priority?: TodoPriority;
    status?: TodoStatus;
    notes?: string;
    tags?: string[];
  }) => {
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create task");

      toast.success("Task created successfully");
      return json.data as Todo;
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to create task");
      throw err;
    }

  }, []);

  const updateTodo = useCallback(async (id: string, data: Partial<Todo>) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update task");

      setTodos((prev) => prev.map((t) => (t.id === id ? json.data : t)));
      toast.success("Task updated");
      return json.data as Todo;
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update task");
      throw err;
    }

  }, []);

  const patchTodo = useCallback(async (id: string, patchData: Partial<Todo>) => {
    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, ...patchData };
        if (patchData.status === "COMPLETED") {
          updated.completedAt = new Date().toISOString();
        } else if (patchData.status && (patchData.status as string) !== "COMPLETED") {
          updated.completedAt = null;
        }

        return updated;
      })
    );

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to patch task");

      setTodos((prev) => prev.map((t) => (t.id === id ? json.data : t)));
      return json.data as Todo;
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to save change");
      // Revert if error occurs
      throw err;
    }
  }, []);

  const toggleComplete = useCallback(
    async (todo: Todo) => {
      const newStatus: TodoStatus = todo.status === "COMPLETED" ? "PENDING" : "COMPLETED";
      await patchTodo(todo.id, { status: newStatus });
      if (newStatus === "COMPLETED") {
        toast.success("Task marked complete 🎉");
      } else {
        toast.info("Task reopened");
      }
    },
    [patchTodo]
  );

  const deleteTodo = useCallback(async (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      toast.success("Task deleted");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to delete task");
    }
  }, []);


  return {
    todos,
    setTodos,
    loading,
    calendarCounts,
    fetchTodos,
    fetchCalendarCounts,
    createTodo,
    updateTodo,
    patchTodo,
    toggleComplete,
    deleteTodo,
  };
}
