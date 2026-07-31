// app/api/resources/[id]/route.ts
// GET (single) + PUT + DELETE

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { updateResourceApiSchema } from "@/lib/validations";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resource = await prisma.resource.findUnique({ where: { id } });

    if (!resource) {
      return Response.json({ error: "Resource not found" }, { status: 404 });
    }

    return Response.json({ data: resource });
  } catch (error) {
    console.error("[GET /api/resources/[id]]", error);
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
    const parsed = updateResourceApiSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.resource.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Resource not found" }, { status: 404 });
    }

    const resource = await prisma.resource.update({
      where: { id },
      data: parsed.data,
    });

    return Response.json({ data: resource });
  } catch (error) {
    console.error("[PUT /api/resources/[id]]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.resource.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Resource not found" }, { status: 404 });
    }

    await prisma.resource.delete({ where: { id } });
    return Response.json({ data: { id } });
  } catch (error) {
    console.error("[DELETE /api/resources/[id]]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
