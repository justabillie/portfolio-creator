import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const updateProfileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  headline: z.string().max(200).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  email: z
    .string()
    .email()
    .optional()
    .nullable()
    .or(z.literal("")),
  phone: z.string().max(50).optional().nullable(),
  photoUrl: z
    .string()
    .url()
    .optional()
    .nullable()
    .or(z.literal("")),
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

    const d = parsed.data;

    // Build the update payload for fields that were actually provided
    const update: Record<string, unknown> = {};
    if (d.fullName !== undefined) update.fullName = d.fullName;
    if (d.headline !== undefined) update.headline = d.headline ?? null;
    if (d.bio !== undefined) update.bio = d.bio ?? null;
    if (d.location !== undefined) update.location = d.location ?? null;
    if (d.email !== undefined) update.email = d.email || null;
    if (d.phone !== undefined) update.phone = d.phone ?? null;
    if (d.photoUrl !== undefined) update.photoUrl = d.photoUrl || null;
    if (d.theme !== undefined) update.theme = d.theme;
    if (d.isPublished !== undefined) update.isPublished = d.isPublished;

    // For creating: require fullName if this is the first time
    const existing = await prisma.profile.findUnique({
      where: { userId: session.userId },
    });

    let profile;
    if (existing) {
      profile = await prisma.profile.update({
        where: { userId: session.userId },
        data: update,
      });
    } else {
      // Create with defaults for any missing required field
      profile = await prisma.profile.create({
        data: {
          userId: session.userId,
          fullName: d.fullName ?? session.username,
          headline: d.headline ?? null,
          bio: d.bio ?? null,
          location: d.location ?? null,
          email: d.email || null,
          phone: d.phone ?? null,
          photoUrl: d.photoUrl || null,
          theme: d.theme ?? "minimal",
          isPublished: d.isPublished ?? false,
        },
      });
    }

    return NextResponse.json({ profile });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
