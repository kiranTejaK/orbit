// app/api/jobs/[id]/route.ts
// GET (single) + PUT + DELETE

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { updateJobApiSchema } from "@/lib/validations";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = await prisma.jobApplication.findUnique({ where: { id } });

    if (!job) {
      return Response.json({ error: "Job application not found" }, { status: 404 });
    }

    return Response.json({ data: job });
  } catch (error) {
    console.error("[GET /api/jobs/[id]]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateJobApiSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.jobApplication.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Job application not found" }, { status: 404 });
    }

    const { appliedDate, followUpDate, jobUrl, location, description, ...rest } = parsed.data;

    const job = await prisma.jobApplication.update({
      where: { id },
      data: {
        ...rest,
        ...(appliedDate ? { appliedDate: new Date(appliedDate) } : {}),
        ...(followUpDate !== undefined
          ? { followUpDate: followUpDate ? new Date(followUpDate) : null }
          : {}),
        ...(jobUrl !== undefined ? { jobUrl: jobUrl || null } : {}),
        ...(location !== undefined ? { location: location || null } : {}),
        ...(description !== undefined ? { description: description || null } : {}),
      },
    });

    return Response.json({ data: job });
  } catch (error) {
    console.error("[PUT /api/jobs/[id]]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.jobApplication.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Job application not found" }, { status: 404 });
    }

    await prisma.jobApplication.delete({ where: { id } });
    return Response.json({ data: { id } });
  } catch (error) {
    console.error("[DELETE /api/jobs/[id]]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
