import "server-only";
import { randomBytes } from "node:crypto";

export function nowIso(): string {
  return new Date().toISOString();
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${randomBytes(3).toString("hex")}`;
}

export function generateOrderNumber(): string {
  return `MB-${Date.now().toString(36).toUpperCase()}`;
}

export function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "object") return value as T;
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function parseDate(value: unknown): string {
  if (!value) return nowIso();
  if (typeof value === "string") return new Date(value).toISOString();
  if (value instanceof Date) return value.toISOString();
  return nowIso();
}

export function toNumber(value: unknown, fallback = 0): number {
  if (value == null) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function toBool(value: unknown): boolean {
  return value === 1 || value === "1" || value === true;
}
