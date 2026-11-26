import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatUTCDate } from "@/lib/date-utils";

function escapeCsvCell(value: string): string {
  const safeValue = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const format = req.nextUrl.searchParams.get("format") || "json";

  try {
    // Fetch all user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        createdAt: true,
        settings: true,
        courses: {
          include: {
            sections: {
              include: { videos: true },
              orderBy: { orderIndex: "asc" },
            },
          },
        },
        dayRecords: {
          include: {
            journalEntries: { orderBy: { orderIndex: "asc" } },
            activityLogs: { include: { category: true } },
            goalProgresses: { include: { goal: true } },
          },
          orderBy: { date: "desc" },
        },
        goals: true,
        activityCategories: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (format === "csv") {
      // Generate CSV for activity logs
      const lines: string[] = ["Date,Category,Duration (minutes),Journal"];

      user.dayRecords.forEach((dr) => {
        const dateStr = formatUTCDate(dr.date);
        const journalText = dr.journalEntries
          .map((j) => j.content)
          .join("; ");

        if (dr.activityLogs.length > 0) {
          dr.activityLogs.forEach((log) => {
            lines.push(
              `${dateStr},${escapeCsvCell(log.category.name)},${log.durationMinutes},${escapeCsvCell(journalText)}`
            );
          });
        } else {
          lines.push(`${dateStr},"(no activities)",0,${escapeCsvCell(journalText)}`);
        }
      });

      const csvContent = lines.join("\n");
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="focus-path-data.csv"`,
        },
      });
    }

    // JSON format (default)
    const exportData = {
      exportedAt: new Date().toISOString(),
      appVersion: "1.0.0",
      user: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      settings: user.settings,
      categories: user.activityCategories,
      goals: user.goals,
      courses: user.courses.map((c) => ({
        title: c.title,
        totalDuration: c.totalDuration,
        sections: c.sections.map((s) => ({
          title: s.title,
          videos: s.videos.map((v) => ({
            title: v.title,
            duration: v.duration,
            isWatched: v.isWatched,
            watchedAtDate: v.watchedAtDate,
            isFlagged: v.isFlagged,
            notes: v.notes,
          })),
        })),
      })),
      dayRecords: user.dayRecords.map((dr) => ({
        date: formatUTCDate(dr.date),
        wakeTime: dr.wakeTime,
        sleepTime: dr.sleepTime,
        activities: dr.activityLogs.map((log) => ({
          category: log.category.name,
          durationMinutes: log.durationMinutes,
        })),
        journal: dr.journalEntries.map((j) => j.content),
        goalProgress: dr.goalProgresses.map((gp) => ({
          goal: gp.goal.title,
          description: gp.description,
        })),
      })),
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    return new NextResponse(jsonContent, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="focus-path-data.json"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
