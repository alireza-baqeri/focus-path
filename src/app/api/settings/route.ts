import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      settings: true,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : undefined;
    const weatherCity = typeof body?.weatherCity === "string" ? body.weatherCity.trim() : undefined;
    const newsCountry = typeof body?.newsCountry === "string" ? body.newsCountry.trim().toLowerCase() : undefined;
    const quoteCategory = typeof body?.quoteCategory === "string" ? body.quoteCategory.trim() : undefined;

    if (name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name },
      });
    }

    await prisma.settings.upsert({
      where: { userId: session.user.id },
      update: {
        ...(weatherCity ? { weatherCity } : {}),
        ...(newsCountry ? { newsCountry } : {}),
        ...(quoteCategory ? { quoteCategory } : {}),
      },
      create: {
        userId: session.user.id,
        weatherCity: weatherCity || "Tehran",
        newsCountry: newsCountry || "us",
        quoteCategory: quoteCategory || "motivational",
      },
    });

    revalidatePath("/");

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (err) {
    console.error("Settings Update Error", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
