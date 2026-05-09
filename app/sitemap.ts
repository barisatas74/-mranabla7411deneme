import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { path: "", priority: 1, changeFrequency: "daily" as const },
      { path: "/products", priority: 0.9, changeFrequency: "daily" as const },
      {
        path: "/hakkimizda",
        priority: 0.6,
        changeFrequency: "monthly" as const,
      },
      {
        path: "/iletisim",
        priority: 0.7,
        changeFrequency: "monthly" as const,
      },
      {
        path: "/musteri-hizmetleri",
        priority: 0.6,
        changeFrequency: "monthly" as const,
      },
      { path: "/sss", priority: 0.7, changeFrequency: "monthly" as const },
      {
        path: "/beden-tablosu",
        priority: 0.6,
        changeFrequency: "monthly" as const,
      },
      {
        path: "/kargo-teslimat",
        priority: 0.5,
        changeFrequency: "monthly" as const,
      },
      {
        path: "/iade-politikasi",
        priority: 0.4,
        changeFrequency: "yearly" as const,
      },
      {
        path: "/mesafeli-satis",
        priority: 0.3,
        changeFrequency: "yearly" as const,
      },
      { path: "/kvkk", priority: 0.3, changeFrequency: "yearly" as const },
      { path: "/gizlilik", priority: 0.3, changeFrequency: "yearly" as const },
    ] as const
  ).map(({ path, priority, changeFrequency }) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE.url}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE.url}/products?category=${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
