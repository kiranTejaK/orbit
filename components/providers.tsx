"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SidebarProvider } from "@/components/layout/sidebar-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <TooltipProvider delayDuration={200}>
          <SidebarProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                style: {
                  fontFamily: "var(--font-sans)",
                },
              }}
            />
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
