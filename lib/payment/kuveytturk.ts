/**
 * Kuveyt Türk Sanal POS — 3D Secure Model entegrasyonu (TDV2.0.0).
 *
 * Akış:
 *   1. initiateEnrollment()  → banka 3D doğrulama HTML'ini döndürür
 *      (kullanıcı tarayıcısında SMS/3D şifresi girer)
 *   2. Banka → callback URL'imize POST eder (AuthenticationResponse XML)
 *   3. provisionPayment()    → ödemeyi çeker, sonucu döndürür
 *
 * Tüm gizli bilgiler ortam değişkenlerinden (env) okunur. Kart bilgisi
 * hiçbir yerde saklanmaz — sadece bankaya iletilir.
 *
 * Gerekli env değişkenleri (Vercel):
 *   KUVEYTTURK_MERCHANT_ID   — Mağaza No
 *   KUVEYTTURK_CUSTOMER_ID   — Müşteri No
 *   KUVEYTTURK_USERNAME      — API kullanıcı adı
 *   KUVEYTTURK_PASSWORD      — API şifresi (StoreKey)
 *   KUVEYTTURK_TEST          — "true" ise test ortamı (varsayılan: production)
 */

import "server-only";
import { createHash } from "node:crypto";

const API_VERSION = "TDV2.0.0";
const CURRENCY_TRY = "0949";
const TX_TYPE_SALE = "Sale";
const SECURITY_3D = "3";

const PROD_BASE = "https://boa.kuveytturk.com.tr/sanalposservice";
const TEST_BASE = "https://boatest.kuveytturk.com.tr/boa.virtualpos.services";

export type KuveytTurkConfig = {
  merchantId: string;
  customerId: string;
  userName: string;
  password: string;
  isTest: boolean;
};

export function isKuveytTurkConfigured(): boolean {
  return Boolean(
    process.env.KUVEYTTURK_MERCHANT_ID &&
      process.env.KUVEYTTURK_CUSTOMER_ID &&
      process.env.KUVEYTTURK_USERNAME &&
      process.env.KUVEYTTURK_PASSWORD
  );
}

export function getKuveytTurkConfig(): KuveytTurkConfig {
  const merchantId = process.env.KUVEYTTURK_MERCHANT_ID;
  const customerId = process.env.KUVEYTTURK_CUSTOMER_ID;
  const userName = process.env.KUVEYTTURK_USERNAME;
  const password = process.env.KUVEYTTURK_PASSWORD;

  if (!merchantId || !customerId || !userName || !password) {
    throw new Error(
      "Kuveyt Türk POS yapılandırılmamış. KUVEYTTURK_MERCHANT_ID / " +
        "KUVEYTTURK_CUSTOMER_ID / KUVEYTTURK_USERNAME / KUVEYTTURK_PASSWORD gerekli."
    );
  }

  return {
    merchantId,
    customerId,
    userName,
    password,
    isTest: process.env.KUVEYTTURK_TEST === "true",
  };
}

function baseUrl(config: KuveytTurkConfig): string {
  return config.isTest ? TEST_BASE : PROD_BASE;
}

export function enrollmentGateUrl(config: KuveytTurkConfig): string {
  return `${baseUrl(config)}/Home/ThreeDModelPayGate`;
}

export function provisionGateUrl(config: KuveytTurkConfig): string {
  return `${baseUrl(config)}/Home/ThreeDModelProvisionGate`;
}

// ---------------------------------------------------------------------------
// Hash: base64( sha1_raw( str ) )
// ---------------------------------------------------------------------------
function hashString(input: string): string {
  return createHash("sha1").update(input, "utf8").digest("base64");
}

/**
 * HashData = hashString(
 *   MerchantId + MerchantOrderId + Amount + OkUrl + FailUrl + UserName +
 *   hashString(Password)
 * )
 * (ayraç yok — düz birleştirme). OkUrl/FailUrl provision aşamasında boştur.
 */
function buildHashData(params: {
  config: KuveytTurkConfig;
  merchantOrderId: string;
  amount: number;
  okUrl?: string;
  failUrl?: string;
}): string {
  const { config, merchantOrderId, amount, okUrl = "", failUrl = "" } = params;
  const hashedPassword = hashString(config.password);
  const plain =
    config.merchantId +
    merchantOrderId +
    String(amount) +
    okUrl +
    failUrl +
    config.userName +
    hashedPassword;
  return hashString(plain);
}

// ---------------------------------------------------------------------------
// XML yardımcıları
// ---------------------------------------------------------------------------
function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Basit XML değer çıkarıcı — <Tag>value</Tag> (namespace toleranslı). */
export function extractXmlValue(xml: string, tag: string): string | undefined {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = xml.match(re);
  return match ? match[1].trim() : undefined;
}

// ---------------------------------------------------------------------------
// Tutar: TL → kuruş (int). 100.00 TL → 10000
// ---------------------------------------------------------------------------
export function toKurus(amountTl: number): number {
  return Math.round(amountTl * 100);
}

// ---------------------------------------------------------------------------
// 1. Enrollment (3D başlatma) — banka HTML'i döndürür
// ---------------------------------------------------------------------------
export type EnrollmentInput = {
  merchantOrderId: string;
  amountKurus: number;
  card: {
    holderName: string;
    number: string;
    expireMonth: string; // "01".."12"
    expireYear: string; // "yy" (2 hane)
    cvv: string;
  };
  okUrl: string;
  failUrl: string;
};

export type EnrollmentResult =
  | { ok: true; html: string }
  | { ok: false; error: string; responseCode?: string };

export async function initiateEnrollment(
  input: EnrollmentInput
): Promise<EnrollmentResult> {
  const config = getKuveytTurkConfig();

  const hashData = buildHashData({
    config,
    merchantOrderId: input.merchantOrderId,
    amount: input.amountKurus,
    okUrl: input.okUrl,
    failUrl: input.failUrl,
  });

  const xml =
    `<?xml version="1.0" encoding="utf-8"?>` +
    `<KuveytTurkVPosMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">` +
    `<APIVersion>${API_VERSION}</APIVersion>` +
    `<OkUrl>${xmlEscape(input.okUrl)}</OkUrl>` +
    `<FailUrl>${xmlEscape(input.failUrl)}</FailUrl>` +
    `<HashData>${hashData}</HashData>` +
    `<MerchantId>${xmlEscape(config.merchantId)}</MerchantId>` +
    `<CustomerId>${xmlEscape(config.customerId)}</CustomerId>` +
    `<UserName>${xmlEscape(config.userName)}</UserName>` +
    `<CardNumber>${xmlEscape(input.card.number)}</CardNumber>` +
    `<CardExpireDateYear>${xmlEscape(input.card.expireYear)}</CardExpireDateYear>` +
    `<CardExpireDateMonth>${xmlEscape(input.card.expireMonth)}</CardExpireDateMonth>` +
    `<CardCVV2>${xmlEscape(input.card.cvv)}</CardCVV2>` +
    `<CardHolderName>${xmlEscape(input.card.holderName)}</CardHolderName>` +
    `<TransactionType>${TX_TYPE_SALE}</TransactionType>` +
    `<InstallmentCount>0</InstallmentCount>` +
    `<Amount>${input.amountKurus}</Amount>` +
    `<DisplayAmount>${input.amountKurus}</DisplayAmount>` +
    `<CurrencyCode>${CURRENCY_TRY}</CurrencyCode>` +
    `<MerchantOrderId>${xmlEscape(input.merchantOrderId)}</MerchantOrderId>` +
    `<TransactionSecurity>${SECURITY_3D}</TransactionSecurity>` +
    `</KuveytTurkVPosMessage>`;

  try {
    const response = await fetch(enrollmentGateUrl(config), {
      method: "POST",
      headers: { "Content-Type": "application/xml; charset=utf-8" },
      body: xml,
    });

    const text = await response.text();

    // Başarılı enrollment → banka 3D doğrulama HTML sayfası döner.
    // Hata durumunda XML içinde ResponseCode/ResponseMessage döner.
    const looksLikeHtml = /<html|<form|document\.forms|<!DOCTYPE/i.test(text);
    if (looksLikeHtml) {
      return { ok: true, html: text };
    }

    const responseCode = extractXmlValue(text, "ResponseCode");
    const responseMessage =
      extractXmlValue(text, "ResponseMessage") ??
      extractXmlValue(text, "ResponseMsg");

    return {
      ok: false,
      error:
        responseMessage ||
        "Banka 3D doğrulama başlatılamadı. Kart bilgilerinizi kontrol edin.",
      responseCode,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? `Bankaya bağlanılamadı: ${error.message}`
          : "Bankaya bağlanılamadı.",
    };
  }
}

// ---------------------------------------------------------------------------
// 2. Callback doğrulama (banka → bize POST)
// ---------------------------------------------------------------------------
export type CallbackData = {
  responseCode?: string;
  merchantOrderId?: string;
  md?: string;
  amount?: string;
  currencyCode?: string;
  transactionSecurity?: string;
  installmentCount?: string;
  raw: string;
};

/**
 * Banka callback'inde gelen AuthenticationResponse (URL-encoded XML) içinden
 * provision için gereken alanları çıkarır.
 */
export function parseCallback(authenticationResponse: string): CallbackData {
  const xml = decodeURIComponent(authenticationResponse);
  return {
    responseCode: extractXmlValue(xml, "ResponseCode"),
    merchantOrderId: extractXmlValue(xml, "MerchantOrderId"),
    md: extractXmlValue(xml, "MD"),
    amount: extractXmlValue(xml, "Amount"),
    currencyCode: extractXmlValue(xml, "CurrencyCode"),
    transactionSecurity: extractXmlValue(xml, "TransactionSecurity"),
    installmentCount: extractXmlValue(xml, "InstallmentCount"),
    raw: xml,
  };
}

// ---------------------------------------------------------------------------
// 3. Provision (ödeme çekme) — 3D doğrulama başarılıysa
// ---------------------------------------------------------------------------
export type ProvisionResult = {
  ok: boolean;
  responseCode?: string;
  responseMessage?: string;
  orderId?: string;
  merchantOrderId?: string;
  raw: string;
};

export async function provisionPayment(params: {
  callback: CallbackData;
  customerIp: string;
}): Promise<ProvisionResult> {
  const config = getKuveytTurkConfig();
  const { callback, customerIp } = params;

  const merchantOrderId = callback.merchantOrderId ?? "";
  const amount = callback.amount ?? "0";

  const hashData = buildHashData({
    config,
    merchantOrderId,
    amount: Number(amount),
  });

  const xml =
    `<?xml version="1.0" encoding="utf-8"?>` +
    `<KuveytTurkVPosMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">` +
    `<APIVersion>${API_VERSION}</APIVersion>` +
    `<HashData>${hashData}</HashData>` +
    `<MerchantId>${xmlEscape(config.merchantId)}</MerchantId>` +
    `<CustomerId>${xmlEscape(config.customerId)}</CustomerId>` +
    `<UserName>${xmlEscape(config.userName)}</UserName>` +
    `<CustomerIPAddress>${xmlEscape(customerIp)}</CustomerIPAddress>` +
    `<KuveytTurkVPosAdditionalData>` +
    `<AdditionalData>` +
    `<Key>MD</Key>` +
    `<Data>${xmlEscape(callback.md ?? "")}</Data>` +
    `</AdditionalData>` +
    `</KuveytTurkVPosAdditionalData>` +
    `<TransactionType>${TX_TYPE_SALE}</TransactionType>` +
    `<InstallmentCount>${xmlEscape(callback.installmentCount ?? "0")}</InstallmentCount>` +
    `<Amount>${xmlEscape(amount)}</Amount>` +
    `<DisplayAmount>${xmlEscape(amount)}</DisplayAmount>` +
    `<CurrencyCode>${xmlEscape(callback.currencyCode ?? CURRENCY_TRY)}</CurrencyCode>` +
    `<MerchantOrderId>${xmlEscape(merchantOrderId)}</MerchantOrderId>` +
    `<TransactionSecurity>${xmlEscape(callback.transactionSecurity ?? SECURITY_3D)}</TransactionSecurity>` +
    `</KuveytTurkVPosMessage>`;

  try {
    const response = await fetch(provisionGateUrl(config), {
      method: "POST",
      headers: { "Content-Type": "application/xml; charset=utf-8" },
      body: xml,
    });

    const text = await response.text();
    const responseCode = extractXmlValue(text, "ResponseCode");

    return {
      ok: responseCode === "00",
      responseCode,
      responseMessage:
        extractXmlValue(text, "ResponseMessage") ??
        extractXmlValue(text, "ResponseMsg"),
      orderId: extractXmlValue(text, "OrderId"),
      merchantOrderId: extractXmlValue(text, "MerchantOrderId") ?? merchantOrderId,
      raw: text,
    };
  } catch (error) {
    return {
      ok: false,
      responseMessage:
        error instanceof Error
          ? `Ödeme onaylanamadı: ${error.message}`
          : "Ödeme onaylanamadı.",
      raw: "",
    };
  }
}
