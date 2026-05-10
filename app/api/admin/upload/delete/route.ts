import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteUploadedFiles } from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Yetkisiz istek." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
  }

  const urls = Array.isArray((body as { urls?: unknown })?.urls)
    ? ((body as { urls: unknown[] }).urls.filter(
        (item): item is string => typeof item === "string"
      ) as string[])
    : [];

  if (urls.length === 0) {
    return NextResponse.json({ ok: true, deleted: 0 });
  }

  const deleted = await deleteUploadedFiles(urls);
  return NextResponse.json({ ok: true, deleted });
}
