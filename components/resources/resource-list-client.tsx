"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, LayoutGrid, List, BookMarked, Info, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { Resource } from "@/types";
import { useResources } from "@/hooks/use-resources";
import { useDebounce } from "@/hooks/use-debounce";
import { parseTags } from "@/lib/validations";
import { RESOURCE_CLASSIFICATION_GUIDE } from "@/lib/constants";
import { ResourceCard } from "./resource-card";
import { ResourceForm } from "./resource-form";
import { ResourceFilters } from "./resource-filters";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import type { CreateResourceInput } from "@/lib/validations";

export function ResourceListClient() {
  const { resources, meta, loading, fetchResources, createResource, updateResource, deleteResource } = useResources();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showGuide, setShowGuide] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editResource, setEditResource] = useState<Resource | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Resource | undefined>();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  const load = useCallback(() => {
    fetchResources({ q: debouncedSearch, type, category, favorite, sort, page });
  }, [debouncedSearch, type, category, favorite, sort, page, fetchResources]);

  useEffect(() => { load(); }, [load]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, type, category, favorite, sort]);

  const handleCreate = async (data: CreateResourceInput) => {
    try {
      await createResource({
        ...data,
        tags: parseTags(data.tags),
        description: data.description || undefined,
        personalNotes: data.personalNotes || undefined,
        category: data.category || undefined,
        source: data.source || undefined,
      });
      toast.success("Resource added!");
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleEdit = async (data: CreateResourceInput) => {
    if (!editResource) return;
    try {
      await updateResource(editResource.id, {
        ...data,
        tags: parseTags(data.tags),
        description: data.description || undefined,
        personalNotes: data.personalNotes || undefined,
        category: data.category || undefined,
        source: data.source || undefined,
      });
      toast.success("Resource updated!");
      setEditResource(undefined);
      load();
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteResource(deleteTarget.id);
      toast.success("Resource deleted");
      setDeleteTarget(undefined);
      load();
    } catch (err) {
      toast.error(String(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleFavorite = async (id: string, fav: boolean) => {
    try {
      await updateResource(id, { favorite: fav });
      toast.success(fav ? "Added to favorites" : "Removed from favorites");
      load();
    } catch (err) {
      toast.error(String(err));
    }
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <SearchInput
              id="resource-search"
              value={search}
              onChange={setSearch}
              placeholder="Search resources by title, description, tags…"
            />
          </div>
          <div className="flex items-center gap-2 justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg transition-all"
                style={{
                  background: viewMode === "grid" ? "var(--accent)" : "var(--muted-bg)",
                  color: viewMode === "grid" ? "#fff" : "var(--muted)",
                  border: "1px solid var(--border)",
                }}
                aria-label="Grid view"
                id="view-grid"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg transition-all"
                style={{
                  background: viewMode === "list" ? "var(--accent)" : "var(--muted-bg)",
                  color: viewMode === "list" ? "#fff" : "var(--muted)",
                  border: "1px solid var(--border)",
                }}
                aria-label="List view"
                id="view-list"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setShowGuide((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: showGuide ? "rgba(99,102,241,0.15)" : "var(--muted-bg)",
                  color: showGuide ? "var(--accent)" : "var(--muted)",
                  border: `1px solid ${showGuide ? "rgba(99,102,241,0.3)" : "var(--border)"}`,
                }}
                aria-label="Toggle classification guide"
                id="toggle-guide-btn"
              >
                <Info size={14} />
                <span className="hidden xs:inline sm:inline">Guide & Boundaries</span>
                {showGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
            <button
              id="add-resource-btn"
              onClick={() => { setEditResource(undefined); setFormOpen(true); }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl text-sm font-semibold transition-all min-h-[40px] sm:min-h-[36px]"
              style={{
                background: "var(--accent)",
                color: "#fff",
                boxShadow: "0 0 20px rgba(99,102,241,0.3)",
              }}
            >
              <Plus size={16} />
              Add Resource
            </button>
          </div>
        </div>

        {/* Classification Guide Banner */}
        {showGuide && (
          <div
            className="p-4 sm:p-5 rounded-2xl transition-all"
            style={{
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Info size={18} className="text-indigo-500" />
                <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  Resource Classification & Boundary Guidelines
                </h3>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-xs text-muted hover:underline"
                style={{ color: "var(--muted)" }}
              >
                Dismiss
              </button>
            </div>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--muted)" }}>
              To keep your knowledge hub structured and avoid mixing up resource attributes, follow these clear boundary rules:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Format Guide */}
              <div
                className="p-3.5 rounded-xl"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200">
                    Format (Delivery Medium)
                  </span>
                </div>
                <p className="text-xs mb-2 font-medium" style={{ color: "var(--foreground)" }}>
                  {RESOURCE_CLASSIFICATION_GUIDE.format.description}
                </p>
                <div className="flex flex-wrap gap-1 text-[11px]">
                  {RESOURCE_CLASSIFICATION_GUIDE.format.examples.map((ex) => (
                    <span key={ex} className="px-2 py-0.5 rounded" style={{ background: "var(--muted-bg)", color: "var(--muted)" }}>
                      {ex}
                    </span>
                  ))}
                </div>
              </div>

              {/* Topic Guide */}
              <div
                className="p-3.5 rounded-xl"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                    Topic (Technical Domain)
                  </span>
                </div>
                <p className="text-xs mb-2 font-medium" style={{ color: "var(--foreground)" }}>
                  {RESOURCE_CLASSIFICATION_GUIDE.topic.description}
                </p>
                <div className="flex flex-wrap gap-1 text-[11px]">
                  {RESOURCE_CLASSIFICATION_GUIDE.topic.examples.map((ex) => (
                    <span key={ex} className="px-2 py-0.5 rounded" style={{ background: "var(--muted-bg)", color: "var(--muted)" }}>
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <ResourceFilters
          type={type}
          category={category}
          favorite={favorite}
          sort={sort}
          onTypeChange={setType}
          onCategoryChange={setCategory}
          onFavoriteChange={setFavorite}
          onSortChange={setSort}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : resources.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="No resources found"
          description={search || type || category || favorite ? "Try adjusting your filters." : "Start building your knowledge base."}
          action={
            <button
              onClick={() => { setEditResource(undefined); setFormOpen(true); }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold min-h-[44px]"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Add your first resource
            </button>
          }
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              onEdit={(res) => { setEditResource(res); setFormOpen(true); }}
              onDelete={setDeleteTarget}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div
          className="rounded-xl overflow-x-auto w-full"
          style={{ border: "1px solid var(--border)" }}
        >
          <table className="w-full min-w-[650px]">
            <thead>
              <tr style={{ background: "var(--muted-bg)", borderBottom: "1px solid var(--border)" }}>
                {["Title", "Format", "Topic", "Tags", "Fav", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resources.map((r, i) => (
                <tr
                  key={r.id}
                  style={{
                    background: i % 2 === 0 ? "var(--card-bg)" : "var(--muted-bg)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <td className="px-4 py-3">
                    <a href={`/resources/${r.id}`} className="font-medium text-sm hover:underline" style={{ color: "var(--foreground)" }}>
                      {r.title.length > 50 ? r.title.slice(0, 50) + "…" : r.title}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--muted)" }}>{r.resourceType}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--muted)" }}>{r.category || "—"}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted)" }}>{r.tags.slice(0, 3).join(", ") || "—"}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: r.favorite ? "#f59e0b" : "var(--muted)" }}>
                    {r.favorite ? "★" : "☆"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditResource(r); setFormOpen(true); }} className="text-xs px-2.5 py-1.5 rounded-lg font-medium" style={{ background: "var(--muted-bg)", color: "var(--foreground)", border: "1px solid var(--border)" }}>Edit</button>
                      <button onClick={() => setDeleteTarget(r)} className="text-xs px-2.5 py-1.5 rounded-lg font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {meta && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          pageSize={meta.pageSize}
          onPageChange={setPage}
        />
      )}

      {/* Forms & Dialogs */}
      <ResourceForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditResource(undefined); }}
        onSubmit={editResource ? handleEdit : handleCreate}
        initialData={editResource}
        mode={editResource ? "edit" : "create"}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Resource"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(undefined)}
        loading={deleteLoading}
      />
    </>
  );
}
