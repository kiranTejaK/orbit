"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { JobApplication } from "@/types";
import { JobForm } from "./job-form";
import { useJobs } from "@/hooks/use-jobs";
import type { CreateJobInput } from "@/lib/validations";

interface JobDetailActionsProps {
  job: JobApplication;
}

export function JobDetailActions({ job }: JobDetailActionsProps) {
  const router = useRouter();
  const { updateJob } = useJobs();
  const [formOpen, setFormOpen] = useState(false);

  const handleEdit = async (data: CreateJobInput) => {
    try {
      await updateJob(job.id, {
        ...data,
        jobUrl: data.jobUrl || undefined,
        followUpDate: data.followUpDate || undefined,
        location: data.location || undefined,
        description: data.description || undefined,
      });
      toast.success("Application updated!");
      setFormOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(String(err));
    }
  };

  return (
    <>
      <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold flex-1 sm:flex-none min-h-[44px] transition-all"
          style={{
            background: "var(--muted-bg)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          }}
        >
          <Pencil size={15} />
          Edit Details
        </button>

        {job.jobUrl && (
          <a
            href={job.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold flex-1 sm:flex-none min-h-[44px] transition-all"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            <ExternalLink size={15} />
            Job Listing
          </a>
        )}
      </div>

      <JobForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleEdit}
        initialData={job}
        mode="edit"
      />
    </>
  );
}
