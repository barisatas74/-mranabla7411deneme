import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body?.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Geçersiz e-posta." }, { status: 400 });
    }

    const db = await getDb();
    // INSERT IGNORE — zaten aboneyse hata vermez
    await db.execute(
      `INSERT IGNORE INTO newsletter_subscribers (email, subscribed_at)
       VALUES (?, NOW())`,
      [email]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("newsletter route error:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
