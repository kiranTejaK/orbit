"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookMarked,
  Briefcase,
  CalendarCheck,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useSidebar } from "./sidebar-context";
import { OrbitIcon } from "@/components/shared/orbit-logo";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Daily Planner",
    href: "/planner",
    icon: CalendarCheck,
  },
  {
    label: "Resources",
    href: "/resources",
    icon: BookMarked,
  },
  {
    label: "Career",
    href: "/career",
    icon: Briefcase,
  },
];


export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed, isMobileOpen, closeMobile } = useSidebar();

  const renderNavLinks = (collapsed: boolean, isMobile: boolean = false) => {
    return navItems.map((item) => {
      const isActive =
        item.href === "/"
          ? pathname === "/"
          : pathname.startsWith(item.href);
      const Icon = item.icon;

      const linkContent = (
        <Link
          key={item.href}
          href={item.href}
          onClick={isMobile ? closeMobile : undefined}
          className={`flex items-center ${
            collapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-2.5"
          } rounded-lg text-sm font-medium transition-all group ${
            isActive ? "sidebar-link-active" : ""
          }`}
          style={
            isActive
              ? {}
              : {
                  color: "rgba(148,163,184,0.75)",
                }
          }
          onMouseEnter={(e) => {
            if (!isActive) {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              (e.currentTarget as HTMLElement).style.background = "";
              (e.currentTarget as HTMLElement).style.color =
                "rgba(148,163,184,0.75)";
            }
          }}
          aria-label={collapsed ? item.label : undefined}
        >
          <Icon
            size={18}
            className={isActive ? "text-indigo-400 flex-shrink-0" : "flex-shrink-0"}
          />
          {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
          {!collapsed && isActive && (
            <ChevronRight size={14} className="text-indigo-400 opacity-60 flex-shrink-0" />
          )}
        </Link>
      );

      if (collapsed) {
        return (
          <Tooltip.Root key={item.href}>
            <Tooltip.Trigger asChild>{linkContent}</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="right"
                sideOffset={12}
                className="z-50 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95"
                style={{
                  background: "var(--card-bg)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                {item.label}
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        );
      }

      return linkContent;
    });
  };

  return (
    <>
      {/* Desktop Sidebar (hidden on screens < lg) */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 h-full flex-col z-30 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
        style={{
          background: "var(--sidebar-bg)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Header & Logo */}
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center px-2" : "justify-between px-5"
          } py-5`}
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <OrbitIcon size={32} />
            {!isCollapsed && (
              <div className="truncate">
                <p className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  Orbit
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    PRO
                  </span>
                </p>
                <p className="text-[11px]" style={{ color: "rgba(148,163,184,0.7)" }}>
                  Daily Planner & Hub
                </p>
              </div>
            )}
          </Link>


          {/* Collapse Toggle Button */}
          {!isCollapsed && (
            <button
              onClick={toggleCollapsed}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: "rgba(148,163,184,0.7)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 ${isCollapsed ? "px-3 py-6 space-y-2" : "px-3 py-6 space-y-1"}`}>
          {!isCollapsed && (
            <p
              className="text-xs font-semibold uppercase tracking-widest px-3 mb-4"
              style={{ color: "rgba(148,163,184,0.5)" }}
            >
              Navigation
            </p>
          )}
          {renderNavLinks(isCollapsed)}
        </nav>

        {/* Collapsed Toggle Button (when collapsed) */}
        {isCollapsed && (
          <div className="px-3 py-3 flex justify-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={toggleCollapsed}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: "rgba(148,163,184,0.7)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Footer (when expanded) */}
        {!isCollapsed && (
          <div
            className="px-6 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs" style={{ color: "rgba(148,163,184,0.4)" }}>
              Personal use only
            </p>
          </div>
        )}
      </aside>

      {/* Mobile Drawer (visible on screens < lg when open) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMobile}
            aria-hidden="true"
          />

          {/* Slide-in Drawer Container */}
          <aside
            className="relative w-72 max-w-[85vw] flex flex-col h-full z-50 shadow-2xl transition-transform duration-300 ease-out"
            style={{
              background: "var(--sidebar-bg)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <OrbitIcon size={32} />
                <div>
                  <p className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                    Orbit
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      PRO
                    </span>
                  </p>
                  <p className="text-[11px]" style={{ color: "rgba(148,163,184,0.7)" }}>
                    Daily Planner & Hub
                  </p>
                </div>
              </div>

              <button
                onClick={closeMobile}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(148,163,184,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              <p
                className="text-xs font-semibold uppercase tracking-widest px-3 mb-4"
                style={{ color: "rgba(148,163,184,0.5)" }}
              >
                Navigation
              </p>
              {renderNavLinks(false, true)}
            </nav>

            {/* Footer */}
            <div
              className="px-6 py-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-xs" style={{ color: "rgba(148,163,184,0.4)" }}>
                Personal use only
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
