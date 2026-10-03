import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const schema = z.object({
  company: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  location: z.string().max(200).optional().nullable(),
  startDate: z.string().min(1),
  endDate: z.string().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
});

export async function GET() {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const experiences = await prisma.experience.findMany({
    where: { userId: session.userId },
    orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
  });
  return NextResponse.json({ experiences });
}

export async function POST(request: Request) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    const d = parsed.data;
    const experience = await prisma.experience.create({
      data: {
        userId: session.userId,
        company: d.company,
        role: d.role,
        location: d.location ?? null,
        startDate: new Date(d.startDate),
        endDate: d.endDate ? new Date(d.endDate) : null,
        description: d.description ?? null,
      },
    });
    return NextResponse.json({ experience }, { status: 201 });
  } catch (err) {
    console.error("Experience create error:", err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
