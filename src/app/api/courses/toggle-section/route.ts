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
    const sectionId = typeof body?.sectionId === "string" ? body.sectionId.trim() : "";

    if (!sectionId) {
      return NextResponse.json({ message: "Section ID is required" }, { status: 400 });
    }

    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      select: {
        id: true,
        course: {
          select: { userId: true },
        },
      },
    });

    if (!section) {
      return NextResponse.json({ message: "Section not found" }, { status: 404 });
    }

    if (section.course.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Only update unwatched videos so previously watched timestamps are preserved
    // and ActivityGraph/Streak aggregate directly from Video.watchedAtDate without double-counting.
    await prisma.video.updateMany({
      where: { sectionId, isWatched: false },
      data: { isWatched: true, watchedAtDate: new Date() },
    });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/analytics");

    return NextResponse.json({ message: "Section marked as watched successfully" });
  } catch (error) {
    console.error("Error toggling section:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
