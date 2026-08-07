import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { todoApiSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const section = searchParams.get("section");
    const dateParam = searchParams.get("date");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const statusParam = searchParams.get("status");
    const priorityParam = searchParams.get("priority");
    const q = searchParams.get("q");
    const sort = searchParams.get("sort") || "newest";
    const calendarCounts = searchParams.get("calendarCounts") === "true";

    // Calendar task counts per day query mode
    if (calendarCounts && startDateParam && endDateParam) {
      const start = new Date(`${startDateParam}T00:00:00.000Z`);
      const end = new Date(`${endDateParam}T23:59:59.999Z`);

      const todos = await prisma.todo.findMany({
        where: {
          dueDate: {
            gte: start,
            lte: end,
          },
        },
        select: {
          dueDate: true,
          status: true,
        },
      });

      // Group counts by YYYY-MM-DD
      const countsByDate: Record<string, { total: number; completed: number; pending: number }> = {};

      todos.forEach((t) => {
        if (!t.dueDate) return;
        const dateStr = t.dueDate.toISOString().split("T")[0];
        if (!countsByDate[dateStr]) {
          countsByDate[dateStr] = { total: 0, completed: 0, pending: 0 };
        }
        countsByDate[dateStr].total += 1;
        if (t.status === "COMPLETED") {
          countsByDate[dateStr].completed += 1;
        } else {
          countsByDate[dateStr].pending += 1;
        }
      });

      return NextResponse.json({ data: countsByDate });
    }

    const where: any = {};

    // Search filter
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { notes: { contains: q, mode: "insensitive" } },
        { tags: { has: q } },
      ];
    }

    // Direct Status / Priority filter
    if (statusParam) {
      where.status = statusParam;
    }
    if (priorityParam) {
      where.priority = priorityParam;
    }

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const todayStart = new Date(`${todayStr}T00:00:00.000Z`);
    const todayEnd = new Date(`${todayStr}T23:59:59.999Z`);

    // Specific Date filter
    if (dateParam) {
      const dateStart = new Date(`${dateParam}T00:00:00.000Z`);
      const dateEnd = new Date(`${dateParam}T23:59:59.999Z`);
      where.dueDate = {
        gte: dateStart,
        lte: dateEnd,
      };
    } else if (section) {
      // Section based filter
      switch (section) {
        case "today":
          where.dueDate = { gte: todayStart, lte: todayEnd };
          where.status = { not: "COMPLETED" };
          break;
        case "upcoming":
          where.dueDate = { gt: todayEnd };
          where.status = { not: "COMPLETED" };
          break;
        case "overdue":
          where.dueDate = { lt: todayStart };
          where.status = { not: "COMPLETED" };
          break;
        case "completed_today":
          where.status = "COMPLETED";
          where.completedAt = { gte: todayStart, lte: todayEnd };
          break;
        case "no_due_date":
          where.dueDate = null;
          where.status = { not: "COMPLETED" };
          break;
        default:
          break;
      }
    }

    // Sorting
    let orderBy: any = { createdAt: "desc" };
    if (sort === "oldest") orderBy = { createdAt: "asc" };
    else if (sort === "alpha") orderBy = { title: "asc" };
    else if (sort === "dueDate_asc") orderBy = { dueDate: "asc" };
    else if (sort === "dueDate_desc") orderBy = { dueDate: "desc" };
    else if (sort === "priority_desc") orderBy = { priority: "desc" };

    const todos = await prisma.todo.findMany({
      where,
      orderBy,
    });

    const formatted = todos.map((t) => ({
      ...t,
      dueDate: t.dueDate?.toISOString() ?? null,
      startDate: t.startDate?.toISOString() ?? null,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      completedAt: t.completedAt?.toISOString() ?? null,
    }));

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error("GET /api/todos error:", error);
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = todoApiSchema.parse(body);

    const dueDate = validated.dueDate ? new Date(validated.dueDate) : null;
    const startDate = validated.startDate ? new Date(validated.startDate) : null;
    const completedAt = validated.status === "COMPLETED" ? new Date() : null;

    const todo = await prisma.todo.create({
      data: {
        title: validated.title,
        description: validated.description ?? null,
        dueDate,
        startDate,
        priority: validated.priority,
        status: validated.status,
        notes: validated.notes ?? null,
        tags: validated.tags ?? [],
        completedAt,
      },
    });

    return NextResponse.json(
      {
        data: {
          ...todo,
          dueDate: todo.dueDate?.toISOString() ?? null,
          startDate: todo.startDate?.toISOString() ?? null,
          createdAt: todo.createdAt.toISOString(),
          updatedAt: todo.updatedAt.toISOString(),
          completedAt: todo.completedAt?.toISOString() ?? null,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/todos error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
  }
}
