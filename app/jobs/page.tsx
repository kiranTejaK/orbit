import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { JobListClient } from "@/components/jobs/job-list-client";

export const metadata: Metadata = {
  title: "Job Applications | Productivity Hub",
  description: "Track your job applications and interview progress",
};

export default function JobsPage() {
  return (
    <AppShell
      title="Job Application Tracker"
      description="Track every application and interview process"
    >
      <JobListClient />
    </AppShell>
  );
}
