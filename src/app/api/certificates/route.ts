import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const schema = z.object({
  title: z.string().min(1).max(200),
  issuer: z.string().min(1).max(200),
  issueDate: z.string().optional().nullable(),
  credentialUrl: z.string().url().optional().nullable().or(z.literal("")),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export async function GET() {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const certificates = await prisma.certificate.findMany({
    where: { userId: session.userId },
    orderBy: [{ sortOrder: "asc" }, { issueDate: "desc" }],
  });
  return NextResponse.json({ certificates });
}

export async function POST(request: Request) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const d = parsed.data;
  const certificate = await prisma.certificate.create({
    data: {
      userId: session.userId,
      title: d.title,
      issuer: d.issuer,
      issueDate: d.issueDate ? new Date(d.issueDate) : null,
      credentialUrl: d.credentialUrl || null,
      imageUrl: d.imageUrl || null,
    },
  });
  return NextResponse.json({ certificate }, { status: 201 });
}
