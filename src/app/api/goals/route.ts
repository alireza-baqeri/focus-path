import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const targetDescription =
      typeof body?.targetDescription === "string" ? body.targetDescription.trim() : null;
    const startDateRaw = body?.startDate;
    const endDateRaw = body?.endDate;

    if (!title || !startDateRaw || !endDateRaw) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const parsedStart = new Date(startDateRaw);
    const parsedEnd = new Date(endDateRaw);
    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
      return NextResponse.json({ message: "Invalid start or end date" }, { status: 400 });
    }

    if (parsedEnd < parsedStart) {
      return NextResponse.json({ message: "End date must be on or after start date" }, { status: 400 });
    }

    // Check count of active goals (max 3 allowed)
    const activeCount = await prisma.goal.count({
      where: { userId, isActive: true },
    });

    if (activeCount >= 3) {
      return NextResponse.json({ message: "You can only have up to 3 active goals/programs" }, { status: 400 });
    }

    const goal = await prisma.goal.create({
      data: {
        userId,
        title,
        targetDescription,
        startDate: parsedStart,
        endDate: parsedEnd,
        isActive: true,
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("Goal creation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.trim();

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const existingGoal = await prisma.goal.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingGoal) {
      return NextResponse.json({ message: "Goal not found" }, { status: 404 });
    }

    if (existingGoal.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.goal.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Goal deleted" });
  } catch (error) {
    console.error("Goal deletion error:", error);
    return NextResponse.json({ message: "Error deleting goal" }, { status: 500 });
  }
}
