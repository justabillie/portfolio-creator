import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { getSessionPayload } from "@/lib/session";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

const ALLOWED_FOLDERS = ["profile", "projects", "certificates"] as const;

export async function POST(request: Request) {
  const session = await getSessionPayload();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (typeof folder !== "string" || !ALLOWED_FOLDERS.includes(folder as never)) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed (use JPG, PNG, WebP, GIF, or PDF)" },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 5 MB)" },
        { status: 400 }
      );
    }

    const blob = await put(
      `${folder}/${session.userId}/${Date.now()}-${file.name}`,
      file,
      { access: "public", addRandomSuffix: false }
    );

    return NextResponse.json({
      url: blob.url,
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSessionPayload();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { url } = await request.json();
    if (typeof url !== "string" || !url.includes(session.userId)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }
    await del(url);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
