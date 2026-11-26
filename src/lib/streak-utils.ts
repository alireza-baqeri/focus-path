import prisma from "@/lib/prisma";
import { formatLocalDate, formatUTCDate } from "@/lib/date-utils";

export async function calculateUserStreak(userId: string): Promise<number> {
  try {
    // Fetch day records that have at least one activity log
    const activeDayRecords = await prisma.dayRecord.findMany({
      where: {
        userId,
        activityLogs: {
          some: {}, // At least one activity log
        },
      },
      select: {
        date: true,
      },
    });

    // Fetch videos watched by the user
    const watchedVideos = await prisma.video.findMany({
      where: {
        section: {
          course: {
            userId,
          },
        },
        isWatched: true,
        watchedAtDate: {
          not: null,
        },
      },
      select: {
        watchedAtDate: true,
      },
    });

    const activeDateStrings = new Set<string>();

    // DayRecord.date is stored at UTC midnight for its calendar date
    activeDayRecords.forEach((record) => {
      if (record.date) {
        const dateStr = formatUTCDate(record.date);
        if (dateStr) activeDateStrings.add(dateStr);
      }
    });

    // Video.watchedAtDate is stored as a timestamp
    watchedVideos.forEach((video) => {
      if (video.watchedAtDate) {
        const dateStr = formatLocalDate(video.watchedAtDate);
        if (dateStr) activeDateStrings.add(dateStr);
      }
    });

    if (activeDateStrings.size === 0) return 0;

    // Calculate streak from today or yesterday
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = formatLocalDate(today);
    const yesterdayStr = formatLocalDate(yesterday);

    const startDateStr = activeDateStrings.has(todayStr)
      ? todayStr
      : activeDateStrings.has(yesterdayStr)
      ? yesterdayStr
      : null;

    if (!startDateStr) {
      return 0; // No activity today or yesterday, streak broken
    }

    let streak = 0;
    const [y, m, d] = startDateStr.split("-").map(Number);
    const currentCheckDate = new Date(y, m - 1, d, 12, 0, 0); // Noon local time to avoid DST shifts

    while (activeDateStrings.has(formatLocalDate(currentCheckDate))) {
      streak++;
      currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    }

    return streak;
  } catch (error) {
    console.error("Error calculating streak:", error);
    return 0;
  }
}
