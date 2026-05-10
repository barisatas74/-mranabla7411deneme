/**
 * Sunucu tarafi gorsel yukleme yardimcilari.
 * Tum gorseller WebP formatina cevrilip diske yazilir.
 *
 * Yol semasi: /public/uploads/{folder}/{slug}-{rand}.webp
 * Public URL : /uploads/{folder}/{slug}-{rand}.webp
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import sharp from "sharp";

export const UPLOAD_PUBLIC_PREFIX = "/uploads";
export const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

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

/** Guvenli dosya adi uretir: tarih + 6 byte hex */
function generateFilename(originalName: string): string {
  const baseName = path
    .parse(originalName)
    .name.toLocaleLowerCase("tr")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "img";
  const stamp = Date.now().toString(36);
  const rand = randomBytes(4).toString("hex");
  return `${baseName}-${stamp}${rand}.webp`;
}

function assertSafeFolder(folder: string): UploadFolder {
  if (!UPLOAD_FOLDERS.includes(folder as UploadFolder)) {
    throw new Error(`Geçersiz klasör: ${folder}`);
  }
  return folder as UploadFolder;
}

/** Dosyayi WebP'e cevirip diske yazar, public URL doner */
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
  const targetDir = path.join(UPLOAD_ROOT, folder);
  await fs.mkdir(targetDir, { recursive: true });
  const targetPath = path.join(targetDir, filename);
  await fs.writeFile(targetPath, webpBuffer);

  return {
    url: `${UPLOAD_PUBLIC_PREFIX}/${folder}/${filename}`,
    size: webpBuffer.byteLength,
    filename,
  };
}

/**
 * URL'den disk yolu cikartir. Yalnizca /uploads/{folder}/{file}.webp
 * yapisindaki yollar kabul edilir; data URI veya disaridaki URL'lerde
 * sessizce yok sayilir.
 */
function resolveUploadPath(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  if (!url.startsWith(`${UPLOAD_PUBLIC_PREFIX}/`)) return null;

  const relative = url.slice(UPLOAD_PUBLIC_PREFIX.length + 1); // "products/foo.webp"
  const parts = relative.split("/");
  if (parts.length !== 2) return null;

  const [folder, file] = parts;
  try {
    assertSafeFolder(folder);
  } catch {
    return null;
  }

  // Path traversal koruyucu
  if (file.includes("..") || file.includes("/") || file.includes("\\")) {
    return null;
  }

  return path.join(UPLOAD_ROOT, folder, file);
}

/** Tek bir gorsel URL'sini (uploaded ise) diskten siler */
export async function deleteUploadedFile(url: string): Promise<boolean> {
  const target = resolveUploadPath(url);
  if (!target) return false;

  try {
    await fs.unlink(target);
    return true;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return false;
    console.error("Görsel silme hatası:", error);
    return false;
  }
}

/** Bir liste icindeki tum yuklenmis gorselleri (varsa) toplu siler */
export async function deleteUploadedFiles(urls: string[]): Promise<number> {
  if (!Array.isArray(urls)) return 0;
  const results = await Promise.all(urls.map((url) => deleteUploadedFile(url)));
  return results.filter(Boolean).length;
}
