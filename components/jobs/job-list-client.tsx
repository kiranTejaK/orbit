"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Briefcase, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { JobApplication } from "@/types";
import { useJobs } from "@/hooks/use-jobs";
import { useDebounce } from "@/hooks/use-debounce";
import { JobForm } from "./job-form";
import { JobFilters } from "./job-filters";
import { JobStatusBadge } from "./job-status-badge";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { TableRowSkeleton } from "@/components/shared/loading-skeleton";
import { formatDate } from "@/utils/format";
import type { CreateJobInput } from "@/lib/validations";

export function JobListClient() {
  const { jobs, meta, loading, fetchJobs, createJob, updateJob, deleteJob } = useJobs();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editJob, setEditJob] = useState<JobApplication | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | undefined>();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  const load = useCallback(() => {
    fetchJobs({ q: debouncedSearch, status, sort, page });
  }, [debouncedSearch, status, sort, page, fetchJobs]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [debouncedSearch, status, sort]);

  const handleCreate = async (data: CreateJobInput) => {
    try {
      await createJob({
        ...data,
        jobUrl: data.jobUrl || undefined,
        followUpDate: data.followUpDate || undefined,
      });
      toast.success("Application added!");
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleEdit = async (data: CreateJobInput) => {
    if (!editJob) return;
    try {
      await updateJob(editJob.id, {
        ...data,
        jobUrl: data.jobUrl || undefined,
        followUpDate: data.followUpDate || undefined,
      });
      toast.success("Application updated!");
      setEditJob(undefined);
      load();
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteJob(deleteTarget.id);
      toast.success("Application deleted");
      setDeleteTarget(undefined);
      load();
    } catch (err) {
      toast.error(String(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <SearchInput
              id="job-search"
              value={search}
              onChange={setSearch}
              placeholder="Search by company, position, notes…"
            />
          </div>
          <button
            id="add-job-btn"
            onClick={() => { setEditJob(undefined); setFormOpen(true); }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl text-sm font-semibold transition-all min-h-[40px] sm:min-h-[36px]"
            style={{
              background: "var(--accent)",
              color: "#fff",
              boxShadow: "0 0 20px rgba(99,102,241,0.3)",
            }}
          >
            <Plus size={16} />
            Add Application
          </button>
        </div>
        <JobFilters
          status={status}
          sort={sort}
          onStatusChange={setStatus}
          onSortChange={setSort}
        />
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-x-auto w-full"
        style={{ border: "1px solid var(--border)" }}
      >
        <table className="w-full min-w-[680px]">
          <thead>
            <tr style={{ background: "var(--muted-bg)", borderBottom: "1px solid var(--border)" }}>
              {["Company", "Position", "Status", "Applied", "Follow-up", "Source", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--muted)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-0">
                  <EmptyState
                    icon={Briefcase}
                    title="No applications found"
                    description={search || status ? "Try adjusting your filters." : "Start tracking your job search journey."}
                    action={
                      <button
                        onClick={() => { setEditJob(undefined); setFormOpen(true); }}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold min-h-[44px]"
                        style={{ background: "var(--accent)", color: "#fff" }}
                      >
                        Add your first application
                      </button>
                    }
                  />
                </td>
              </tr>
            ) : (
              jobs.map((job, i) => (
                <tr
                  key={job.id}
                  style={{
                    background: i % 2 === 0 ? "var(--card-bg)" : "var(--muted-bg)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="font-semibold text-sm hover:underline"
                      style={{ color: "var(--foreground)" }}
                    >
                      {job.company}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: "var(--muted)" }}>
                    {job.position}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <JobStatusBadge status={job.status} />
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--muted)" }}>
                    {formatDate(job.appliedDate)}
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--muted)" }}>
                    {job.followUpDate ? formatDate(job.followUpDate) : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--muted)" }}>
                    {job.source || "—"}
                    {job.jobUrl && (
                      <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex" style={{ color: "var(--accent)" }}>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditJob(job); setFormOpen(true); }}
                        className="text-xs px-2.5 py-1.5 rounded-lg font-medium"
                        style={{ background: "var(--muted-bg)", color: "var(--foreground)", border: "1px solid var(--border)" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(job)}
                        className="text-xs px-2.5 py-1.5 rounded-lg font-medium"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
                      >
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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

      <JobForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditJob(undefined); }}
        onSubmit={editJob ? handleEdit : handleCreate}
        initialData={editJob}
        mode={editJob ? "edit" : "create"}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Application"
        description={`Delete application for "${deleteTarget?.position}" at "${deleteTarget?.company}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(undefined)}
        loading={deleteLoading}
      />
    </>
  );
}
