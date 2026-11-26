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

    const body = await req.json();
    const videoId = typeof body?.videoId === "string" ? body.videoId.trim() : "";

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

    const dataToUpdate: { isFlagged?: boolean; notes?: string | null } = {};
    if (body?.isFlagged !== undefined) {
      if (typeof body.isFlagged !== "boolean") {
        return NextResponse.json({ message: "isFlagged must be a boolean" }, { status: 400 });
      }
      dataToUpdate.isFlagged = body.isFlagged;
    }
    if (body?.notes !== undefined) {
      if (body.notes !== null && typeof body.notes !== "string") {
        return NextResponse.json({ message: "notes must be a string or null" }, { status: 400 });
      }
      dataToUpdate.notes = body.notes;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ message: "No metadata fields provided" }, { status: 400 });
    }

    await prisma.video.update({
      where: { id: videoId },
      data: dataToUpdate,
    });

    return NextResponse.json({ message: "Metadata updated successfully" });
  } catch (error) {
    console.error("Error updating video meta:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
