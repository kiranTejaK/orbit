// app/api/resources/route.ts
// GET (list, search, filter, sort, paginate) + POST

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { resourceApiSchema } from "@/lib/validations";
import { RESOURCES_PAGE_SIZE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const query = searchParams.get("q") ?? "";
    const resourceType = searchParams.get("type") ?? "";
    const category = searchParams.get("category") ?? "";
    const favorite = searchParams.get("favorite");
    const sort = searchParams.get("sort") ?? "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const pageSize = parseInt(searchParams.get("pageSize") ?? String(RESOURCES_PAGE_SIZE));

    // Build where clause
    const where: Record<string, unknown> = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { personalNotes: { contains: query, mode: "insensitive" } },
        { tags: { has: query } },
      ];
    }
    if (resourceType) where.resourceType = resourceType;
    if (category) where.category = category;
    if (favorite === "true") where.favorite = true;

    // Build orderBy
    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };
    else if (sort === "alpha") orderBy = { title: "asc" };

    const [total, resources] = await Promise.all([
      prisma.resource.count({ where }),
      prisma.resource.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return Response.json({
      data: resources,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[GET /api/resources]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resourceApiSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.create({
      data: {
        ...parsed.data,
        description: parsed.data.description ?? null,
        personalNotes: parsed.data.personalNotes ?? null,
        category: parsed.data.category ?? null,
        source: parsed.data.source ?? null,
      },
    });

    return Response.json({ data: resource }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/resources]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
