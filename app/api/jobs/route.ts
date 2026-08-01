// app/api/jobs/route.ts
// GET (list, search, filter, sort, paginate) + POST

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { jobApiSchema } from "@/lib/validations";
import { JOBS_PAGE_SIZE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const query = searchParams.get("q") ?? "";
    const status = searchParams.get("status") ?? "";
    const sort = searchParams.get("sort") ?? "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const pageSize = parseInt(searchParams.get("pageSize") ?? String(JOBS_PAGE_SIZE));

    const where: Record<string, unknown> = {};

    if (query) {
      where.OR = [
        { company: { contains: query, mode: "insensitive" } },
        { position: { contains: query, mode: "insensitive" } },
        { location: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { notes: { contains: query, mode: "insensitive" } },
        { hrName: { contains: query, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;

    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };
    else if (sort === "applied_desc") orderBy = { appliedDate: "desc" };
    else if (sort === "applied_asc") orderBy = { appliedDate: "asc" };

    const [total, jobs] = await Promise.all([
      prisma.jobApplication.count({ where }),
      prisma.jobApplication.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return Response.json({
      data: jobs,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[GET /api/jobs]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = jobApiSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { appliedDate, followUpDate, ...rest } = parsed.data;

    const job = await prisma.jobApplication.create({
      data: {
        ...rest,
        appliedDate: new Date(appliedDate),
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        jobUrl: rest.jobUrl || null,
        source: rest.source || null,
        salary: rest.salary || null,
        location: rest.location || null,
        description: rest.description || null,
        hrName: rest.hrName || null,
        hrContact: rest.hrContact || null,
        resumeVersion: rest.resumeVersion || null,
        notes: rest.notes || null,
      },
    });

    return Response.json({ data: job }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/jobs]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
