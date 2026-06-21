import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db/client";
import { media } from "@/lib/db/schema";
import { UPLOAD_DIR, UPLOAD_URL_PREFIX } from "@/env";

export const runtime = "nodejs";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};
const isVideo = (t: string) => t.startsWith("video/");
const MAX_IMAGE = 15 * 1024 * 1024; // 15 MB
const MAX_VIDEO = 120 * 1024 * 1024; // 120 MB

export async function POST(req: NextRequest) {
  try {
    await requirePermission("content");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: "Unsupported type (use JPG/PNG/WebP/AVIF or MP4/WebM)" }, { status: 400 });
  const max = isVideo(file.type) ? MAX_VIDEO : MAX_IMAGE;
  if (file.size > max)
    return NextResponse.json({ error: `File too large (max ${isVideo(file.type) ? "120 MB" : "15 MB"})` }, { status: 400 });

  const alt = (form.get("alt") as string) || file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
  const filename = `${randomUUID()}.${ext}`;
  const dir = join(process.cwd(), UPLOAD_DIR);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, filename), Buffer.from(await file.arrayBuffer()));

  const url = `${UPLOAD_URL_PREFIX}/${filename}`;
  const [row] = await db.insert(media).values({ url, alt, mime: file.type }).returning();
  return NextResponse.json(row);
}
