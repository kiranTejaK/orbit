"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Resource } from "@/types";
import { createResourceSchema, type CreateResourceInput } from "@/lib/validations";
import { RESOURCE_TYPES, RESOURCE_CATEGORIES } from "@/lib/constants";

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
      resourceType: "Website",
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
        resourceType: (initialData.resourceType as CreateResourceInput["resourceType"]) ?? "Website",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
            {mode === "create" ? "Add Resource" : "Edit Resource"}
          </h2>
          <button onClick={onClose} style={{ color: "var(--muted)" }} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="overflow-y-auto">
          <div className="p-6 space-y-4">
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

            {/* Type + Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Resource Type *</label>
                <select {...register("resourceType")} style={inputStyle}>
                  {RESOURCE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.resourceType && (
                  <p className="mt-1 text-xs text-red-500">{errors.resourceType.message}</p>
                )}
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select {...register("category")} style={inputStyle}>
                  <option value="">None</option>
                  {RESOURCE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
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
            <div className="grid grid-cols-2 gap-4">
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
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="resource-favorite"
                {...register("favorite")}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="resource-favorite" className="text-sm" style={{ color: "var(--foreground)" }}>
                Mark as favorite
              </label>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex justify-end gap-3 px-6 py-4 flex-shrink-0"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: "var(--muted-bg)", color: "var(--foreground)", border: "1px solid var(--border)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
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
