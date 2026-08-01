"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useSidebar } from "./sidebar-context";

interface AppShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AppShell({ title, description, children }: AppShellProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col transition-[margin-left] duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        } ml-0 min-w-0`}
      >
        <Header title={title} description={description} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
