"use client";

import { JOB_STATUSES, JOB_SORT_OPTIONS } from "@/lib/constants";

interface JobFiltersProps {
  status: string;
  sort: string;
  onStatusChange: (v: string) => void;
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

export function JobFilters({ status, sort, onStatusChange, onSortChange }: JobFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        id="filter-job-status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        style={selectStyle}
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        {JOB_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select
        id="sort-jobs"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        style={selectStyle}
        aria-label="Sort jobs"
      >
        {JOB_SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
