"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
      style={{
        background: "var(--background)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
          {title}
        </h1>
        {description && (
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
          style={{
            background: "var(--muted-bg)",
            color: "var(--muted)",
            border: "1px solid var(--border)",
          }}
          title="Toggle theme"
          aria-label="Toggle dark/light mode"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
          style={{
            background: "var(--muted-bg)",
            color: "var(--muted)",
            border: "1px solid var(--border)",
          }}
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
