import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const schema = z.object({
  institution: z.string().min(1).max(200),
  degree: z.string().min(1).max(200),
  field: z.string().max(200).optional().nullable(),
  startDate: z.string().min(1),
  endDate: z.string().optional().nullable(),
  gpa: z.string().max(20).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
});

export async function GET() {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const educations = await prisma.education.findMany({
    where: { userId: session.userId },
    orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
  });
  return NextResponse.json({ educations });
}

export async function POST(request: Request) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const d = parsed.data;
  const education = await prisma.education.create({
    data: {
      userId: session.userId,
      institution: d.institution,
      degree: d.degree,
      field: d.field ?? null,
      startDate: new Date(d.startDate),
      endDate: d.endDate ? new Date(d.endDate) : null,
      gpa: d.gpa ?? null,
      description: d.description ?? null,
    },
  });
  return NextResponse.json({ education }, { status: 201 });
}
