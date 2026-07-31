import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import {
  BookMarked,
  Briefcase,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentResources } from "@/components/dashboard/recent-resources";
import { RecentApplications } from "@/components/dashboard/recent-applications";
import { QuickAdd } from "@/components/dashboard/quick-add";
import prisma from "@/lib/prisma";
import { ACTIVE_JOB_STATUSES, INTERVIEWING_STATUSES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Dashboard | Productivity Hub",
};

async function getDashboardData() {
  const [
    totalResources,
    favoriteResources,
    totalJobs,
    activeJobs,
    interviewingJobs,
    offerJobs,
    rejectedJobs,
    recentResources,
    favoriteResourcesList,
    recentJobs,
  ] = await Promise.all([
    prisma.resource.count(),
    prisma.resource.count({ where: { favorite: true } }),
    prisma.jobApplication.count(),
    prisma.jobApplication.count({ where: { status: { in: ACTIVE_JOB_STATUSES } } }),
    prisma.jobApplication.count({ where: { status: { in: INTERVIEWING_STATUSES } } }),
    prisma.jobApplication.count({ where: { status: "Offer" } }),
    prisma.jobApplication.count({ where: { status: "Rejected" } }),
    prisma.resource.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.resource.findMany({ where: { favorite: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.jobApplication.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return {
    totalResources,
    favoriteResources,
    totalJobs,
    activeJobs,
    interviewingJobs,
    offerJobs,
    rejectedJobs,
    recentResources: recentResources.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
    favoriteResourcesList: favoriteResourcesList.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
    recentJobs: recentJobs.map((j) => ({
      ...j,
      appliedDate: j.appliedDate.toISOString(),
      followUpDate: j.followUpDate?.toISOString() ?? null,
      createdAt: j.createdAt.toISOString(),
      updatedAt: j.updatedAt.toISOString(),
    })),
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <AppShell
      title="Dashboard"
      description="Welcome back — here's your productivity overview"
    >
      {/* Quick Add */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Quick Actions
          </h2>
        </div>
        <QuickAdd />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard
          label="Resources"
          value={data.totalResources}
          icon={BookMarked}
          color="#6366f1"
          subLabel={`${data.favoriteResources} favorites`}
        />
        <StatsCard
          label="Applications"
          value={data.totalJobs}
          icon={Briefcase}
          color="#06b6d4"
        />
        <StatsCard
          label="Active"
          value={data.activeJobs}
          icon={TrendingUp}
          color="#f59e0b"
        />
        <StatsCard
          label="Offers"
          value={data.offerJobs}
          icon={CheckCircle}
          color="#10b981"
        />
        <StatsCard
          label="Rejected"
          value={data.rejectedJobs}
          icon={XCircle}
          color="#ef4444"
        />
      </div>

      {/* Recent content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <RecentResources
            resources={data.recentResources}
            title="Recent Resources"
          />
        </div>
        <div className="lg:col-span-1">
          <RecentResources
            resources={data.favoriteResourcesList}
            title="Favorite Resources"
            showFavoriteIcon
          />
        </div>
        <div className="lg:col-span-1">
          <RecentApplications jobs={data.recentJobs} />
        </div>
      </div>
    </AppShell>
  );
}
