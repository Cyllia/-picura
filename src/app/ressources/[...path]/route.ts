import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const MIME_TYPES: Record<string, string> = {
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: requestedPath } = await params;
  const resourcesRoot = path.resolve(process.cwd(), "ressources");
  const filePath = path.resolve(resourcesRoot, ...requestedPath);

  if (!filePath.startsWith(`${resourcesRoot}${path.sep}`)) {
    return NextResponse.json({ error: "Invalid resource path" }, { status: 400 });
  }

  try {
    const file = await readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();

    return new NextResponse(new Uint8Array(file), {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
        "content-type": MIME_TYPES[extension] ?? "application/octet-stream",
      },
    });
  } catch {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }
}
