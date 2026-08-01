"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const btnStyle = (active: boolean, disabled: boolean) => ({
    background: active ? "var(--accent)" : "var(--muted-bg)",
    color: active ? "#fff" : disabled ? "var(--muted)" : "var(--foreground)",
    border: "1px solid var(--border)",
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: "8px",
    padding: "6px 12px",
    minWidth: "36px",
    minHeight: "36px",
    fontSize: "14px",
    fontWeight: active ? 600 : 400,
    transition: "all 0.15s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (page <= 4) return i + 1;
    if (page >= totalPages - 3) return totalPages - 6 + i;
    return page - 3 + i;
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
      <p className="text-sm text-center sm:text-left" style={{ color: "var(--muted)" }}>
        Showing {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-1 flex-wrap justify-center">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          style={btnStyle(false, page === 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={btnStyle(p === page, false)}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          style={btnStyle(false, page === totalPages)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
