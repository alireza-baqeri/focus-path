import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// DELETE: Remove a course (cascades to sections and videos via schema)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { courseId } = await params;

    // Verify ownership before deleting
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { userId: true },
    });

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    if (course.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Delete course — sections and videos cascade automatically
    await prisma.course.delete({ where: { id: courseId } });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/analytics");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Course DELETE error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PATCH: Rename a course title
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { courseId } = await params;
    const body = await req.json();
    const { title } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    // Verify ownership
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { userId: true },
    });

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    if (course.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.course.update({
      where: { id: courseId },
      data: { title: title.trim() },
    });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/analytics");

    return NextResponse.json({ success: true, title: updated.title });
  } catch (error) {
    console.error("Course PATCH error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
