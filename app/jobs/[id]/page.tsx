import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar, User, Phone, DollarSign, FileText, StickyNote } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";
import prisma from "@/lib/prisma";
import { formatDate } from "@/utils/format";
import { JOB_STATUSES } from "@/lib/constants";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await prisma.jobApplication.findUnique({ where: { id }, select: { company: true, position: true } });
  return { title: job ? `${job.position} at ${job.company} | Jobs` : "Application" };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = await prisma.jobApplication.findUnique({ where: { id } });
  if (!job) notFound();

  // Build status timeline
  const statusIndex = JOB_STATUSES.indexOf(job.status as typeof JOB_STATUSES[number]);
  const activeStatuses = JOB_STATUSES.slice(0, Math.min(statusIndex + 1, JOB_STATUSES.length));

  return (
    <AppShell title="Application Detail">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm mb-6 transition-all"
          style={{ color: "var(--muted)" }}
        >
          <ArrowLeft size={16} />
          Back to Applications
        </Link>

        <div
          className="rounded-2xl p-8"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <JobStatusBadge status={job.status} size="md" />
              <h1 className="text-2xl font-bold mt-3" style={{ color: "var(--foreground)" }}>
                {job.position}
              </h1>
              <p className="text-lg mt-1" style={{ color: "var(--muted)" }}>{job.company}</p>
            </div>
            {job.jobUrl && (
              <a
                href={job.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                <ExternalLink size={15} />
                Job Listing
              </a>
            )}
          </div>

          {/* Status Timeline */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--muted)" }}>
              Application Progress
            </p>
            <div className="flex items-center gap-1 flex-wrap">
              {JOB_STATUSES.filter((s) => !["Offer", "Rejected", "Withdrawn"].includes(s)).map((s, i, arr) => {
                const isPast = activeStatuses.includes(s);
                const isCurrent = s === job.status;
                return (
                  <div key={s} className="flex items-center gap-1">
                    <span
                      className="text-xs px-2 py-1 rounded-lg font-medium"
                      style={{
                        background: isCurrent ? "var(--accent)" : isPast ? "rgba(99,102,241,0.15)" : "var(--muted-bg)",
                        color: isCurrent ? "#fff" : isPast ? "var(--accent)" : "var(--muted)",
                        border: `1px solid ${isCurrent ? "var(--accent)" : isPast ? "rgba(99,102,241,0.3)" : "var(--border)"}`,
                      }}
                    >
                      {s}
                    </span>
                    {i < arr.length - 1 && (
                      <span style={{ color: isPast ? "var(--accent)" : "var(--border)" }}>→</span>
                    )}
                  </div>
                );
              })}
              {["Offer", "Rejected", "Withdrawn"].includes(job.status) && (
                <>
                  <span style={{ color: "var(--muted)" }}>→</span>
                  <JobStatusBadge status={job.status} />
                </>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--muted-bg)" }}>
              <Calendar size={16} style={{ color: "var(--muted)" }} />
              <div>
                <p className="text-xs" style={{ color: "var(--muted)" }}>Applied Date</p>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{formatDate(job.appliedDate)}</p>
              </div>
            </div>

            {job.followUpDate && (
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--muted-bg)" }}>
                <Calendar size={16} style={{ color: "var(--muted)" }} />
                <div>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>Follow-up Date</p>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{formatDate(job.followUpDate)}</p>
                </div>
              </div>
            )}

            {job.salary && (
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--muted-bg)" }}>
                <DollarSign size={16} style={{ color: "var(--muted)" }} />
                <div>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>Salary (CTC)</p>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{job.salary}</p>
                </div>
              </div>
            )}

            {job.source && (
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--muted-bg)" }}>
                <ExternalLink size={16} style={{ color: "var(--muted)" }} />
                <div>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>Source</p>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{job.source}</p>
                </div>
              </div>
            )}

            {job.hrName && (
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--muted-bg)" }}>
                <User size={16} style={{ color: "var(--muted)" }} />
                <div>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>HR Contact</p>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{job.hrName}</p>
                  {job.hrContact && <p className="text-xs" style={{ color: "var(--muted)" }}>{job.hrContact}</p>}
                </div>
              </div>
            )}

            {job.resumeVersion && (
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--muted-bg)" }}>
                <FileText size={16} style={{ color: "var(--muted)" }} />
                <div>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>Resume Version</p>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{job.resumeVersion}</p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {job.notes && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <StickyNote size={14} style={{ color: "var(--muted)" }} />
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Notes</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)" }}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
                  {job.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
