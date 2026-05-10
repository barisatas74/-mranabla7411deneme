/**
 * Sunucu tarafi gorsel yukleme yardimcilari.
 * Tum gorseller WebP formatina cevrilir; ardindan secili storage driver
 * (lokal disk veya FTP) uzerinden kalici depoya yazilir.
 *
 * Driver secimi:
 *   STORAGE_DRIVER=ftp    -> lib/storage/ftp.ts (hosting'e FTP)
 *   varsayilan            -> lib/storage/local.ts (/public/uploads)
 */

import "server-only";
import path from "node:path";
import { randomBytes } from "node:crypto";
import sharp from "sharp";
import { getStorage } from "@/lib/storage";

/** Izin verilen klasor adlari (path traversal koruyucu) */
export const UPLOAD_FOLDERS = ["products", "categories"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];
export const MAX_FILE_SIZE_MB = 10;

/** WebP donusum kalitesi ve maks. uzun kenar */
const WEBP_QUALITY = 85;
const MAX_DIMENSION = 2000;

/** Guvenli dosya adi uretir: <slug>-<base36 timestamp><hex8>.webp */
function generateFilename(originalName: string): string {
  const baseName =
    path
      .parse(originalName)
      .name.toLocaleLowerCase("tr")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "img";
  const stamp = Date.now().toString(36);
  const rand = randomBytes(4).toString("hex");
  return `${baseName}-${stamp}${rand}.webp`;
}

/** Dosyayi WebP'e cevirip storage driver uzerinden kaydeder */
export async function saveWebpFile(
  file: File,
  folder: UploadFolder
): Promise<{ url: string; size: number; filename: string }> {
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    throw new Error("Desteklenmeyen dosya tipi");
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`Dosya boyutu ${MAX_FILE_SIZE_MB} MB'tan büyük olamaz`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const webpBuffer = await sharp(buffer, { failOn: "none" })
    .rotate() // EXIF rotation
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();

  const filename = generateFilename(file.name);
  const storage = getStorage();
  return storage.saveBuffer(folder, filename, webpBuffer);
}

/** Tek bir gorsel URL'sini diskten/FTP'den siler */
export async function deleteUploadedFile(url: string): Promise<boolean> {
  if (!url || typeof url !== "string") return false;
  const storage = getStorage();
  return storage.deleteByUrl(url);
}

/** Toplu silme */
export async function deleteUploadedFiles(urls: string[]): Promise<number> {
  if (!Array.isArray(urls) || urls.length === 0) return 0;
  const results = await Promise.all(urls.map((url) => deleteUploadedFile(url)));
  return results.filter(Boolean).length;
}
