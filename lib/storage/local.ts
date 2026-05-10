/**
 * Lokal disk driver (Vercel disinda — VPS / yerel gelistirme).
 * Vercel'de ephemeral oldugu icin kalici olmaz.
 */

import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { StorageDriver, SaveFileResult } from "@/lib/storage/types";

const PUBLIC_PREFIX = "/uploads";
const ROOT = path.join(process.cwd(), "public", "uploads");

export const localStorage: StorageDriver = {
  async saveBuffer(folder, filename, buffer): Promise<SaveFileResult> {
    const targetDir = path.join(ROOT, folder);
    await fs.mkdir(targetDir, { recursive: true });
    const targetPath = path.join(targetDir, filename);
    await fs.writeFile(targetPath, buffer);
    return {
      url: `${PUBLIC_PREFIX}/${folder}/${filename}`,
      filename,
      size: buffer.byteLength,
    };
  },

  async deleteByUrl(url) {
    if (!url || !url.startsWith(`${PUBLIC_PREFIX}/`)) return false;

    const relative = url.slice(PUBLIC_PREFIX.length + 1);
    const parts = relative.split("/");
    if (parts.length !== 2) return false;

    const [folder, file] = parts;
    if (file.includes("..") || file.includes("\\")) return false;

    const target = path.join(ROOT, folder, file);
    try {
      await fs.unlink(target);
      return true;
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return false;
      console.error("Lokal dosya silme hatasi:", error);
      return false;
    }
  },
};
