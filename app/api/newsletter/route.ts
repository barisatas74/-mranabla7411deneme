import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { checkRateLimit, getRequestRateLimitKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const limit = checkRateLimit({
      key: getRequestRateLimitKey("newsletter", req),
      limit: 8,
      windowMs: 30 * 60 * 1000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Çok fazla abonelik denemesi yapıldı. Lütfen biraz sonra tekrar deneyin." },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSec) },
        }
      );
    }

    const body = await req.json();
    const email = (body?.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Geçersiz e-posta." }, { status: 400 });
    }

    const db = await getDb();
    // INSERT IGNORE — zaten aboneyse hata vermez
    await db.execute(
      `INSERT IGNORE INTO newsletter_subscribers (email)
       VALUES (?)`,
      [email]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("newsletter route error:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
