import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

interface CourseVideoInput {
  title: string;
  duration?: number;
}

interface CourseSectionInput {
  title: string;
  videos?: CourseVideoInput[];
}

// GET: Fetch all courses with sections and videos
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const courses = await prisma.course.findMany({
      where: { userId },
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
          include: {
            videos: {
              orderBy: { title: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Course GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST: Create or update a course from sync payload
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const rootPath = typeof body?.rootPath === "string" ? body.rootPath.trim() : "";
    const rawSections = body?.sections;

    if (!title || !Array.isArray(rawSections)) {
      return NextResponse.json({ message: "Title and sections array are required" }, { status: 400 });
    }

    const sections: CourseSectionInput[] = rawSections.filter(
      (sec: unknown): sec is CourseSectionInput =>
        typeof sec === "object" &&
        sec !== null &&
        typeof (sec as CourseSectionInput).title === "string" &&
        (sec as CourseSectionInput).title.trim().length > 0
    );

    // Calculate total duration safely
    let totalDuration = 0;
    sections.forEach((sec) => {
      if (Array.isArray(sec.videos)) {
        sec.videos.forEach((v) => {
          const dur = typeof v?.duration === "number" && Number.isFinite(v.duration) && v.duration > 0
            ? Math.round(v.duration)
            : 0;
          totalDuration += dur;
        });
      }
    });

    // Check if course with same rootPath or title exists for user
    const existing = await prisma.course.findFirst({
      where: {
        userId,
        OR: [{ rootPath: rootPath || title }, { title }],
      },
    });

    let courseId = existing?.id;

    if (existing) {
      await prisma.course.update({
        where: { id: existing.id },
        data: {
          title,
          totalDuration,
        },
      });
    } else {
      const created = await prisma.course.create({
        data: {
          userId,
          title,
          rootPath: rootPath || title,
          totalDuration,
        },
      });
      courseId = created.id;
    }

    // Create sections & videos
    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
      const secData = sections[sIdx];
      const secTitle = secData.title.trim();
      let section = await prisma.section.findFirst({
        where: { courseId, title: secTitle },
      });

      if (!section) {
        section = await prisma.section.create({
          data: {
            courseId: courseId!,
            title: secTitle,
            orderIndex: sIdx,
          },
        });
      }

      if (Array.isArray(secData.videos)) {
        for (const vid of secData.videos) {
          const vidTitle = typeof vid?.title === "string" ? vid.title.trim() : "";
          if (!vidTitle) continue;
          const vidDuration =
            typeof vid?.duration === "number" && Number.isFinite(vid.duration) && vid.duration > 0
              ? Math.round(vid.duration)
              : 0;

          const existingVid = await prisma.video.findFirst({
            where: { sectionId: section.id, title: vidTitle },
          });

          if (!existingVid) {
            await prisma.video.create({
              data: {
                sectionId: section.id,
                title: vidTitle,
                duration: vidDuration,
                isWatched: false,
              },
            });
          }
        }
      }
    }

    const fullCourse = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
          include: { videos: true },
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/analytics");

    return NextResponse.json(fullCourse, { status: 201 });
  } catch (error) {
    console.error("Course sync POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
