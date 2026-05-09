/**
 * Tüm site genelinde kullanılan marka & SEO sabitleri.
 * Tek noktadan değişiklik için burada tutulur.
 */

export const SITE = {
  name: "Miss Bella",
  tagline: "Zarafetin en özel hâli",
  description:
    "Miss Bella; premium iç giyim, gecelik ve butik koleksiyonlarıyla zarafeti günlük konfora dokunan butik bir markadır.",
  shortDescription:
    "Premium iç giyim, gecelik ve butik koleksiyonları.",
  locale: "tr_TR",
  language: "tr",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.missbella.com.tr",
  twitter: "@missbella",
  email: "hello@missbella.com.tr",
  phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "",
  address: {
    streetAddress: "[Adres eklenecek]",
    addressLocality: "İstanbul",
    addressRegion: "İstanbul",
    addressCountry: "TR",
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
