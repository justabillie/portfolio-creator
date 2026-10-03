import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const updateProfileSchema = z.object({
  fullName: z.string().min(1).max(100),
  headline: z.string().max(200).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().max(50).optional().nullable(),
  photoUrl: z.string().url().optional().nullable().or(z.literal("")),
  theme: z.enum(["minimal", "modern"]).optional(),
  isPublished: z.boolean().optional(),
});

export async function GET() {
  const session = await getSessionPayload();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId },
  });
  return NextResponse.json({ profile });
}

export async function PUT(request: Request) {
  const session = await getSessionPayload();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const profile = await prisma.profile.upsert({
      where: { userId: session.userId },
      create: {
        userId: session.userId,
        fullName: data.fullName,
        headline: data.headline ?? null,
        bio: data.bio ?? null,
        location: data.location ?? null,
        email: data.email || null,
        phone: data.phone ?? null,
        photoUrl: data.photoUrl || null,
        theme: data.theme ?? "minimal",
        isPublished: data.isPublished ?? false,
      },
      update: {
        fullName: data.fullName,
        headline: data.headline ?? null,
        bio: data.bio ?? null,
        location: data.location ?? null,
        email: data.email || null,
        phone: data.phone ?? null,
        photoUrl: data.photoUrl || null,
        theme: data.theme,
        isPublished: data.isPublished,
      },
    });

    return NextResponse.json({ profile });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
