import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/services/server";
import { SITE } from "@/lib/site";
import { parseCallback, provisionPayment } from "@/lib/payment/kuveytturk";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Banka 3D doğrulama sonrası buraya POST eder.
 *   - 3D başarılı → ProvisionGate ile ödeme çekilir → sipariş "ödendi"
 *   - 3D veya ödeme başarısız → sipariş iptal edilir (stok iade)
 * Sonuçta kullanıcı /checkout/sonuc sayfasına yönlendirilir.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);

  const authResponse =
    (form?.get("AuthenticationResponse") as string | null) ??
    (form?.get("authenticationResponse") as string | null) ??
    "";

  if (!authResponse) {
    return redirectResult("hata", { mesaj: "Banka yanıtı alınamadı." });
  }

  const callback = parseCallback(authResponse);
  const merchantOrderId = callback.merchantOrderId;

  if (!merchantOrderId) {
    return redirectResult("hata", { mesaj: "Sipariş referansı bulunamadı." });
  }

  const order = await orderService.getById(merchantOrderId).catch(() => null);

  // 3D doğrulama başarısız (ResponseCode "00" değilse)
  if (callback.responseCode !== "00") {
    if (order) {
      await cancelOrderSafe(order.id, "3D doğrulama başarısız oldu.");
    }
    return redirectResult("hata", {
      mesaj: "Kart doğrulaması başarısız oldu. Ödeme alınamadı.",
      siparis: order?.orderNumber,
    });
  }

  // 3D başarılı → ödemeyi çek (provision)
  const customerIp = getClientIp(request);
  const provision = await provisionPayment({ callback, customerIp });

  if (!provision.ok) {
    if (order) {
      await cancelOrderSafe(
        order.id,
        `Ödeme onaylanamadı: ${provision.responseMessage ?? provision.responseCode ?? "bilinmiyor"}`
      );
    }
    return redirectResult("hata", {
      mesaj:
        provision.responseMessage ||
        "Ödeme banka tarafından onaylanmadı. Kartınızdan çekim yapılmadı.",
      siparis: order?.orderNumber,
    });
  }

  // Ödeme başarılı → siparişi güncelle
  if (order) {
    await orderService
      .updateStatus(order.id, {
        status: "hazirlaniyor",
        paymentStatus: "odendi",
        shippingStatus: order.shippingStatus,
        trackingNumber: order.trackingNumber,
        trackingCarrier: order.trackingCarrier,
        trackingUrl: order.trackingUrl,
      })
      .catch((error) => {
        console.error("[kuveytturk callback] sipariş güncellenemedi:", error);
      });

    // Sipariş onay e-postası (stub — RESEND_API_KEY yoksa sessizce loglar)
    void sendConfirmationEmail(order.id).catch(() => {});
  }

  return redirectResult("basarili", { siparis: order?.orderNumber });
}

// Bazı bankalar callback'i GET ile de deneyebilir — güvenli tarafta olalım.
export async function GET() {
  return redirectResult("hata", {
    mesaj: "Geçersiz ödeme dönüşü.",
  });
}

async function cancelOrderSafe(orderId: string, reason: string): Promise<void> {
  try {
    await orderService.cancel(orderId, reason);
  } catch (error) {
    console.error("[kuveytturk callback] sipariş iptal edilemedi:", error);
  }
}

async function sendConfirmationEmail(orderId: string): Promise<void> {
  const order = await orderService.getById(orderId);
  if (!order) return;

  const [{ sendEmail }, { orderConfirmationEmail }] = await Promise.all([
    import("@/lib/email"),
    import("@/lib/email-templates"),
  ]);

  const tpl = orderConfirmationEmail({
    orderNumber: order.orderNumber,
    customerName: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
    customerEmail: order.customer.email,
    items: order.items.map((item) => ({
      name: item.productName,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.unitPrice,
      image: item.image,
    })),
    subtotal: order.subtotal,
    shipping: order.shippingFee,
    discount: order.discount,
    total: order.total,
    shippingAddress: {
      fullName: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
      address: order.customer.address,
      district: order.customer.district,
      city: order.customer.city,
      postalCode: "",
      phone: order.customer.phone,
    },
  });

  await sendEmail({
    to: order.customer.email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  });
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "127.0.0.1";
}

function redirectResult(
  durum: "basarili" | "hata",
  extra: { mesaj?: string; siparis?: string }
): NextResponse {
  const params = new URLSearchParams({ durum });
  if (extra.siparis) params.set("siparis", extra.siparis);
  if (extra.mesaj) params.set("mesaj", extra.mesaj);
  return NextResponse.redirect(
    `${SITE.url}/checkout/sonuc?${params.toString()}`,
    { status: 303 }
  );
}
