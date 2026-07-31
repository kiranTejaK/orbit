// hooks/use-jobs.ts
import { useState, useCallback } from "react";
import { JobApplication, PaginationMeta } from "@/types";

interface UseJobsState {
  jobs: JobApplication[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
}

interface FetchParams {
  q?: string;
  status?: string;
  sort?: string;
  page?: number;
}

export function useJobs() {
  const [state, setState] = useState<UseJobsState>({
    jobs: [],
    meta: null,
    loading: false,
    error: null,
  });

  const fetchJobs = useCallback(async (params: FetchParams = {}) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const sp = new URLSearchParams();
      if (params.q) sp.set("q", params.q);
      if (params.status) sp.set("status", params.status);
      if (params.sort) sp.set("sort", params.sort);
      if (params.page) sp.set("page", String(params.page));

      const res = await fetch(`/api/jobs?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const json = await res.json();
      setState({ jobs: json.data, meta: json.meta, loading: false, error: null });
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: String(err) }));
    }
  }, []);

  const createJob = useCallback(async (data: Record<string, unknown>) => {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to create job");
    }
    return (await res.json()).data as JobApplication;
  }, []);

  const updateJob = useCallback(async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`/api/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to update job");
    }
    return (await res.json()).data as JobApplication;
  }, []);

  const deleteJob = useCallback(async (id: string) => {
    const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to delete job");
    }
  }, []);

  return {
    ...state,
    fetchJobs,
    createJob,
    updateJob,
    deleteJob,
  };
}
