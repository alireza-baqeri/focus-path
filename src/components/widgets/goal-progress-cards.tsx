import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";

function computeTimelineProgress(startDate: Date, endDate: Date): number {
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  const totalSpan = Math.max(endMs - startMs, 1);
  return Math.min(100, Math.max(0, Math.round(((Date.now() - startMs) / totalSpan) * 100)));
}

export default async function GoalProgressCards({ userId }: { userId: string }) {
  const goals = await prisma.goal.findMany({
    where: { userId, isActive: true },
    include: {
      _count: {
        select: { progressRecords: true },
      },
    },
    take: 3,
  });

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-sm border-gray-200 dark:border-gray-800 h-full">
      <CardHeader>
        <CardTitle className="text-lg">Active Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length > 0 ? (
          goals.map((goal) => {
            const timelineProgress = computeTimelineProgress(goal.startDate, goal.endDate);
            const logCount = goal._count.progressRecords;

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between text-sm gap-2">
                  <span className="font-medium truncate">{goal.title}</span>
                  <span className="text-gray-500 shrink-0">
                    {timelineProgress}% · {logCount} {logCount === 1 ? "log" : "logs"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${timelineProgress}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-gray-500 italic">No active goals found. Set up your goals to see progress here.</div>
        )}
      </CardContent>
    </Card>
  );
}
