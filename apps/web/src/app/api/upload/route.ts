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

type ImageFormat = "jpg" | "png" | "webp" | "gif";

// What the browser *claims*. Only used to reject obvious junk before reading
// the body — the bytes decide (see sniffImageFormat). "image/jpg" is not a
// real MIME type but some clients send it anyway.
const DECLARED_TYPES: Record<string, ImageFormat> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * Identify the format from the file's own leading bytes.
 *
 * `file.type` is whatever the client put in the multipart headers; it is a
 * label, not evidence. Trusting it meant an HTML page (or an SVG carrying a
 * script) could be uploaded as "image/png", stored under a .png name, and
 * then served from our own origin — where a browser that sniffs content, or
 * a victim opening the file directly, executes it as same-origin script.
 * The X-Content-Type-Options: nosniff header added in next.config.ts closes
 * the sniffing half of that; this closes the storage half.
 */
function sniffImageFormat(buffer: Buffer): ImageFormat | null {
  // JPEG: SOI marker followed by any marker byte.
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }

  // PNG: the 8-byte signature, whose CR/LF/EOF bytes also catch transfers
  // that mangled line endings.
  const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(PNG)) {
    return "png";
  }

  // GIF: "GIF87a" or "GIF89a".
  if (buffer.length >= 6) {
    const magic = buffer.toString("latin1", 0, 6);
    if (magic === "GIF87a" || magic === "GIF89a") return "gif";
  }

  // WEBP is a RIFF container: "RIFF" ...4 length bytes... "WEBP".
  if (
    buffer.length >= 12 &&
    buffer.toString("latin1", 0, 4) === "RIFF" &&
    buffer.toString("latin1", 8, 12) === "WEBP"
  ) {
    return "webp";
  }

  return null;
}

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

  const declared = DECLARED_TYPES[file.type];
  if (!declared) {
    return NextResponse.json(
      { error: "Format non supporté. Utilisez JPG, PNG, WEBP ou GIF." },
      { status: 400 }
    );
  }
  // Checked before reading the body, so an oversized upload is refused
  // without buffering it in memory.
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image trop lourde (5 Mo max)." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const actual = sniffImageFormat(buffer);
  if (!actual) {
    return NextResponse.json(
      { error: "Ce fichier n'est pas une image valide (JPG, PNG, WEBP ou GIF)." },
      { status: 400 }
    );
  }
  // A real image saved with the wrong label is a mistake; a mismatch is at
  // best a broken client and at worst a deliberate one. Either way the file
  // must not land on disk under an extension its content contradicts.
  if (actual !== declared) {
    return NextResponse.json(
      { error: "Le contenu du fichier ne correspond pas à son format annoncé." },
      { status: 400 }
    );
  }

  // Named from the sniffed format, never from the client's filename or its
  // declared type: the extension is what decides the Content-Type when the
  // file is served back.
  const filename = `${randomBytes(16).toString("hex")}.${actual}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
