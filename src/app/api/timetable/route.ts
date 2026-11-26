import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { parseUTCDate } from "@/lib/date-utils";

interface JournalEntryInput {
  content?: unknown;
}

interface ActivityLogInput {
  categoryId?: unknown;
  durationMinutes?: unknown;
}

interface GoalProgressInput {
  goalId?: unknown;
  description?: unknown;
}

// GET: Fetch records, categories, goals, and journal entries for a range
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Fetch user categories (or seed defaults if none exist)
    let categories = await prisma.activityCategory.findMany({
      where: { userId },
    });

    if (categories.length === 0) {
      // Seed initial default categories
      const defaults = [
        { name: "Programming", emoji: "💻", colorCode: "#3b82f6" },
        { name: "University", emoji: "🎓", colorCode: "#8b5cf6" },
        { name: "Sports", emoji: "🏋️", colorCode: "#10b981" },
        { name: "Reading", emoji: "📚", colorCode: "#f59e0b" },
        { name: "Rest", emoji: "😴", colorCode: "#6b7280" },
      ];

      for (const cat of defaults) {
        await prisma.activityCategory.create({
          data: { ...cat, userId },
        });
      }

      categories = await prisma.activityCategory.findMany({ where: { userId } });
    }

    // Fetch goals
    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Fetch day records
    const whereClause: Prisma.DayRecordWhereInput = { userId };
    if (startDate && endDate) {
      const parsedStart = parseUTCDate(startDate);
      const parsedEnd = parseUTCDate(endDate);
      if (!parsedStart || !parsedEnd) {
        return NextResponse.json({ message: "Invalid startDate or endDate" }, { status: 400 });
      }
      whereClause.date = {
        gte: parsedStart,
        lte: parsedEnd,
      };
    }

    const dayRecords = await prisma.dayRecord.findMany({
      where: whereClause,
      include: {
        journalEntries: { orderBy: { orderIndex: "asc" } },
        activityLogs: { include: { category: true } },
        goalProgresses: { include: { goal: true } },
      },
    });

    // User settings (for quote, etc.)
    const settings = await prisma.settings.findUnique({
      where: { userId },
    });

    return NextResponse.json({
      categories,
      goals,
      dayRecords,
      settings,
    });
  } catch (error) {
    console.error("Timetable GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST: Save or update day record (journal, wake/sleep time, activities, goal progress)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const dateRaw = typeof body?.date === "string" ? body.date : "";
    const wakeTime = typeof body?.wakeTime === "string" ? body.wakeTime.trim() : null;
    const sleepTime = typeof body?.sleepTime === "string" ? body.sleepTime.trim() : null;
    const journalEntries: JournalEntryInput[] | undefined = Array.isArray(body?.journalEntries)
      ? body.journalEntries
      : undefined;
    const activityLogs: ActivityLogInput[] | undefined = Array.isArray(body?.activityLogs)
      ? body.activityLogs
      : undefined;
    const goalProgresses: GoalProgressInput[] | undefined = Array.isArray(body?.goalProgresses)
      ? body.goalProgresses
      : undefined;

    if (!dateRaw) {
      return NextResponse.json({ message: "Date is required" }, { status: 400 });
    }

    const recordDate = parseUTCDate(dateRaw);
    if (!recordDate) {
      return NextResponse.json({ message: "Invalid date format" }, { status: 400 });
    }

    const validJournals = (journalEntries || [])
      .map((entry) => (typeof entry?.content === "string" ? entry.content.trim() : ""))
      .filter((content) => content.length > 0);

    const validActivities = (activityLogs || [])
      .map((log) => ({
        categoryId: typeof log?.categoryId === "string" ? log.categoryId.trim() : "",
        durationMinutes:
          typeof log?.durationMinutes === "number"
            ? Math.round(log.durationMinutes)
            : Number.parseInt(String(log?.durationMinutes ?? ""), 10),
      }))
      .filter(
        (log) =>
          log.categoryId.length > 0 &&
          Number.isFinite(log.durationMinutes) &&
          log.durationMinutes > 0 &&
          log.durationMinutes <= 1440
      );

    const validGoalProgresses = (goalProgresses || [])
      .map((gp) => ({
        goalId: typeof gp?.goalId === "string" ? gp.goalId.trim() : "",
        description: typeof gp?.description === "string" ? gp.description.trim() : "",
      }))
      .filter((gp) => gp.goalId.length > 0 && gp.description.length > 0);

    // Verify ownership of referenced categories and goals before mutating data
    if (validActivities.length > 0) {
      const requestedCategoryIds = Array.from(new Set(validActivities.map((a) => a.categoryId)));
      const ownedCategories = await prisma.activityCategory.findMany({
        where: { id: { in: requestedCategoryIds }, userId },
        select: { id: true },
      });
      if (ownedCategories.length !== requestedCategoryIds.length) {
        return NextResponse.json({ message: "Forbidden category reference" }, { status: 403 });
      }
    }

    if (validGoalProgresses.length > 0) {
      const requestedGoalIds = Array.from(new Set(validGoalProgresses.map((g) => g.goalId)));
      const ownedGoals = await prisma.goal.findMany({
        where: { id: { in: requestedGoalIds }, userId },
        select: { id: true },
      });
      if (ownedGoals.length !== requestedGoalIds.length) {
        return NextResponse.json({ message: "Forbidden goal reference" }, { status: 403 });
      }
    }

    const updatedRecord = await prisma.$transaction(async (tx) => {
      const dayRecord = await tx.dayRecord.upsert({
        where: {
          userId_date: {
            userId,
            date: recordDate,
          },
        },
        update: {
          wakeTime,
          sleepTime,
        },
        create: {
          userId,
          date: recordDate,
          wakeTime,
          sleepTime,
        },
      });

      if (journalEntries !== undefined) {
        await tx.journalEntry.deleteMany({
          where: { dayRecordId: dayRecord.id },
        });

        for (let i = 0; i < validJournals.length; i++) {
          await tx.journalEntry.create({
            data: {
              dayRecordId: dayRecord.id,
              content: validJournals[i],
              orderIndex: i,
            },
          });
        }
      }

      if (activityLogs !== undefined) {
        await tx.activityLog.deleteMany({
          where: { dayRecordId: dayRecord.id },
        });

        for (const log of validActivities) {
          await tx.activityLog.create({
            data: {
              dayRecordId: dayRecord.id,
              categoryId: log.categoryId,
              durationMinutes: log.durationMinutes,
            },
          });
        }
      }

      if (goalProgresses !== undefined) {
        await tx.dayGoalProgress.deleteMany({
          where: { dayRecordId: dayRecord.id },
        });

        for (const gp of validGoalProgresses) {
          await tx.dayGoalProgress.create({
            data: {
              dayRecordId: dayRecord.id,
              goalId: gp.goalId,
              description: gp.description,
            },
          });
        }
      }

      return tx.dayRecord.findUnique({
        where: { id: dayRecord.id },
        include: {
          journalEntries: { orderBy: { orderIndex: "asc" } },
          activityLogs: { include: { category: true } },
          goalProgresses: { include: { goal: true } },
        },
      });
    });

    revalidatePath("/");
    revalidatePath("/timetable");
    revalidatePath("/analytics");

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error("Timetable POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
