import Link from "next/link";
import { Briefcase } from "lucide-react";
import { JobApplication } from "@/types";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";
import { formatDate, formatRelative } from "@/utils/format";

interface RecentApplicationsProps {
  jobs: JobApplication[];
}

export function RecentApplications({ jobs }: RecentApplicationsProps) {
  if (jobs.length === 0) {
    return (
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
      >
        <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--foreground)" }}>
          Recent Applications
        </h3>
        <div className="flex flex-col items-center py-8" style={{ color: "var(--muted)" }}>
          <Briefcase size={28} className="mb-2 opacity-40" />
          <p className="text-sm">No applications yet</p>
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
          Recent Applications
        </h3>
        <Link href="/jobs" className="text-xs transition-all" style={{ color: "var(--accent)" }}>
          View all →
        </Link>
      </div>
      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-start gap-3 py-2"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div className="flex-1 min-w-0">
              <Link
                href={`/jobs/${job.id}`}
                className="text-sm font-semibold hover:underline"
                style={{ color: "var(--foreground)" }}
              >
                {job.company}
              </Link>
              <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--muted)" }}>
                {job.position}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Applied {formatDate(job.appliedDate)} · {formatRelative(job.createdAt)}
              </p>
            </div>
            <JobStatusBadge status={job.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
