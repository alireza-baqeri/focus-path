import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { parseUTCDate } from "@/lib/date-utils";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const durationMinutes =
      typeof body?.durationMinutes === "number"
        ? Math.round(body.durationMinutes)
        : Number.parseInt(String(body?.durationMinutes ?? ""), 10);
    const categoryName = typeof body?.categoryName === "string" ? body.categoryName.trim() : "";
    const dateRaw = typeof body?.date === "string" ? body.date : "";

    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0 || durationMinutes > 1440 || !categoryName || !dateRaw) {
      return NextResponse.json({ message: "Missing or invalid required fields" }, { status: 400 });
    }

    const recordDate = parseUTCDate(dateRaw);
    if (!recordDate) {
      return NextResponse.json({ message: "Invalid date format" }, { status: 400 });
    }

    // Ensure category exists
    let category = await prisma.activityCategory.findFirst({
      where: { userId, name: categoryName }
    });

    if (!category) {
      category = await prisma.activityCategory.create({
        data: {
          userId,
          name: categoryName,
          emoji: "⏳",
          colorCode: "#f43f5e", // Rose/Red for Pomodoro
        }
      });
    }

    // Upsert day record
    const dayRecord = await prisma.dayRecord.upsert({
      where: {
        userId_date: {
          userId,
          date: recordDate,
        },
      },
      update: {}, // Just find or create
      create: {
        userId,
        date: recordDate,
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        dayRecordId: dayRecord.id,
        categoryId: category.id,
        durationMinutes,
      }
    });

    revalidatePath("/");
    revalidatePath("/timetable");
    revalidatePath("/analytics");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Activity log POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
