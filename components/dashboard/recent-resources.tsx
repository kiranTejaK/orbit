import Link from "next/link";
import { BookMarked, Star, ExternalLink } from "lucide-react";
import { Resource } from "@/types";
import { ResourceTypeBadge } from "@/components/resources/resource-type-badge";
import { formatRelative, truncate } from "@/utils/format";

interface RecentResourcesProps {
  resources: Resource[];
  title?: string;
  showFavoriteIcon?: boolean;
}

export function RecentResources({ resources, title = "Recent Resources", showFavoriteIcon }: RecentResourcesProps) {
  if (resources.length === 0) {
    return (
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
      >
        <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--foreground)" }}>
          {title}
        </h3>
        <div className="flex flex-col items-center py-8" style={{ color: "var(--muted)" }}>
          <BookMarked size={28} className="mb-2 opacity-40" />
          <p className="text-sm">No resources yet</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
          {title}
        </h3>
        <Link
          href="/resources"
          className="text-xs transition-all"
          style={{ color: "var(--accent)" }}
        >
          View all →
        </Link>
      </div>
      <div className="space-y-3">
        {resources.map((r) => (
          <div
            key={r.id}
            className="flex items-start gap-3 py-2"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <ResourceTypeBadge type={r.resourceType} />
                {showFavoriteIcon && r.favorite && (
                  <Star size={11} fill="#f59e0b" style={{ color: "#f59e0b" }} />
                )}
              </div>
              <Link
                href={`/resources/${r.id}`}
                className="text-sm font-medium hover:underline line-clamp-1"
                style={{ color: "var(--foreground)" }}
              >
                {r.title}
              </Link>
              {r.description && (
                <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--muted)" }}>
                  {truncate(r.description, 80)}
                </p>
              )}
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                {formatRelative(r.createdAt)}
              </p>
            </div>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 mt-1"
              style={{ color: "var(--muted)" }}
              aria-label="Open URL"
            >
              <ExternalLink size={13} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
