"use client";

import { RESOURCE_TYPES, RESOURCE_CATEGORIES, RESOURCE_SORT_OPTIONS } from "@/lib/constants";

interface ResourceFiltersProps {
  type: string;
  category: string;
  favorite: boolean;
  sort: string;
  onTypeChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onFavoriteChange: (v: boolean) => void;
  onSortChange: (v: string) => void;
}

const selectStyle = {
  background: "var(--muted-bg)",
  color: "var(--foreground)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  padding: "8px 12px",
  fontSize: "13px",
  outline: "none",
};

export function ResourceFilters({
  type,
  category,
  favorite,
  sort,
  onTypeChange,
  onCategoryChange,
  onFavoriteChange,
  onSortChange,
}: ResourceFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        id="filter-type"
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        style={selectStyle}
        aria-label="Filter by type"
      >
        <option value="">All Types</option>
        {RESOURCE_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        id="filter-category"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        style={selectStyle}
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {RESOURCE_CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        id="sort-resources"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        style={selectStyle}
        aria-label="Sort resources"
      >
        {RESOURCE_SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <button
        onClick={() => onFavoriteChange(!favorite)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
        style={{
          background: favorite ? "rgba(245,158,11,0.15)" : "var(--muted-bg)",
          color: favorite ? "#f59e0b" : "var(--muted)",
          border: `1px solid ${favorite ? "rgba(245,158,11,0.3)" : "var(--border)"}`,
        }}
        aria-label="Toggle favorites filter"
        id="filter-favorites"
      >
        ★ Favorites{favorite ? " ✕" : ""}
      </button>
    </div>
  );
}
