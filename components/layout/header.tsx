"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, LogOut, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSidebar } from "./sidebar-context";

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { toggleMobile } = useSidebar();

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3.5"
      style={{
        background: "var(--background)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger Menu Button for Mobile & Tablet */}
        <button
          onClick={toggleMobile}
          className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
          style={{
            background: "var(--muted-bg)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          }}
          title="Open menu"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>

        <div className="truncate">
          <h1 className="text-lg sm:text-xl font-bold truncate" style={{ color: "var(--foreground)" }}>
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm mt-0.5 truncate hidden sm:block" style={{ color: "var(--muted)" }}>
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all"
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
          className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all"
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
