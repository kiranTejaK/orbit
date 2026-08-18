"use client";

import {
  PRIMARY_RESOURCE_TYPES,
  RESOURCE_TYPES,
  PRIMARY_RESOURCE_CATEGORIES,
  RESOURCE_CATEGORIES,
  RESOURCE_SORT_OPTIONS,
} from "@/lib/constants";

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
  minHeight: "40px",
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
  const legacyTypes = RESOURCE_TYPES.filter(
    (t) => !PRIMARY_RESOURCE_TYPES.includes(t as any)
  );

  const legacyCategories = RESOURCE_CATEGORIES.filter(
    (c) => !PRIMARY_RESOURCE_CATEGORIES.includes(c as any)
  );

  return (
    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
      {/* Format Filter */}
      <select
        id="filter-type"
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        className="w-full sm:w-auto flex-1 sm:flex-none"
        style={selectStyle}
        aria-label="Filter by format"
      >
        <option value="">All Formats</option>
        <optgroup label="Format">
          {PRIMARY_RESOURCE_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </optgroup>
        {legacyTypes.length > 0 && (
          <optgroup label="Legacy Formats">
            {legacyTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </optgroup>
        )}
      </select>

      {/* Topic Filter */}
      <select
        id="filter-category"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full sm:w-auto flex-1 sm:flex-none"
        style={selectStyle}
        aria-label="Filter by topic"
      >
        <option value="">All Topics</option>
        <optgroup label="Topic">
          {PRIMARY_RESOURCE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </optgroup>
        {legacyCategories.length > 0 && (
          <optgroup label="Legacy Topics">
            {legacyCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </optgroup>
        )}
      </select>

      {/* Sort Filter */}
      <select
        id="sort-resources"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full sm:w-auto flex-1 sm:flex-none"
        style={selectStyle}
        aria-label="Sort resources"
      >
        {RESOURCE_SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Favorite Filter */}
      <button
        onClick={() => onFavoriteChange(!favorite)}
        className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all w-full sm:w-auto min-h-[40px]"
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

