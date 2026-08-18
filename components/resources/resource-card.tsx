"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ExternalLink, Copy, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Resource } from "@/types";
import { ResourceTypeBadge } from "./resource-type-badge";
import { truncate, getDomainFromUrl } from "@/utils/format";

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
  onToggleFavorite: (id: string, favorite: boolean) => void;
}

export function ResourceCard({
  resource,
  onEdit,
  onDelete,
  onToggleFavorite,
}: ResourceCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(resource.url);
    toast.success("Link copied!");
  };

  const handleToggleFav = async () => {
    setFavLoading(true);
    try {
      await onToggleFavorite(resource.id, !resource.favorite);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div
      className="rounded-xl p-4 sm:p-5 flex flex-col gap-3 hover-lift relative min-w-0"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <ResourceTypeBadge type={resource.resourceType} />
            {resource.category && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium truncate max-w-[150px]"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  color: "var(--accent)",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
                title={`Topic: ${resource.category}`}
              >
                {resource.category}
              </span>
            )}
          </div>
          <Link
            href={`/resources/${resource.id}`}
            className="block font-semibold text-sm leading-snug hover:underline line-clamp-2 break-words"
            style={{ color: "var(--foreground)" }}
          >
            {resource.title}
          </Link>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleToggleFav}
            disabled={favLoading}
            className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg transition-all"
            style={{ color: resource.favorite ? "#f59e0b" : "var(--muted)" }}
            title={resource.favorite ? "Unfavorite" : "Favorite"}
            aria-label="Toggle favorite"
          >
            <Star size={16} fill={resource.favorite ? "currentColor" : "none"} />
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg transition-all"
              style={{ color: "var(--muted)" }}
              aria-label="More options"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div
                  className="absolute right-0 top-8 z-20 rounded-xl shadow-xl py-1 min-w-36"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                  }}
                >
                  <button
                    onClick={() => { onEdit(resource); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm hover:bg-[var(--muted-bg)] transition-all min-h-[40px]"
                    style={{ color: "var(--foreground)" }}
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm hover:bg-[var(--muted-bg)] transition-all min-h-[40px]"
                    style={{ color: "var(--foreground)" }}
                  >
                    <Copy size={14} /> Copy link
                  </button>
                  <button
                    onClick={() => { window.open(resource.url, "_blank"); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm hover:bg-[var(--muted-bg)] transition-all min-h-[40px]"
                    style={{ color: "var(--foreground)" }}
                  >
                    <ExternalLink size={14} /> Open URL
                  </button>
                  <div style={{ borderTop: "1px solid var(--border)", margin: "4px 0" }} />
                  <button
                    onClick={() => { onDelete(resource); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm hover:bg-[var(--muted-bg)] transition-all min-h-[40px]"
                    style={{ color: "#ef4444" }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {resource.description && (
        <p className="text-xs leading-relaxed break-words" style={{ color: "var(--muted)" }}>
          {truncate(resource.description, 120)}
        </p>
      )}

      {/* Tags */}
      {resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {resource.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full break-all"
              style={{
                background: "var(--muted-bg)",
                color: "var(--muted)",
                border: "1px solid var(--border)",
              }}
            >
              {tag}
            </span>
          ))}
          {resource.tags.length > 4 && (
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              +{resource.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 min-w-0" style={{ borderTop: "1px solid var(--border)" }}>
        <span className="text-xs truncate max-w-[60%]" style={{ color: "var(--muted)" }}>
          {resource.category || getDomainFromUrl(resource.url)}
        </span>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs transition-all py-1 px-1.5 rounded"
          style={{ color: "var(--accent)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={11} />
          Visit
        </a>
      </div>
    </div>
  );
}
