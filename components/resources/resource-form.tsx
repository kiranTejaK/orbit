"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, HelpCircle } from "lucide-react";
import { Resource } from "@/types";
import { createResourceSchema, type CreateResourceInput } from "@/lib/validations";
import {
  RESOURCE_TYPES,
  RESOURCE_CATEGORIES,
  PRIMARY_RESOURCE_TYPES,
  PRIMARY_RESOURCE_CATEGORIES,
} from "@/lib/constants";

interface ResourceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateResourceInput) => Promise<void>;
  initialData?: Partial<Resource>;
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

export function ResourceForm({ open, onClose, onSubmit, initialData, mode }: ResourceFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateResourceInput>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: {
      title: "",
      resourceType: "Documentation",
      url: "",
      description: "",
      personalNotes: "",
      category: "",
      tags: "",
      source: "",
      favorite: false,
    },
  });

  useEffect(() => {
    if (initialData && open) {
      reset({
        title: initialData.title ?? "",
        resourceType: (initialData.resourceType as CreateResourceInput["resourceType"]) ?? "Documentation",
        url: initialData.url ?? "",
        description: initialData.description ?? "",
        personalNotes: initialData.personalNotes ?? "",
        category: initialData.category ?? "",
        tags: initialData.tags?.join(", ") ?? "",
        source: initialData.source ?? "",
        favorite: initialData.favorite ?? false,
      });
    } else if (!initialData && open) {
      reset();
    }
  }, [initialData, open, reset]);

  if (!open) return null;

  const onFormSubmit = async (data: CreateResourceInput) => {
    await onSubmit(data);
  };

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
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
            {mode === "create" ? "Add Resource" : "Edit Resource"}
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

        {/* Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col min-h-0 flex-1">
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Info / Boundary Guide Callout */}
            <div
              className="p-3 rounded-xl flex items-start gap-2.5 text-xs"
              style={{
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.2)",
                color: "var(--foreground)",
              }}
            >
              <HelpCircle size={16} className="mt-0.5 flex-shrink-0 text-indigo-500 dark:text-indigo-400" />
              <div>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Classification Guide:</span>
                <ul className="mt-1 space-y-0.5 text-muted-foreground" style={{ color: "var(--muted)" }}>
                  <li>• <strong>Format</strong> = How this resource is delivered or consumed (e.g. Documentation, Video, Tool, E-Book)</li>
                  <li>• <strong>Topic</strong> = What this resource is about (e.g. Frontend Development, AI/ML, System Design)</li>
                </ul>
              </div>
            </div>

            {/* Title */}
            <div>
              <label style={labelStyle}>Title *</label>
              <input {...register("title")} style={inputStyle} placeholder="Resource title" />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* URL */}
            <div>
              <label style={labelStyle}>URL *</label>
              <input {...register("url")} style={inputStyle} placeholder="https://…" />
              {errors.url && (
                <p className="mt-1 text-xs text-red-500">{errors.url.message}</p>
              )}
            </div>

            {/* Format + Topic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Format *</label>
                <select {...register("resourceType")} style={inputStyle}>
                  {PRIMARY_RESOURCE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                  {/* Option for legacy value if set */}
                  {initialData?.resourceType &&
                    !PRIMARY_RESOURCE_TYPES.includes(initialData.resourceType as any) &&
                    RESOURCE_TYPES.includes(initialData.resourceType as any) && (
                      <option value={initialData.resourceType}>
                        {initialData.resourceType} (Legacy)
                      </option>
                    )}
                </select>
                <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                  How this resource is delivered or consumed.
                </p>
                {errors.resourceType && (
                  <p className="mt-1 text-xs text-red-500">{errors.resourceType.message}</p>
                )}
              </div>
              <div>
                <label style={labelStyle}>Topic</label>
                <select {...register("category")} style={inputStyle}>
                  <option value="">None (Unassigned)</option>
                  {PRIMARY_RESOURCE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  {/* Option for legacy category if set */}
                  {initialData?.category &&
                    !PRIMARY_RESOURCE_CATEGORIES.includes(initialData.category as any) &&
                    RESOURCE_CATEGORIES.includes(initialData.category as any) && (
                      <option value={initialData.category}>
                        {initialData.category} (Legacy)
                      </option>
                    )}
                </select>
                <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                  What this resource is about.
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                {...register("description")}
                style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
                placeholder="Brief description…"
              />
            </div>

            {/* Notes */}
            <div>
              <label style={labelStyle}>Personal Notes</label>
              <textarea
                {...register("personalNotes")}
                style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
                placeholder="Your notes, why you saved this…"
              />
            </div>

            {/* Tags + Source */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Tags (comma-separated)</label>
                <input {...register("tags")} style={inputStyle} placeholder="react, typescript, ai" />
              </div>
              <div>
                <label style={labelStyle}>Source</label>
                <input {...register("source")} style={inputStyle} placeholder="Where you found this" />
              </div>
            </div>

            {/* Favorite */}
            <div className="flex items-center gap-3 py-1">
              <input
                type="checkbox"
                id="resource-favorite"
                {...register("favorite")}
                className="w-5 h-5 rounded accent-indigo-600"
              />
              <label htmlFor="resource-favorite" className="text-sm font-medium cursor-pointer" style={{ color: "var(--foreground)" }}>
                Mark as favorite
              </label>
            </div>
          </div>

          {/* Footer */}
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
              style={{
                background: "var(--accent)",
                color: "#fff",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Saving…" : mode === "create" ? "Add Resource" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
