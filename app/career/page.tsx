import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { JobListClient } from "@/components/jobs/job-list-client";

export const metadata: Metadata = {
  title: "Career Tracker | Orbit",
  description: "Track your career applications, interview stages, and offers.",
};

export default function CareerPage() {
  return (
    <AppShell
      title="Career Tracker"
      description="Track every career application and interview process with Orbit"
    >
      <JobListClient />
    </AppShell>
  );
}
