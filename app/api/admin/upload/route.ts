import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  saveWebpFile,
  UPLOAD_FOLDERS,
  type UploadFolder,
  MAX_FILE_SIZE_MB,
  ACCEPTED_MIME_TYPES,
} from "@/lib/uploads";

export const runtime = "nodejs";
// Multipart yuklemeler icin payload limitini biraz acik tutuyoruz
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: "Yetkisiz istek." },
      { status: 401 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Form verisi okunamadi." },
      { status: 400 }
    );
  }

  const folderRaw = String(formData.get("folder") ?? "");
  if (!UPLOAD_FOLDERS.includes(folderRaw as UploadFolder)) {
    return NextResponse.json(
      { error: `Geçersiz klasör. İzin verilenler: ${UPLOAD_FOLDERS.join(", ")}` },
      { status: 400 }
    );
  }
  const folder = folderRaw as UploadFolder;

  const files = formData.getAll("files").filter((value): value is File => value instanceof File);
  if (files.length === 0) {
    return NextResponse.json(
      { error: "Yuklenecek dosya bulunamadi." },
      { status: 400 }
    );
  }

  const invalidType = files.find((file) => !ACCEPTED_MIME_TYPES.includes(file.type));
  if (invalidType) {
    return NextResponse.json(
      {
        error: `Desteklenmeyen dosya tipi: ${invalidType.type || invalidType.name}. Sadece JPG/PNG/WEBP/AVIF.`,
      },
      { status: 415 }
    );
  }

  const tooLarge = files.find((file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
  if (tooLarge) {
    return NextResponse.json(
      { error: `Her görsel en fazla ${MAX_FILE_SIZE_MB} MB olabilir (${tooLarge.name}).` },
      { status: 413 }
    );
  }

  try {
    const uploaded = await Promise.all(
      files.map((file) => saveWebpFile(file, folder))
    );
    return NextResponse.json({
      ok: true,
      count: uploaded.length,
      files: uploaded,
    });
  } catch (error) {
    console.error("Yukleme hatasi:", error);
    const message =
      error instanceof Error ? error.message : "Görsel kaydedilemedi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
