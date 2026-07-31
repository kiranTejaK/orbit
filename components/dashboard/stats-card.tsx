import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  subLabel?: string;
}

export function StatsCard({ label, value, icon: Icon, color, subLabel }: StatsCardProps) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3 hover-lift"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            {label}
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: "var(--foreground)" }}>
            {value}
          </p>
          {subLabel && (
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              {subLabel}
            </p>
          )}
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  );
}
