/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js inline script'leri için unsafe-inline + Vercel domain'leri
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.app *.vercel-insights.com",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: fonts.gstatic.com",
      "connect-src 'self' *.vercel-insights.com vitals.vercel-insights.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig = {
  poweredByHeader: false,
  images: {
    // Uzak gorsel kaynaklari. Ana domain ve hosting'in direct URL'i.
    remotePatterns: [
      { protocol: "https", hostname: "missbellalingree.com" },
      { protocol: "https", hostname: "www.missbellalingree.com" },
      { protocol: "https", hostname: "cdn.missbellalingree.com" },
      { protocol: "http", hostname: "cdn.missbellalingree.com" },
      // Hosting'in direkt URL'i HOSTING_DIRECT_URL env'inden okunacaksa
      // o domain'i de buraya elle eklemeniz gerekir.
    ],
  },
  /**
   * /uploads/* yollarini hosting'e proxy'le.
   * HOSTING_DIRECT_URL env tanimliysa Vercel ana domain'den gelen
   * /uploads/products/x.webp istegini hosting'in disk'ine yonlendirir.
   * Boylece subdomain (cdn.missbellalingree.com) acmaya gerek kalmaz.
   *
   * Ornek HOSTING_DIRECT_URL degerleri:
   *   https://kullaniciadi.hostingadi.com.tr
   *   https://server123.hostingadi.com
   *
   * Hosting'in size verdigi otomatik URL ne ise oraya yazin (sondaki / olmadan).
   */
  async rewrites() {
    const hostingUrl = (process.env.HOSTING_DIRECT_URL ?? "").replace(/\/$/, "");
    if (!hostingUrl) return [];
    return [
      {
        source: "/uploads/:path*",
        destination: `${hostingUrl}/uploads/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
