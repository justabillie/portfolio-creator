import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const schema = z.object({
  platform: z.string().min(1).max(50),
  url: z.string().url(),
});

export async function GET() {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const socialLinks = await prisma.socialLink.findMany({
    where: { userId: session.userId },
    orderBy: [{ sortOrder: "asc" }],
  });
  return NextResponse.json({ socialLinks });
}

export async function POST(request: Request) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const socialLink = await prisma.socialLink.create({
    data: {
      userId: session.userId,
      platform: parsed.data.platform,
      url: parsed.data.url,
    },
  });
  return NextResponse.json({ socialLink }, { status: 201 });
}

