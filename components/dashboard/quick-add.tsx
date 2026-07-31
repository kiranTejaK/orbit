"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ResourceForm } from "@/components/resources/resource-form";
import { JobForm } from "@/components/jobs/job-form";
import type { CreateResourceInput, CreateJobInput } from "@/lib/validations";
import { parseTags } from "@/lib/validations";

export function QuickAdd() {
  const [resourceFormOpen, setResourceFormOpen] = useState(false);
  const [jobFormOpen, setJobFormOpen] = useState(false);

  const handleAddResource = async (data: CreateResourceInput) => {
    const res = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, tags: parseTags(data.tags) }),
    });
    if (!res.ok) throw new Error("Failed to add resource");
    toast.success("Resource added!");
    setResourceFormOpen(false);
  };

  const handleAddJob = async (data: CreateJobInput) => {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add application");
    toast.success("Application added!");
    setJobFormOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          id="quick-add-resource"
          onClick={() => setResourceFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            boxShadow: "0 4px 15px rgba(99,102,241,0.3)",
          }}
        >
          <Plus size={16} />
          Add Resource
        </button>
        <button
          id="quick-add-job"
          onClick={() => setJobFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, #06b6d4, #0891b2)",
            color: "#fff",
            boxShadow: "0 4px 15px rgba(6,182,212,0.3)",
          }}
        >
          <Plus size={16} />
          Add Application
        </button>
      </div>

      <ResourceForm
        open={resourceFormOpen}
        onClose={() => setResourceFormOpen(false)}
        onSubmit={handleAddResource}
        mode="create"
      />
      <JobForm
        open={jobFormOpen}
        onClose={() => setJobFormOpen(false)}
        onSubmit={handleAddJob}
        mode="create"
      />
    </>
  );
}
