import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  role: z.string().max(100).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  techStack: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  demoUrl: z.string().url().optional().nullable().or(z.literal("")),
  repoUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(d.title !== undefined && { title: d.title }),
        ...(d.role !== undefined && { role: d.role ?? null }),
        ...(d.description !== undefined && { description: d.description ?? null }),
        ...(d.techStack !== undefined && { techStack: d.techStack }),
        ...(d.imageUrl !== undefined && { imageUrl: d.imageUrl || null }),
        ...(d.demoUrl !== undefined && { demoUrl: d.demoUrl || null }),
        ...(d.repoUrl !== undefined && { repoUrl: d.repoUrl || null }),
      },
    });

    return NextResponse.json({ project });
  } catch (err) {
    console.error("Project update error:", err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
