import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const schema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().max(50).optional().nullable(),
  proficiency: z.number().int().min(1).max(5).optional().nullable(),
});

export async function GET() {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const skills = await prisma.skill.findMany({
    where: { userId: session.userId },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return NextResponse.json({ skills });
}

export async function POST(request: Request) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const d = parsed.data;
  const skill = await prisma.skill.create({
    data: {
      userId: session.userId,
      name: d.name,
      category: d.category ?? null,
      proficiency: d.proficiency ?? null,
    },
  });
  return NextResponse.json({ skill }, { status: 201 });
}
