import { RESOURCE_TYPES_COLORS } from "@/lib/constants";

interface ResourceTypeBadgeProps {
  type: string;
  size?: "sm" | "md";
}

export function ResourceTypeBadge({ type, size = "sm" }: ResourceTypeBadgeProps) {
  const colorClass = RESOURCE_TYPES_COLORS[type] ?? RESOURCE_TYPES_COLORS["Other"];
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}
      title={`Format: ${type}`}
    >
      {type}
    </span>
  );
}
