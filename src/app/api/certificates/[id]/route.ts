import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const schema = z.object({
  title: z.string().min(1).max(200).optional(),
  issuer: z.string().min(1).max(200).optional(),
  issueDate: z.string().optional().nullable(),
  credentialUrl: z.string().url().optional().nullable().or(z.literal("")),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.certificate.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const d = parsed.data;
  const certificate = await prisma.certificate.update({
    where: { id },
    data: {
      ...(d.title !== undefined && { title: d.title }),
      ...(d.issuer !== undefined && { issuer: d.issuer }),
      ...(d.issueDate !== undefined && { issueDate: d.issueDate ? new Date(d.issueDate) : null }),
      ...(d.credentialUrl !== undefined && { credentialUrl: d.credentialUrl || null }),
      ...(d.imageUrl !== undefined && { imageUrl: d.imageUrl || null }),
    },
  });
  return NextResponse.json({ certificate });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.certificate.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.certificate.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
