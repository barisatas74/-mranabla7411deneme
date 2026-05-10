/**
 * Tarayici tarafindan admin yukleme API'lari ile konusan kucuk istemci.
 * Tum gorseller sunucuda WebP'e cevrilip /public/uploads/{folder}/'a yazilir.
 */

export type UploadedFile = {
  url: string;
  size: number;
  filename: string;
};

export type UploadFolder = "products" | "categories";

export async function uploadImages(
  files: File[],
  folder: UploadFolder
): Promise<UploadedFile[]> {
  if (files.length === 0) return [];

  const formData = new FormData();
  formData.append("folder", folder);
  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(data?.error ?? "Görseller yüklenemedi.");
  }

  const data = (await response.json()) as { files: UploadedFile[] };
  return data.files;
}

export async function deleteUploadedImages(urls: string[]): Promise<number> {
  if (urls.length === 0) return 0;

  const response = await fetch("/api/admin/upload/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls }),
    credentials: "same-origin",
  });

  if (!response.ok) {
    return 0;
  }

  const data = (await response.json()) as { deleted: number };
  return data.deleted ?? 0;
}

/** Tek bir gorseli sil (best-effort, hata durumunda sessizce gecer) */
export async function deleteUploadedImage(url: string): Promise<void> {
  if (!url || !url.startsWith("/uploads/")) return;
  try {
    await deleteUploadedImages([url]);
  } catch {
    // sessizce gec
  }
}
