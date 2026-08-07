import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import {
  BookMarked,
  Briefcase,
  TrendingUp,
  CheckCircle,
  CalendarCheck,
  CheckSquare,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentResources } from "@/components/dashboard/recent-resources";
import { RecentApplications } from "@/components/dashboard/recent-applications";
import { QuickAdd } from "@/components/dashboard/quick-add";
import { PlannerWidget } from "@/components/dashboard/planner-widget";
import { MiniCalendar } from "@/components/dashboard/mini-calendar";
import prisma from "@/lib/prisma";
import { ACTIVE_JOB_STATUSES, INTERVIEWING_STATUSES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Dashboard | Orbit",
  description: "Orbit — Personal Daily Planner, Knowledge Base & Career Management Dashboard",
};

async function getDashboardData() {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const todayStart = new Date(`${todayStr}T00:00:00.000Z`);
  const todayEnd = new Date(`${todayStr}T23:59:59.999Z`);

  const [
    totalResources,
    favoriteResources,
    totalJobs,
    activeJobs,
    offerJobs,
    recentResources,
    favoriteResourcesList,
    recentJobs,
    todayTodos,
    todayCompletedCount,
    overdueCount,
    upcomingCount,
  ] = await Promise.all([
    prisma.resource.count(),
    prisma.resource.count({ where: { favorite: true } }),
    prisma.jobApplication.count(),
    prisma.jobApplication.count({ where: { status: { in: ACTIVE_JOB_STATUSES } } }),
    prisma.jobApplication.count({ where: { status: "Offer" } }),
    prisma.resource.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.resource.findMany({ where: { favorite: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.jobApplication.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.todo.findMany({
      where: {
        dueDate: { gte: todayStart, lte: todayEnd },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.todo.count({
      where: {
        status: "COMPLETED",
        completedAt: { gte: todayStart, lte: todayEnd },
      },
    }),
    prisma.todo.count({
      where: {
        dueDate: { lt: todayStart },
        status: { not: "COMPLETED" },
      },
    }),
    prisma.todo.count({
      where: {
        dueDate: { gt: todayEnd },
        status: { not: "COMPLETED" },
      },
    }),
  ]);

  return {
    totalResources,
    favoriteResources,
    totalJobs,
    activeJobs,
    offerJobs,
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
    todayTodos: todayTodos.map((t) => ({
      ...t,
      dueDate: t.dueDate?.toISOString() ?? null,
      startDate: t.startDate?.toISOString() ?? null,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      completedAt: t.completedAt?.toISOString() ?? null,
    })),
    plannerStats: {
      todayTotal: todayTodos.length,
      todayCompleted: todayCompletedCount,
      overdueTotal: overdueCount,
      upcomingTotal: upcomingCount,
    },
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <AppShell
      title="Dashboard"
      description="Welcome to Orbit — your daily momentum & knowledge hub"
    >
      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Quick Actions
          </h2>
        </div>
        <QuickAdd />
      </div>

      {/* Primary Key Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        <StatsCard
          label="Today's Tasks"
          value={data.plannerStats.todayTotal}
          icon={CalendarCheck}
          color="#6366f1"
          subLabel={`${data.plannerStats.todayCompleted} completed`}
        />
        <StatsCard
          label="Resources"
          value={data.totalResources}
          icon={BookMarked}
          color="#8b5cf6"
          subLabel={`${data.favoriteResources} favorites`}
        />
        <StatsCard
          label="Career Applications"
          value={data.totalJobs}
          icon={Briefcase}
          color="#06b6d4"
        />
        <StatsCard
          label="Active Career"
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
      </div>

      {/* Main Grid: Planner Widget + Mini Calendar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Daily Planner Focus Widget */}
        <div className="lg:col-span-2">
          <PlannerWidget
            initialTodayTodos={data.todayTodos as any}
            stats={data.plannerStats}
          />
        </div>

        {/* Mini Calendar Widget */}
        <div className="lg:col-span-1">
          <MiniCalendar />
        </div>
      </div>

      {/* Recent Resources & Career Grid */}
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
