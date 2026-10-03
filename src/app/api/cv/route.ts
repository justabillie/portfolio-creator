import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getSessionPayload } from "@/lib/session";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["application/pdf"];

export async function GET() {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const cvFile = await prisma.cvFile.findUnique({ where: { userId: session.userId } });
  return NextResponse.json({ cvFile });
}

export async function POST(request: Request) {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 400 });
    }

    const existing = await prisma.cvFile.findUnique({ where: { userId: session.userId } });
    if (existing) {
      try {
        await del(existing.fileUrl);
      } catch (err) {
        console.warn("Failed to delete old CV blob:", err);
      }
    }

    const blob = await put(
      `cvs/${session.userId}/${Date.now()}-${file.name}`,
      file,
      { access: "public", addRandomSuffix: false }
    );

    const cvFile = await prisma.cvFile.upsert({
      where: { userId: session.userId },
      create: {
        userId: session.userId,
        fileUrl: blob.url,
        fileName: file.name,
        fileSize: file.size,
      },
      update: {
        fileUrl: blob.url,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date(),
      },
    });

    return NextResponse.json({ cvFile }, { status: 201 });
  } catch (err) {
    console.error("CV upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.cvFile.findUnique({ where: { userId: session.userId } });
  if (!existing) return NextResponse.json({ ok: true });

  try {
    await del(existing.fileUrl);
  } catch (err) {
    console.warn("Blob delete failed (may already be gone):", err);
  }

  await prisma.cvFile.delete({ where: { userId: session.userId } });
  return NextResponse.json({ ok: true });
}
