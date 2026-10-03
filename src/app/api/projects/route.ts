import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const projectSchema = z.object({
  title: z.string().min(1).max(200),
  role: z.string().max(100).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  techStack: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  demoUrl: z.string().url().optional().nullable().or(z.literal("")),
  repoUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export async function GET() {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { userId: session.userId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const project = await prisma.project.create({
      data: {
        userId: session.userId,
        title: d.title,
        role: d.role ?? null,
        description: d.description ?? null,
        techStack: d.techStack,
        imageUrl: d.imageUrl || null,
        demoUrl: d.demoUrl || null,
        repoUrl: d.repoUrl || null,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    console.error("Project create error:", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
