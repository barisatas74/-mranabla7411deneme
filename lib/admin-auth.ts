import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "lr_admin";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 12;

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "",
    sessionToken: process.env.ADMIN_SESSION_TOKEN ?? "",
  };
}

export function isAdminConfigured() {
  const { password, sessionToken } = getAdminCredentials();
  return Boolean(password && sessionToken);
}

/**
 * API rotalari icin admin oturumu dogrular.
 * Cookie token, env ADMIN_SESSION_TOKEN ile esit olmali.
 * Geliştirmede ADMIN_SESSION_TOKEN bos ise true doner (yerel test).
 */
export function isAdminAuthenticated(request: NextRequest): boolean {
  const expectedToken = process.env.ADMIN_SESSION_TOKEN;
  if (!expectedToken) {
    return process.env.NODE_ENV !== "production";
  }
  const cookieValue = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return cookieValue === expectedToken;
}
