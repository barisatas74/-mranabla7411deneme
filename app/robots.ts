import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/admin-giris",
          "/api/",
          "/checkout",
          "/cart",
          "/favorilerim",
          "/hesabim",
          "/hesabim/",
          "/uye-ol",
          "/giris",
        ],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
