import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const schema = z.object({
  institution: z.string().min(1).max(200).optional(),
  degree: z.string().min(1).max(200).optional(),
  field: z.string().max(200).optional().nullable(),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  gpa: z.string().max(20).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.education.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const d = parsed.data;
  const education = await prisma.education.update({
    where: { id },
    data: {
      ...(d.institution !== undefined && { institution: d.institution }),
      ...(d.degree !== undefined && { degree: d.degree }),
      ...(d.field !== undefined && { field: d.field ?? null }),
      ...(d.startDate !== undefined && { startDate: new Date(d.startDate) }),
      ...(d.endDate !== undefined && { endDate: d.endDate ? new Date(d.endDate) : null }),
      ...(d.gpa !== undefined && { gpa: d.gpa ?? null }),
      ...(d.description !== undefined && { description: d.description ?? null }),
    },
  });
  return NextResponse.json({ education });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.education.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.education.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
