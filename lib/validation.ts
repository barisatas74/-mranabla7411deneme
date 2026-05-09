/**
 * Türkiye'ye özgü form validasyon yardımcıları.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTAL_CODE_REGEX = /^\d{5}$/;

/**
 * Türk telefon numarası mask'i: +90 5__ ___ __ __
 * Sadece rakam input'u alır, formatlı string döndürür.
 */
export function formatPhone(input: string): string {
  // Sadece rakamları al
  const digits = input.replace(/\D/g, "");

  // +90 prefix yönetimi
  let cleaned = digits;
  if (cleaned.startsWith("90")) cleaned = cleaned.slice(2);
  if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);
  cleaned = cleaned.slice(0, 10); // 5XX XXX XX XX

  if (cleaned.length === 0) return "";

  let formatted = "+90 ";
  if (cleaned.length > 0) formatted += cleaned.slice(0, 3);
  if (cleaned.length >= 4) formatted += " " + cleaned.slice(3, 6);
  if (cleaned.length >= 7) formatted += " " + cleaned.slice(6, 8);
  if (cleaned.length >= 9) formatted += " " + cleaned.slice(8, 10);
  return formatted;
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  // 5 ile başlayan 10 haneli (veya başında 90/0)
  const cleaned = digits.replace(/^(90|0)/, "");
  return /^5\d{9}$/.test(cleaned);
}

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export function isValidPostalCode(value: string): boolean {
  return POSTAL_CODE_REGEX.test(value.trim());
}

/**
 * TC Kimlik No validasyonu (11 haneli, algoritma ile)
 * https://tr.wikipedia.org/wiki/T%C3%BCrkiye_Cumhuriyeti_Kimlik_Numaras%C4%B1
 */
export function isValidTCKimlik(value: string): boolean {
  const tc = value.replace(/\D/g, "");
  if (tc.length !== 11) return false;
  if (tc[0] === "0") return false;

  const digits = tc.split("").map(Number);
  const sumOdd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const sumEven = digits[1] + digits[3] + digits[5] + digits[7];

  // 10. hane = ((sumOdd * 7) - sumEven) mod 10
  const check10 = (sumOdd * 7 - sumEven) % 10;
  if (check10 !== digits[9]) return false;

  // 11. hane = (ilk 10 hanenin toplamı) mod 10
  const sum10 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  if (sum10 % 10 !== digits[10]) return false;

  return true;
}

export function formatTCKimlik(input: string): string {
  return input.replace(/\D/g, "").slice(0, 11);
}

export function formatPostalCode(input: string): string {
  return input.replace(/\D/g, "").slice(0, 5);
}

/**
 * Kart numarası mask: 4242 4242 4242 4242
 */
export function formatCardNumber(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

/**
 * Luhn algoritması ile kart numarası doğrulama
 */
export function isValidCardNumber(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

/**
 * Kart son kullanım tarihi mask: MM/YY
 */
export function formatCardExpiry(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function isValidCardExpiry(value: string): boolean {
  const match = value.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000;
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expiry = new Date(year, month - 1, 1);
  // Son geçerli ay sonu
  const expiryEnd = new Date(year, month, 0, 23, 59, 59);
  return expiry >= new Date(now.getFullYear(), now.getMonth(), 1) && expiryEnd >= now;
}

export function formatCvc(input: string): string {
  return input.replace(/\D/g, "").slice(0, 4);
}

export function isValidCvc(value: string): boolean {
  return /^\d{3,4}$/.test(value);
}

/**
 * İl ve ilçe sade liste (genişletilebilir, MVP için 81 il)
 */
export const TR_CITIES = [
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Aksaray",
  "Amasya",
  "Ankara",
  "Antalya",
  "Ardahan",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bartın",
  "Batman",
  "Bayburt",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Düzce",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkari",
  "Hatay",
  "Iğdır",
  "Isparta",
  "İstanbul",
  "İzmir",
  "Kahramanmaraş",
  "Karabük",
  "Karaman",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kilis",
  "Kırıkkale",
  "Kırklareli",
  "Kırşehir",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Mardin",
  "Mersin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Osmaniye",
  "Rize",
  "Sakarya",
  "Samsun",
  "Şanlıurfa",
  "Siirt",
  "Sinop",
  "Sivas",
  "Şırnak",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Uşak",
  "Van",
  "Yalova",
  "Yozgat",
  "Zonguldak",
] as const;
