/**
 * Tüm site genelinde kullanılan marka & SEO sabitleri.
 * Tek noktadan değişiklik için burada tutulur.
 */

export const SITE = {
  name: "Miss Bella",
  legalName: "Miss Bella İç Giyim Ve Butik",
  tagline: "Zarafetin en özel hâli",
  description:
    "Miss Bella; premium iç giyim, gecelik ve butik koleksiyonlarıyla zarafeti günlük konfora dokunan butik bir markadır.",
  shortDescription:
    "Premium iç giyim, gecelik ve butik koleksiyonları.",
  locale: "tr_TR",
  language: "tr",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://missbellalingree.com",
  twitter: "@missbella",
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "",
  phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "0530 990 71 63",
  phoneE164: "+905309907163",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "905309907163",
  address: {
    streetAddress: "Eşref Dinçer Mah., Eski Pazar Cd. No: 20/A",
    addressLocality: "Gemlik",
    addressRegion: "Bursa",
    postalCode: "16600",
    addressCountry: "TR",
    full: "Eşref Dinçer Mah., Eski Pazar Cd. No: 20/A, 16600 Gemlik / Bursa",
  },
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
  },
} as const;

/**
 * Sayfa için absolute URL üretir.
 */
export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${SITE.url}${path}`;
}
