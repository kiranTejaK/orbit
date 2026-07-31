import { JOB_STATUS_COLORS } from "@/lib/constants";

interface JobStatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function JobStatusBadge({ status, size = "sm" }: JobStatusBadgeProps) {
  const colorClass = JOB_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}>
      {status}
    </span>
  );
}
