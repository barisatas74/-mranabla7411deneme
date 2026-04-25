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
