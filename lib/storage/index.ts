/**
 * Storage driver secici.
 *   STORAGE_DRIVER=ftp     -> hosting'in disk'ine FTP ile yaz (Vercel + hosting senaryosu)
 *   STORAGE_DRIVER=local   -> yerel /public/uploads (default — VPS / yerel test)
 *   bos                     -> local
 */

import "server-only";
import type { StorageDriver } from "@/lib/storage/types";
import { localStorage } from "@/lib/storage/local";
import { ftpStorage } from "@/lib/storage/ftp";

export function getStorage(): StorageDriver {
  const driver = (process.env.STORAGE_DRIVER ?? "local").toLowerCase();
  if (driver === "ftp") return ftpStorage;
  return localStorage;
}

export function getStorageMode(): "ftp" | "local" {
  return (process.env.STORAGE_DRIVER ?? "local").toLowerCase() === "ftp"
    ? "ftp"
    : "local";
}
