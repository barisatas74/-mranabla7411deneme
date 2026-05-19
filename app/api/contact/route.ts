import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { randomBytes } from "node:crypto";

function generateId() {
  return `msg-${Date.now().toString(36)}${randomBytes(3).toString("hex")}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body as Record<
      string,
      string
    >;

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Eksik alanlar var." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Geçersiz e-posta." }, { status: 400 });
    }
    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Mesaj çok kısa." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const id = generateId();
    await db.execute(
      `INSERT INTO contact_messages (id, name, email, phone, subject, message, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        id,
        name.trim(),
        email.trim().toLowerCase(),
        phone?.trim() || null,
        subject?.trim() || "diger",
        message.trim(),
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact route error:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
