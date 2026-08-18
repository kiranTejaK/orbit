import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Tag,
  Calendar,
  Globe,
  StickyNote,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ResourceTypeBadge } from "@/components/resources/resource-type-badge";
import prisma from "@/lib/prisma";
import { formatDate, formatRelative } from "@/utils/format";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const resource = await prisma.resource.findUnique({ where: { id }, select: { title: true } });
  return { title: resource ? `${resource.title} | Resources` : "Resource" };
}

export default async function ResourceDetailPage({ params }: Props) {
  const { id } = await params;
  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) notFound();

  return (
    <AppShell title="Resource Detail">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm mb-6 transition-all min-h-[40px]"
          style={{ color: "var(--muted)" }}
        >
          <ArrowLeft size={16} />
          Back to Resources
        </Link>

        <div
          className="rounded-2xl p-4 sm:p-6 lg:p-8"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <ResourceTypeBadge type={resource.resourceType} size="md" />
                {resource.favorite && (
                  <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
                    <Star size={11} fill="currentColor" /> Favorite
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold leading-snug break-words" style={{ color: "var(--foreground)" }}>
                {resource.title}
              </h1>
            </div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-all w-full sm:w-auto min-h-[44px]"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              <ExternalLink size={15} />
              Open URL
            </a>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl min-w-0" style={{ background: "var(--muted-bg)" }}>
              <Globe size={16} className="flex-shrink-0" style={{ color: "var(--muted)" }} />
              <div className="min-w-0 flex-1">
                <p className="text-xs" style={{ color: "var(--muted)" }}>URL</p>
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium truncate block hover:underline" style={{ color: "var(--accent)" }}>
                  {resource.url}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl min-w-0" style={{ background: "var(--muted-bg)" }}>
              <Tag size={16} className="flex-shrink-0" style={{ color: "var(--muted)" }} />
              <div className="min-w-0 flex-1">
                <p className="text-xs" style={{ color: "var(--muted)" }}>Format</p>
                <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{resource.resourceType}</p>
              </div>
            </div>

            {resource.category && (
              <div className="flex items-center gap-3 p-3 rounded-xl min-w-0" style={{ background: "var(--muted-bg)" }}>
                <Tag size={16} className="flex-shrink-0" style={{ color: "var(--muted)" }} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs" style={{ color: "var(--muted)" }}>Topic</p>
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{resource.category}</p>
                </div>
              </div>
            )}

            {resource.source && (
              <div className="flex items-center gap-3 p-3 rounded-xl min-w-0" style={{ background: "var(--muted-bg)" }}>
                <Globe size={16} className="flex-shrink-0" style={{ color: "var(--muted)" }} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs" style={{ color: "var(--muted)" }}>Source</p>
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{resource.source}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 rounded-xl min-w-0" style={{ background: "var(--muted-bg)" }}>
              <Calendar size={16} className="flex-shrink-0" style={{ color: "var(--muted)" }} />
              <div className="min-w-0 flex-1">
                <p className="text-xs" style={{ color: "var(--muted)" }}>Added</p>
                <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                  {formatDate(resource.createdAt)} · {formatRelative(resource.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {resource.tags.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>Tags</p>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span key={tag} className="text-sm px-3 py-1 rounded-full" style={{ background: "var(--muted-bg)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {resource.description && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>Description</p>
              <p className="text-sm leading-relaxed break-words" style={{ color: "var(--foreground)" }}>{resource.description}</p>
            </div>
          )}

          {/* Personal Notes */}
          {resource.personalNotes && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <StickyNote size={14} style={{ color: "var(--muted)" }} />
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Personal Notes</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)" }}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words" style={{ color: "var(--foreground)" }}>
                  {resource.personalNotes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
