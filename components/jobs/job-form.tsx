"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { JobApplication } from "@/types";
import { createJobSchema, type CreateJobInput } from "@/lib/validations";
import { JOB_STATUSES } from "@/lib/constants";
import { formatDateInput } from "@/utils/format";

interface JobFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJobInput) => Promise<void>;
  initialData?: Partial<JobApplication>;
  mode: "create" | "edit";
}

const inputStyle = {
  background: "var(--muted-bg)",
  color: "var(--foreground)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  padding: "10px 12px",
  fontSize: "14px",
  width: "100%",
  outline: "none",
  minHeight: "44px",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  marginBottom: "6px",
  color: "var(--muted)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

export function JobForm({ open, onClose, onSubmit, initialData, mode }: JobFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobInput>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      company: "",
      position: "",
      source: "",
      jobUrl: "",
      appliedDate: new Date().toISOString().split("T")[0],
      status: "Applied",
      salary: "",
      hrName: "",
      hrContact: "",
      followUpDate: "",
      resumeVersion: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (initialData && open) {
      reset({
        company: initialData.company ?? "",
        position: initialData.position ?? "",
        source: initialData.source ?? "",
        jobUrl: initialData.jobUrl ?? "",
        appliedDate: initialData.appliedDate ? formatDateInput(initialData.appliedDate) : new Date().toISOString().split("T")[0],
        status: (initialData.status as CreateJobInput["status"]) ?? "Applied",
        salary: initialData.salary ?? "",
        hrName: initialData.hrName ?? "",
        hrContact: initialData.hrContact ?? "",
        followUpDate: initialData.followUpDate ? formatDateInput(initialData.followUpDate) : "",
        resumeVersion: initialData.resumeVersion ?? "",
        notes: initialData.notes ?? "",
      });
    } else if (!initialData && open) {
      reset();
    }
  }, [initialData, open, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="fixed inset-0"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] my-auto z-10 overflow-hidden"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
            {mode === "create" ? "Add Application" : "Edit Application"}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all"
            style={{ color: "var(--muted)", background: "var(--muted-bg)" }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col min-h-0 flex-1">
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Company + Position */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Company *</label>
                <input {...register("company")} style={inputStyle} placeholder="Company name" />
                {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Position *</label>
                <input {...register("position")} style={inputStyle} placeholder="Job title" />
                {errors.position && <p className="mt-1 text-xs text-red-500">{errors.position.message}</p>}
              </div>
            </div>

            {/* Status + Applied Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Status</label>
                <select {...register("status")} style={inputStyle}>
                  {JOB_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Applied Date *</label>
                <input type="date" {...register("appliedDate")} style={inputStyle} />
                {errors.appliedDate && <p className="mt-1 text-xs text-red-500">{errors.appliedDate.message}</p>}
              </div>
            </div>

            {/* Job URL + Source */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Job URL</label>
                <input {...register("jobUrl")} style={inputStyle} placeholder="https://…" />
                {errors.jobUrl && <p className="mt-1 text-xs text-red-500">{errors.jobUrl.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Source</label>
                <input {...register("source")} style={inputStyle} placeholder="LinkedIn, Naukri…" />
              </div>
            </div>

            {/* Salary + Resume Version */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Salary (CTC)</label>
                <input {...register("salary")} style={inputStyle} placeholder="e.g. 12 LPA" />
              </div>
              <div>
                <label style={labelStyle}>Resume Version</label>
                <input {...register("resumeVersion")} style={inputStyle} placeholder="v3.0" />
              </div>
            </div>

            {/* HR Name + Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>HR Name</label>
                <input {...register("hrName")} style={inputStyle} placeholder="HR contact name" />
              </div>
              <div>
                <label style={labelStyle}>HR Contact</label>
                <input {...register("hrContact")} style={inputStyle} placeholder="Email or phone" />
              </div>
            </div>

            {/* Follow Up Date */}
            <div>
              <label style={labelStyle}>Follow-up Date</label>
              <input type="date" {...register("followUpDate")} style={inputStyle} />
            </div>

            {/* Notes */}
            <div>
              <label style={labelStyle}>Notes</label>
              <textarea
                {...register("notes")}
                style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
                placeholder="Interview experience, feedback, next steps…"
              />
            </div>
          </div>

          <div
            className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-4 sm:px-6 py-4 flex-shrink-0"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium w-full sm:w-auto min-h-[44px]"
              style={{ background: "var(--muted-bg)", color: "var(--foreground)", border: "1px solid var(--border)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all w-full sm:w-auto min-h-[44px]"
              style={{ background: "var(--accent)", color: "#fff", opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? "Saving…" : mode === "create" ? "Add Application" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
