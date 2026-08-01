"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  isMobileOpen: boolean;
  toggleMobile: () => void;
  setMobileOpen: (open: boolean) => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "sidebar_collapsed";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Load initial collapsed state from localStorage on client side
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored !== null) {
        setIsCollapsed(stored === "true");
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, String(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const toggleMobile = () => setIsMobileOpen((prev) => !prev);
  const setMobileOpen = (open: boolean) => setIsMobileOpen(open);
  const closeMobile = () => setIsMobileOpen(false);

  // Lock body scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleCollapsed,
        isMobileOpen,
        toggleMobile,
        setMobileOpen,
        closeMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
