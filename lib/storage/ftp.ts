/**
 * FTP / FTPS driver — Vercel'den hosting'in disk'ine gorsel yazar/siler.
 *
 * Gerekli env degiskenleri:
 *   FTP_HOST           = ftp.missbellalingree.com (veya IP)
 *   FTP_PORT           = 21       (FTPS icin genelde 21, implicit FTPS icin 990)
 *   FTP_USER           = kullanici
 *   FTP_PASSWORD       = sifre
 *   FTP_SECURE         = false    ("true" -> FTPS)
 *   FTP_BASE_PATH      = /public_html/uploads   (hosting'deki yazma yolu)
 *   FTP_PUBLIC_URL     = https://missbellalingree.com/uploads
 *                        (yuklenen dosyalarin internetten erisilebildigi taban URL)
 *
 * Onemli: FTP_PUBLIC_URL'in URL'i gercekten hosting'in web sunucusu tarafindan
 * servis ediliyor olmali. Eger ana domain Vercel'e bagliysa, hosting icin alt
 * domain (ornek: cdn.missbellalingree.com -> hosting IP) acin.
 */

import "server-only";
import { Readable } from "node:stream";
import * as ftp from "basic-ftp";
import type { StorageDriver, SaveFileResult } from "@/lib/storage/types";

function getConfig() {
  const host = process.env.FTP_HOST;
  const user = process.env.FTP_USER;
  const password = process.env.FTP_PASSWORD;
  const basePath = process.env.FTP_BASE_PATH;
  const publicUrl = process.env.FTP_PUBLIC_URL;

  if (!host || !user || !password || !basePath || !publicUrl) {
    throw new Error(
      "FTP konfigurasyonu eksik. FTP_HOST/FTP_USER/FTP_PASSWORD/FTP_BASE_PATH/FTP_PUBLIC_URL gerekli."
    );
  }

  return {
    host,
    port: Number(process.env.FTP_PORT ?? 21),
    user,
    password,
    secure: (process.env.FTP_SECURE ?? "false").toLowerCase() === "true",
    basePath: basePath.replace(/\/$/, ""),
    publicUrl: publicUrl.replace(/\/$/, ""),
  };
}

async function withClient<T>(
  task: (client: ftp.Client) => Promise<T>
): Promise<T> {
  const config = getConfig();
  const client = new ftp.Client(30_000); // 30s timeout
  client.ftp.verbose = false;

  try {
    await client.access({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      secure: config.secure,
      secureOptions: config.secure
        ? { rejectUnauthorized: false }
        : undefined,
    });
    return await task(client);
  } finally {
    client.close();
  }
}

/** "/public_html/uploads/products" gibi tam yolu garanti olarak olusturur */
async function ensureRemoteDir(client: ftp.Client, fullPath: string) {
  await client.ensureDir(fullPath);
  // ensureDir cwd'yi degistirir; baslangica geri don
  await client.cd("/");
}

export const ftpStorage: StorageDriver = {
  async saveBuffer(folder, filename, buffer): Promise<SaveFileResult> {
    const config = getConfig();
    const remoteDir = `${config.basePath}/${folder}`;
    const remotePath = `${remoteDir}/${filename}`;

    await withClient(async (client) => {
      await ensureRemoteDir(client, remoteDir);
      const stream = Readable.from(buffer);
      await client.uploadFrom(stream, remotePath);
    });

    return {
      url: `${config.publicUrl}/${folder}/${filename}`,
      filename,
      size: buffer.byteLength,
    };
  },

  async deleteByUrl(url) {
    if (!url) return false;
    let config: ReturnType<typeof getConfig>;
    try {
      config = getConfig();
    } catch {
      return false;
    }

    if (!url.startsWith(`${config.publicUrl}/`)) return false;
    const relative = url.slice(config.publicUrl.length + 1);
    const parts = relative.split("/");
    if (parts.length !== 2) return false;
    const [folder, file] = parts;
    if (!folder || !file || file.includes("..") || file.includes("\\")) {
      return false;
    }

    const remotePath = `${config.basePath}/${folder}/${file}`;

    try {
      await withClient(async (client) => {
        await client.remove(remotePath);
      });
      return true;
    } catch (error: unknown) {
      const code = (error as { code?: number })?.code;
      // 550 = "File not found"
      if (code === 550) return false;
      console.error("FTP silme hatasi:", error);
      return false;
    }
  },
};
