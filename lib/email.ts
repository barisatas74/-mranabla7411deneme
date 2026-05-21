/**
 * E-posta gönderim katmanı.
 *
 * Şu an STUB modda çalışır — RESEND_API_KEY tanımlı değilse sadece konsola
 * loglar, gerçek mail göndermez. Provider eklenince (Resend / SendGrid /
 * Postmark) sadece `dispatch()` fonksiyonu güncellenecek; tüm çağrı yerleri
 * aynı kalır.
 *
 * Kullanım:
 *   import { sendEmail } from "@/lib/email";
 *   import { orderStatusUpdateEmail } from "@/lib/email-templates";
 *
 *   const tpl = orderStatusUpdateEmail({ ... });
 *   await sendEmail({ to: "musteri@example.com", ...tpl });
 */

import "server-only";
import { SITE } from "./site";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export type SendEmailResult = {
  ok: boolean;
  provider: "resend" | "stub";
  id?: string;
  error?: string;
};

function getFromAddress(): string {
  return (
    process.env.EMAIL_FROM ??
    `${SITE.name} <no-reply@${new URL(SITE.url).hostname}>`
  );
}

/**
 * Resend HTTP API'sine gönderir. SDK yerine fetch — bağımlılık eklemeden
 * çalışır.
 */
async function dispatchViaResend(
  apiKey: string,
  input: SendEmailInput
): Promise<SendEmailResult> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: getFromAddress(),
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        reply_to: input.replyTo,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      return {
        ok: false,
        provider: "resend",
        error: `Resend ${response.status}: ${errorBody.slice(0, 200)}`,
      };
    }

    const data = (await response.json().catch(() => ({}))) as { id?: string };
    return { ok: true, provider: "resend", id: data.id };
  } catch (error) {
    return {
      ok: false,
      provider: "resend",
      error: error instanceof Error ? error.message : "Resend bağlantı hatası",
    };
  }
}

/**
 * Stub: provider yokken konsola loglar, üretimde sessizce başarı döner.
 * Çağıran kod e-posta giderse "ok: true" alır, gitmezse de iş akışı bozulmaz.
 */
function dispatchViaStub(input: SendEmailInput): SendEmailResult {
  if (process.env.NODE_ENV !== "production") {
    console.info("[email:stub] gönderilmedi (RESEND_API_KEY yok)", {
      to: input.to,
      subject: input.subject,
    });
  }
  return { ok: true, provider: "stub" };
}

export async function sendEmail(
  input: SendEmailInput
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    return dispatchViaResend(apiKey, input);
  }
  return dispatchViaStub(input);
}
