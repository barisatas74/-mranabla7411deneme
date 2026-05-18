import "server-only";
import {
  createHmac,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from "node:crypto";

export const USER_COOKIE_NAME = "lr_user";
export const USER_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 gun

const HASH_KEYLEN = 64;
const SCRYPT_N = 16384;

function scryptDerive(
  password: string,
  salt: Buffer,
  keylen: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, { N: SCRYPT_N }, (err, derived) => {
      if (err) reject(err);
      else resolve(derived);
    });
  });
}

/**
 * Sifreyi scrypt ile hash'le.
 * Format: "scrypt:<saltHex>:<hashHex>"
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scryptDerive(password, salt, HASH_KEYLEN);
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

/** Hash karsilastir (timing-safe) */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  try {
    const [algo, saltHex, hashHex] = stored.split(":");
    if (algo !== "scrypt" || !saltHex || !hashHex) return false;
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const derived = await scryptDerive(password, salt, expected.length);
    if (derived.length !== expected.length) return false;
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/** Cookie icin gizli anahtar */
function getSecret(): string {
  const secret =
    process.env.USER_SESSION_SECRET ??
    process.env.ADMIN_SESSION_TOKEN ??
    "";
  if (!secret) {
    throw new Error(
      "Kullanici oturumu icin USER_SESSION_SECRET tanimli olmali."
    );
  }
  return secret;
}

/**
 * userId'yi HMAC ile imzala: "<userId>.<signature>"
 * Doğrulama: cookie değerinden userId'yi cikar, imzayi yeniden uret, esit mi?
 */
export function signSession(userId: string): string {
  const secret = getSecret();
  const sig = createHmac("sha256", secret).update(userId).digest("hex");
  return `${userId}.${sig}`;
}

export function verifySession(cookie: string | undefined): string | null {
  if (!cookie) return null;
  const dot = cookie.lastIndexOf(".");
  if (dot < 0) return null;
  const userId = cookie.slice(0, dot);
  const providedSig = cookie.slice(dot + 1);
  if (!userId || !providedSig) return null;
  try {
    const secret = getSecret();
    const expectedSig = createHmac("sha256", secret).update(userId).digest("hex");
    const a = Buffer.from(providedSig, "hex");
    const b = Buffer.from(expectedSig, "hex");
    if (a.length !== b.length) return null;
    return timingSafeEqual(a, b) ? userId : null;
  } catch {
    return null;
  }
}
