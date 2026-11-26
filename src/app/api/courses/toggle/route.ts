import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const videoId = typeof body?.videoId === "string" ? body.videoId.trim() : "";
    const isWatched = Boolean(body?.isWatched);

    if (!videoId) {
      return NextResponse.json({ message: "Video ID is required" }, { status: 400 });
    }

    const existingVideo = await prisma.video.findUnique({
      where: { id: videoId },
      select: {
        id: true,
        section: {
          select: {
            course: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!existingVideo) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    if (existingVideo.section.course.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.video.update({
      where: { id: videoId },
      data: {
        isWatched,
        watchedAtDate: isWatched ? new Date() : null,
      },
    });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/analytics");

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Video toggle error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
