// app/api/stats/route.ts
// Dashboard statistics

import prisma from "@/lib/prisma";
import { ACTIVE_JOB_STATUSES, INTERVIEWING_STATUSES } from "@/lib/constants";

export async function GET() {
  try {
    const [
      totalResources,
      favoriteResources,
      totalJobs,
      activeJobs,
      interviewingJobs,
      offerJobs,
      rejectedJobs,
      recentResources,
      recentJobs,
    ] = await Promise.all([
      prisma.resource.count(),
      prisma.resource.count({ where: { favorite: true } }),
      prisma.jobApplication.count(),
      prisma.jobApplication.count({ where: { status: { in: ACTIVE_JOB_STATUSES } } }),
      prisma.jobApplication.count({ where: { status: { in: INTERVIEWING_STATUSES } } }),
      prisma.jobApplication.count({ where: { status: "Offer" } }),
      prisma.jobApplication.count({ where: { status: "Rejected" } }),
      prisma.resource.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.jobApplication.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return Response.json({
      data: {
        resources: {
          total: totalResources,
          favorites: favoriteResources,
          recent: recentResources,
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          interviewing: interviewingJobs,
          offers: offerJobs,
          rejected: rejectedJobs,
          recent: recentJobs,
        },
      },
    });
  } catch (error) {
    console.error("[GET /api/stats]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
