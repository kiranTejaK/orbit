import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { updateTodoApiSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        ...todo,
        dueDate: todo.dueDate?.toISOString() ?? null,
        startDate: todo.startDate?.toISOString() ?? null,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString(),
        completedAt: todo.completedAt?.toISOString() ?? null,
      },
    });
  } catch (error) {
    console.error("GET /api/todos/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch todo" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.todo.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    const validated = updateTodoApiSchema.parse(body);

    const updateData: any = {};

    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.notes !== undefined) updateData.notes = validated.notes;
    if (validated.tags !== undefined) updateData.tags = validated.tags;
    if (validated.priority !== undefined) updateData.priority = validated.priority;

    if (validated.dueDate !== undefined) {
      updateData.dueDate = validated.dueDate ? new Date(validated.dueDate) : null;
    }
    if (validated.startDate !== undefined) {
      updateData.startDate = validated.startDate ? new Date(validated.startDate) : null;
    }

    if (validated.status !== undefined) {
      updateData.status = validated.status;
      if (validated.status === "COMPLETED" && existing.status !== "COMPLETED") {
        updateData.completedAt = new Date();
      } else if (validated.status !== "COMPLETED") {
        updateData.completedAt = null;
      }
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      data: {
        ...updated,
        dueDate: updated.dueDate?.toISOString() ?? null,
        startDate: updated.startDate?.toISOString() ?? null,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
        completedAt: updated.completedAt?.toISOString() ?? null,
      },
    });
  } catch (error: any) {
    console.error("PUT /api/todos/[id] error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.todo.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    const updateData: any = {};

    // Handle status toggle or direct update
    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === "COMPLETED") {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }
    }

    // Handle date quick assignment / removal
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }
    if (body.startDate !== undefined) {
      updateData.startDate = body.startDate ? new Date(body.startDate) : null;
    }

    // Handle priority update
    if (body.priority !== undefined) {
      updateData.priority = body.priority;
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      data: {
        ...updated,
        dueDate: updated.dueDate?.toISOString() ?? null,
        startDate: updated.startDate?.toISOString() ?? null,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
        completedAt: updated.completedAt?.toISOString() ?? null,
      },
    });
  } catch (error) {
    console.error("PATCH /api/todos/[id] error:", error);
    return NextResponse.json({ error: "Failed to patch todo" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const existing = await prisma.todo.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    await prisma.todo.delete({ where: { id } });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("DELETE /api/todos/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}
