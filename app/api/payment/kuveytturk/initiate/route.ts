import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/services/server";
import { SITE } from "@/lib/site";
import {
  initiateEnrollment,
  isKuveytTurkConfigured,
  toKurus,
} from "@/lib/payment/kuveytturk";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Ödeme başlatma. Checkout sayfası buraya bir HTML form POST'u ile gelir
 * (tam sayfa navigasyon). Banka'nın 3D doğrulama HTML'i doğrudan tarayıcıya
 * yazılır; içindeki otomatik form kullanıcıyı bankanın SMS/3D ekranına taşır.
 *
 * ÖNEMLİ: Ödenecek tutar client'tan DEĞİL, DB'deki siparişten alınır —
 * böylece fiyat manipülasyonu engellenir.
 */
export async function POST(request: NextRequest) {
  if (!isKuveytTurkConfigured()) {
    return htmlError(
      "Ödeme sistemi henüz yapılandırılmadı. Lütfen daha sonra tekrar deneyin."
    );
  }

  const form = await request.formData();
  const orderId = String(form.get("orderId") ?? "");
  const cardHolderName = String(form.get("cardHolderName") ?? "").trim();
  const cardNumber = String(form.get("cardNumber") ?? "").replace(/\s+/g, "");
  const cardExpiry = String(form.get("cardExpiry") ?? "").trim(); // "AA/YY"
  const cardCvc = String(form.get("cardCvc") ?? "").trim();

  if (!orderId) {
    return htmlError("Sipariş bilgisi eksik.");
  }

  const order = await orderService.getById(orderId).catch(() => null);
  if (!order) {
    return htmlError("Sipariş bulunamadı.");
  }

  // Zaten ödenmiş siparişi tekrar ödemeye izin verme
  if (order.paymentStatus === "odendi") {
    return NextResponse.redirect(
      `${SITE.url}/checkout/sonuc?durum=basarili&siparis=${encodeURIComponent(order.orderNumber)}`,
      { status: 303 }
    );
  }

  // Kart son kullanma tarihini ayır: "AA/YY" → month="AA", year="YY"
  const [rawMonth, rawYear] = cardExpiry.split("/").map((s) => s.trim());
  const expireMonth = (rawMonth ?? "").padStart(2, "0").slice(0, 2);
  const expireYear = (rawYear ?? "").slice(-2);

  if (
    cardNumber.length < 15 ||
    !expireMonth ||
    !expireYear ||
    cardCvc.length < 3 ||
    !cardHolderName
  ) {
    return htmlError("Kart bilgileri geçersiz. Lütfen kontrol edip tekrar deneyin.");
  }

  const callbackUrl = `${SITE.url}/api/payment/kuveytturk/callback`;

  const result = await initiateEnrollment({
    merchantOrderId: order.id,
    amountKurus: toKurus(order.total),
    card: {
      holderName: cardHolderName,
      number: cardNumber,
      expireMonth,
      expireYear,
      cvv: cardCvc,
    },
    okUrl: callbackUrl,
    failUrl: callbackUrl,
  });

  if (!result.ok) {
    return htmlError(result.error);
  }

  // Banka 3D doğrulama HTML'ini doğrudan tarayıcıya bas
  return new NextResponse(result.html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

/** Basit hata sayfası — kullanıcıyı checkout sonuç sayfasına yönlendirir. */
function htmlError(message: string): NextResponse {
  const url = `${SITE.url}/checkout/sonuc?durum=hata&mesaj=${encodeURIComponent(
    message
  )}`;
  return NextResponse.redirect(url, { status: 303 });
}
