import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "var(--muted-bg)", border: "1px solid var(--border)" }}
      >
        <Icon size={28} style={{ color: "var(--muted)" }} />
      </div>
      <h3 className="text-base font-semibold mb-1" style={{ color: "var(--foreground)" }}>
        {title}
      </h3>
      <p className="text-sm mb-6 max-w-sm" style={{ color: "var(--muted)" }}>
        {description}
      </p>
      {action}
    </div>
  );
}
