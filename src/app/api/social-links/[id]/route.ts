import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const schema = z.object({
  platform: z.string().min(1).max(50).optional(),
  url: z.string().url().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.socialLink.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const d = parsed.data;
  const socialLink = await prisma.socialLink.update({
    where: { id },
    data: {
      ...(d.platform !== undefined && { platform: d.platform }),
      ...(d.url !== undefined && { url: d.url }),
    },
  });
  return NextResponse.json({ socialLink });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.socialLink.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.socialLink.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
