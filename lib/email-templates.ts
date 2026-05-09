/**
 * E-posta HTML şablonları.
 * Host kurulumunda Resend / Sendgrid / Postmark üzerinden gönderilmek üzere
 * hazır.
 *
 * Tüm şablonlar inline CSS kullanır (e-posta istemcileri için zorunlu).
 */

import { SITE } from "./site";

const BRAND_COLOR = "#ee2a8b";
const BRAND_DARK = "#a81062";
const TEXT_COLOR = "#0a0a0c";
const MUTED_COLOR = "#55555a";
const BG_COLOR = "#fffafc";
const CARD_BG = "#ffffff";

type OrderItem = {
  name: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  image?: string;
};

type OrderEmailData = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    district: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  estimatedDelivery?: string;
};

function formatTL(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

function emailShell(content: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${SITE.name}</title>
</head>
<body style="margin:0;padding:0;background:${BG_COLOR};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${TEXT_COLOR};">
  <span style="display:none !important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">${preheader}</span>
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <!-- Header -->
    <div style="text-align:center;padding:24px 0;border-bottom:1px solid #ffe1ef;">
      <a href="${SITE.url}" style="text-decoration:none;color:${TEXT_COLOR};font-family:Georgia,serif;font-size:32px;letter-spacing:-0.5px;">
        Miss <span style="font-style:italic;color:${BRAND_COLOR};">Bella</span>
      </a>
      <p style="margin:6px 0 0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${MUTED_COLOR};">
        Zarafetin en özel hâli
      </p>
    </div>

    ${content}

    <!-- Footer -->
    <div style="margin-top:40px;padding-top:24px;border-top:1px solid #ffe1ef;text-align:center;">
      <p style="margin:0 0 12px;font-size:13px;color:${MUTED_COLOR};">
        Sorularınız için: <a href="mailto:${SITE.email}" style="color:${BRAND_COLOR};text-decoration:none;">${SITE.email}</a>
      </p>
      <p style="margin:0 0 12px;font-size:11px;color:${MUTED_COLOR};letter-spacing:1px;">
        © ${new Date().getFullYear()} ${SITE.name} · Tüm hakları saklıdır
      </p>
      <div style="font-size:10px;color:${MUTED_COLOR};text-transform:uppercase;letter-spacing:2px;">
        <a href="${SITE.url}/gizlilik" style="color:${MUTED_COLOR};text-decoration:none;">Gizlilik</a>
        &nbsp;·&nbsp;
        <a href="${SITE.url}/kvkk" style="color:${MUTED_COLOR};text-decoration:none;">KVKK</a>
        &nbsp;·&nbsp;
        <a href="${SITE.url}/iletisim" style="color:${MUTED_COLOR};text-decoration:none;">İletişim</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Müşteriye gönderilen sipariş onay e-postası
 */
export function orderConfirmationEmail(data: OrderEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const itemsRows = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #ffe1ef;">
        <div style="font-size:14px;font-weight:500;color:${TEXT_COLOR};">${item.name}</div>
        ${
          item.size || item.color
            ? `<div style="font-size:12px;color:${MUTED_COLOR};margin-top:3px;">
                ${[item.size, item.color].filter(Boolean).join(" · ")}
              </div>`
            : ""
        }
      </td>
      <td style="padding:14px 0;border-bottom:1px solid #ffe1ef;text-align:center;font-size:13px;color:${MUTED_COLOR};">
        ${item.quantity}
      </td>
      <td style="padding:14px 0;border-bottom:1px solid #ffe1ef;text-align:right;font-size:14px;font-weight:500;color:${TEXT_COLOR};">
        ${formatTL(item.price * item.quantity)}
      </td>
    </tr>`
    )
    .join("");

  const content = `
    <div style="background:${CARD_BG};border-radius:16px;padding:32px;margin-top:24px;">
      <!-- Tebrik mesajı -->
      <div style="text-align:center;margin-bottom:32px;">
        <div style="display:inline-block;width:64px;height:64px;background:linear-gradient(135deg,${BRAND_COLOR},#ff52a8);border-radius:50%;line-height:64px;color:#fff;font-size:28px;font-weight:600;">
          ✓
        </div>
        <h1 style="margin:18px 0 8px;font-family:Georgia,serif;font-size:28px;color:${TEXT_COLOR};">
          Siparişiniz alındı!
        </h1>
        <p style="margin:0;font-size:14px;color:${MUTED_COLOR};">
          Merhaba <strong>${data.customerName}</strong>, siparişiniz için teşekkür ederiz.
        </p>
      </div>

      <!-- Sipariş No -->
      <div style="background:${BG_COLOR};border-radius:8px;padding:16px;margin-bottom:24px;text-align:center;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:${MUTED_COLOR};">Sipariş Numarası</div>
        <div style="margin-top:6px;font-family:Georgia,serif;font-size:22px;color:${BRAND_COLOR};letter-spacing:1px;">
          ${data.orderNumber}
        </div>
      </div>

      <!-- Ürünler tablo -->
      <h2 style="margin:0 0 12px;font-family:Georgia,serif;font-size:18px;color:${TEXT_COLOR};">
        Sipariş Detayı
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr>
            <th style="padding:8px 0;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:${MUTED_COLOR};border-bottom:2px solid ${BRAND_COLOR};">Ürün</th>
            <th style="padding:8px 0;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:${MUTED_COLOR};border-bottom:2px solid ${BRAND_COLOR};">Adet</th>
            <th style="padding:8px 0;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:${MUTED_COLOR};border-bottom:2px solid ${BRAND_COLOR};">Tutar</th>
          </tr>
        </thead>
        <tbody>${itemsRows}</tbody>
      </table>

      <!-- Toplam -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:${MUTED_COLOR};">Ara Toplam</td>
          <td style="padding:6px 0;font-size:13px;text-align:right;color:${TEXT_COLOR};">${formatTL(data.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:${MUTED_COLOR};">Kargo</td>
          <td style="padding:6px 0;font-size:13px;text-align:right;color:${TEXT_COLOR};">${
            data.shipping === 0 ? "Ücretsiz" : formatTL(data.shipping)
          }</td>
        </tr>
        ${
          data.discount
            ? `<tr>
                <td style="padding:6px 0;font-size:13px;color:${BRAND_COLOR};">İndirim</td>
                <td style="padding:6px 0;font-size:13px;text-align:right;color:${BRAND_COLOR};">-${formatTL(data.discount)}</td>
              </tr>`
            : ""
        }
        <tr>
          <td style="padding:14px 0 0;border-top:2px solid ${BRAND_COLOR};font-size:16px;font-weight:600;color:${TEXT_COLOR};">Toplam</td>
          <td style="padding:14px 0 0;border-top:2px solid ${BRAND_COLOR};text-align:right;font-family:Georgia,serif;font-size:22px;color:${BRAND_COLOR};">${formatTL(data.total)}</td>
        </tr>
      </table>

      <!-- Teslimat adresi -->
      <h2 style="margin:24px 0 12px;font-family:Georgia,serif;font-size:18px;color:${TEXT_COLOR};">
        Teslimat Adresi
      </h2>
      <div style="background:${BG_COLOR};border-radius:8px;padding:16px;font-size:13px;line-height:1.7;color:${TEXT_COLOR};">
        <strong>${data.shippingAddress.fullName}</strong><br>
        ${data.shippingAddress.address}<br>
        ${data.shippingAddress.district} / ${data.shippingAddress.city} ${data.shippingAddress.postalCode}<br>
        <span style="color:${MUTED_COLOR};">${data.shippingAddress.phone}</span>
      </div>

      ${
        data.estimatedDelivery
          ? `<p style="margin:20px 0 0;font-size:13px;color:${MUTED_COLOR};text-align:center;">
              Tahmini teslimat: <strong style="color:${TEXT_COLOR};">${data.estimatedDelivery}</strong>
            </p>`
          : ""
      }

      <!-- CTA -->
      <div style="text-align:center;margin-top:32px;">
        <a href="${SITE.url}" style="display:inline-block;background:linear-gradient(135deg,${BRAND_COLOR},#ff52a8);color:#fff;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:12px;text-transform:uppercase;letter-spacing:3px;font-weight:500;">
          Siteye Dön
        </a>
      </div>
    </div>

    <p style="margin:20px 0 0;font-size:12px;color:${MUTED_COLOR};text-align:center;line-height:1.6;">
      Sorularınız için bize <a href="mailto:${SITE.email}" style="color:${BRAND_COLOR};">${SITE.email}</a> adresinden ulaşabilirsiniz.
    </p>
  `;

  const text = `
Siparişiniz alındı!

Merhaba ${data.customerName},

Siparişinizi başarıyla aldık. Detaylar aşağıda:

Sipariş No: ${data.orderNumber}
Toplam: ${formatTL(data.total)}

Ürünler:
${data.items.map((i) => `- ${i.name} x${i.quantity} (${formatTL(i.price * i.quantity)})`).join("\n")}

Teslimat Adresi:
${data.shippingAddress.fullName}
${data.shippingAddress.address}
${data.shippingAddress.district} / ${data.shippingAddress.city}

Sorularınız için: ${SITE.email}

— ${SITE.name}
${SITE.url}
  `.trim();

  return {
    subject: `Siparişiniz alındı · ${data.orderNumber}`,
    html: emailShell(content, `Sipariş ${data.orderNumber} başarıyla alındı`),
    text,
  };
}

/**
 * Hoşgeldin / bülten abonelik onay e-postası
 */
export function welcomeEmail(name?: string): {
  subject: string;
  html: string;
  text: string;
} {
  const greeting = name ? `Merhaba ${name},` : "Merhaba,";
  const content = `
    <div style="background:${CARD_BG};border-radius:16px;padding:40px;margin-top:24px;text-align:center;">
      <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:32px;color:${TEXT_COLOR};">
        Hoş geldiniz!
      </h1>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:${MUTED_COLOR};">
        ${greeting} ${SITE.name} ailesine katıldığınız için teşekkür ederiz.
        Yeni koleksiyonlar, özel kampanyalar ve butik içeriklerden ilk siz
        haberdar olacaksınız.
      </p>
      <a href="${SITE.url}/products" style="display:inline-block;background:linear-gradient(135deg,${BRAND_COLOR},#ff52a8);color:#fff;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:12px;text-transform:uppercase;letter-spacing:3px;font-weight:500;">
        Koleksiyonu Keşfet
      </a>
    </div>
  `;
  return {
    subject: `${SITE.name}'a hoş geldiniz`,
    html: emailShell(content, `${SITE.name}'a hoş geldiniz`),
    text: `${greeting}\n\n${SITE.name} ailesine katıldığınız için teşekkür ederiz.\n\nKoleksiyonu keşfedin: ${SITE.url}/products\n\n— ${SITE.name}`,
  };
}

/**
 * Sipariş durumu güncellendiğinde gönderilen bildirim
 */
export function orderStatusUpdateEmail(data: {
  orderNumber: string;
  customerName: string;
  status: string;
  message: string;
  trackingUrl?: string;
}): { subject: string; html: string; text: string } {
  const content = `
    <div style="background:${CARD_BG};border-radius:16px;padding:32px;margin-top:24px;">
      <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:24px;color:${TEXT_COLOR};">
        Siparişinizde güncelleme var
      </h1>
      <p style="margin:0 0 24px;font-size:14px;color:${MUTED_COLOR};">
        Merhaba <strong>${data.customerName}</strong>,
      </p>
      <div style="background:${BG_COLOR};border-radius:8px;padding:20px;margin-bottom:24px;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:${MUTED_COLOR};">Sipariş ${data.orderNumber}</div>
        <div style="margin-top:8px;font-family:Georgia,serif;font-size:22px;color:${BRAND_COLOR};">
          ${data.status}
        </div>
        <p style="margin:12px 0 0;font-size:14px;line-height:1.7;color:${TEXT_COLOR};">
          ${data.message}
        </p>
      </div>
      ${
        data.trackingUrl
          ? `<div style="text-align:center;margin-top:24px;">
              <a href="${data.trackingUrl}" style="display:inline-block;background:${BRAND_DARK};color:#fff;text-decoration:none;padding:12px 28px;border-radius:999px;font-size:12px;text-transform:uppercase;letter-spacing:2px;">
                Kargo Takip
              </a>
            </div>`
          : ""
      }
    </div>
  `;
  return {
    subject: `${data.orderNumber} - ${data.status}`,
    html: emailShell(content),
    text: `Merhaba ${data.customerName},\n\nSipariş ${data.orderNumber}: ${data.status}\n\n${data.message}\n\n— ${SITE.name}`,
  };
}
