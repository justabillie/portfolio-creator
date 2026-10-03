import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const schema = z.object({
  company: z.string().min(1).max(200).optional(),
  role: z.string().min(1).max(200).optional(),
  location: z.string().max(200).optional().nullable(),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const d = parsed.data;
  const experience = await prisma.experience.update({
    where: { id },
    data: {
      ...(d.company !== undefined && { company: d.company }),
      ...(d.role !== undefined && { role: d.role }),
      ...(d.location !== undefined && { location: d.location ?? null }),
      ...(d.startDate !== undefined && { startDate: new Date(d.startDate) }),
      ...(d.endDate !== undefined && { endDate: d.endDate ? new Date(d.endDate) : null }),
      ...(d.description !== undefined && { description: d.description ?? null }),
    },
  });
  return NextResponse.json({ experience });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
