import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { ResourceListClient } from "@/components/resources/resource-list-client";

export const metadata: Metadata = {
  title: "Resources | Orbit",
  description: "Browse and manage your Orbit resource library",
};


export default function ResourcesPage() {
  return (
    <AppShell
      title="Resource Hub"
      description="Your searchable collection of useful resources"
    >
      <ResourceListClient />
    </AppShell>
  );
}
