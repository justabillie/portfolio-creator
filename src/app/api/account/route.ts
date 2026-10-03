import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionPayload, clearSessionCookie } from "@/lib/session";

const updateSchema = z.object({
  email: z.string().email().optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_-]+$/, "Lowercase letters, numbers, - and _ only")
    .optional(),
});

export async function PUT(request: Request) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, username } = parsed.data;

  // Check for collisions
  if (email || username) {
    const conflict = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(username ? [{ username }] : []),
        ],
        NOT: { id: session.userId },
      },
      select: { email: true, username: true },
    });

    if (conflict) {
      if (email && conflict.email === email) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
  }

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: {
      ...(email && { email }),
      ...(username && { username }),
    },
    select: { id: true, email: true, username: true },
  });

  return NextResponse.json({ user });
}

export async function DELETE() {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Cascade deletes will remove profile, projects, etc. (defined in Prisma schema)
  await prisma.user.delete({ where: { id: session.userId } });
  await clearSessionCookie();

  return NextResponse.json({ ok: true });
}
