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
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const emoji = typeof body?.emoji === "string" && body.emoji.trim() ? body.emoji.trim() : "📌";
    const colorCode = typeof body?.colorCode === "string" && body.colorCode.trim() ? body.colorCode.trim() : "#3b82f6";

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    const category = await prisma.activityCategory.create({
      data: {
        userId,
        name,
        emoji,
        colorCode,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Category creation error:", error);
    return NextResponse.json({ message: "Error creating category" }, { status: 500 });
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

    const existingCategory = await prisma.activityCategory.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingCategory) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    if (existingCategory.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.activityCategory.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    console.error("Category deletion error:", error);
    return NextResponse.json({ message: "Error deleting category" }, { status: 500 });
  }
}
