"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmLabel?: string;
}

export function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  loading = false,
  confirmLabel = "Delete",
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onCancel}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div
        className="relative w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl z-10 my-auto"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
        }}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl transition-all"
          style={{ color: "var(--muted)", background: "var(--muted-bg)" }}
          aria-label="Close dialog"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-4 pr-6">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(239,68,68,0.1)" }}
          >
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <h2
              className="text-base font-semibold mb-1"
              style={{ color: "var(--foreground)" }}
            >
              {title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 mt-6 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full sm:w-auto min-h-[44px]"
            style={{
              background: "var(--muted-bg)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full sm:w-auto min-h-[44px]"
            style={{
              background: "#ef4444",
              color: "#ffffff",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
