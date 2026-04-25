import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  ADMIN_COOKIE_MAX_AGE,
  ADMIN_COOKIE_NAME,
  getAdminCredentials,
  isAdminConfigured,
} from "@/lib/admin-auth";

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

type Bucket = { count: number; resetAt: number };
const attempts = new Map<string, Bucket>();

function getBucket(key: string) {
  const now = Date.now();
  const bucket = attempts.get(key);
  if (!bucket || bucket.resetAt < now) {
    const fresh: Bucket = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    attempts.set(key, fresh);
    return fresh;
  }
  return bucket;
}

function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin yapilandirilmamis. Sunucu ayarlarini kontrol edin." },
      { status: 500 }
    );
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return NextResponse.json(
          { error: "Gecersiz istek kaynagi." },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Gecersiz istek kaynagi." },
        { status: 403 }
      );
    }
  }

  const clientKey = getClientKey(request);
  const bucket = getBucket(clientKey);
  if (bucket.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    const retryAfterSec = Math.ceil((bucket.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      {
        error:
          "Cok fazla basarisiz deneme. Lutfen bir sure bekleyip tekrar deneyin.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.max(60, retryAfterSec)) },
      }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Gecersiz istek." },
      { status: 400 }
    );
  }

  const { username, password, sessionToken } = getAdminCredentials();

  const usernameOk = safeEqual(body.username?.trim() ?? "", username);
  const passwordOk = safeEqual(body.password ?? "", password);
  if (!usernameOk || !passwordOk) {
    bucket.count += 1;
    return NextResponse.json(
      { error: "Kullanici adi veya parola hatali." },
      { status: 401 }
    );
  }

  attempts.delete(clientKey);

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return response;
}
