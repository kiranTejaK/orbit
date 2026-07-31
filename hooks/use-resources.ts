// hooks/use-resources.ts
import { useState, useCallback } from "react";
import { Resource, PaginationMeta } from "@/types";

interface UseResourcesState {
  resources: Resource[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
}

interface FetchParams {
  q?: string;
  type?: string;
  category?: string;
  favorite?: boolean;
  sort?: string;
  page?: number;
}

export function useResources() {
  const [state, setState] = useState<UseResourcesState>({
    resources: [],
    meta: null,
    loading: false,
    error: null,
  });

  const fetchResources = useCallback(async (params: FetchParams = {}) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const sp = new URLSearchParams();
      if (params.q) sp.set("q", params.q);
      if (params.type) sp.set("type", params.type);
      if (params.category) sp.set("category", params.category);
      if (params.favorite) sp.set("favorite", "true");
      if (params.sort) sp.set("sort", params.sort);
      if (params.page) sp.set("page", String(params.page));

      const res = await fetch(`/api/resources?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch resources");
      const json = await res.json();
      setState({ resources: json.data, meta: json.meta, loading: false, error: null });
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: String(err) }));
    }
  }, []);

  const createResource = useCallback(async (data: Record<string, unknown>) => {
    const res = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to create resource");
    }
    return (await res.json()).data as Resource;
  }, []);

  const updateResource = useCallback(async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`/api/resources/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to update resource");
    }
    return (await res.json()).data as Resource;
  }, []);

  const deleteResource = useCallback(async (id: string) => {
    const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to delete resource");
    }
  }, []);

  return {
    ...state,
    fetchResources,
    createResource,
    updateResource,
    deleteResource,
  };
}
