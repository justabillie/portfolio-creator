import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const schema = z.object({
  name: z.string().min(1).max(100).optional(),
  category: z.string().max(50).optional().nullable(),
  proficiency: z.number().int().min(1).max(5).optional().nullable(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const d = parsed.data;
  const skill = await prisma.skill.update({
    where: { id },
    data: {
      ...(d.name !== undefined && { name: d.name }),
      ...(d.category !== undefined && { category: d.category ?? null }),
      ...(d.proficiency !== undefined && { proficiency: d.proficiency ?? null }),
    },
  });
  return NextResponse.json({ skill });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.skill.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
