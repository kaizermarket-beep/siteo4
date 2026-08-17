import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { resolveIdentity } from "@/lib/identity";
import { rateLimit } from "@/lib/rate-limit";

// Local filesystem storage under public/uploads — fine for the current
// single-instance local-dev deployment, but public/ isn't writable at
// runtime on serverless (Vercel). Swap this for Vercel Blob (or S3) when
// migrating off localhost — only this route needs to change, callers just
// consume the returned { url }.
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  const identity = await resolveIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { allowed } = await rateLimit(`upload:${identity.userId}`, 30, 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Trop d'envois. Réessayez dans une minute." }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Format non supporté. Utilisez JPG, PNG, WEBP ou GIF." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image trop lourde (5 Mo max)." }, { status: 400 });
  }

  const filename = `${randomBytes(16).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
