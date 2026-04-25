import { Category, ProductCategorySlug } from "@/types";

export const categories: Category[] = [
  {
    id: "c1",
    name: "Sutyenler",
    slug: "sutyenler",
    image:
      "https://images.unsplash.com/photo-1583515558997-83406f8e024e?w=900&q=80",
    tagline: "Zarif destek",
  },
  {
    id: "c2",
    name: "Kulotlar",
    slug: "kulotlar",
    image:
      "https://images.unsplash.com/photo-1594224457860-23bdb45f8b59?w=900&q=80",
    tagline: "Yumusak dokunus",
  },
  {
    id: "c3",
    name: "Takimlar",
    slug: "takimlar",
    image:
      "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=900&q=80",
    tagline: "Uyumun zarafeti",
  },
  {
    id: "c4",
    name: "Gecelikler",
    slug: "gecelikler",
    image:
      "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=900&q=80",
    tagline: "Ipeksi geceler",
  },
  {
    id: "c5",
    name: "Sortlu Takimlar",
    slug: "sortlu-takimlar",
    image:
      "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=900&q=80",
    tagline: "Rahat luks",
  },
  {
    id: "c6",
    name: "Spor Ic Giyim",
    slug: "spor",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80",
    tagline: "Hareket ozgurlugu",
  },
];

const categoryMap = new Map(categories.map((category) => [category.slug, category]));

export function getCategoryBySlug(slug: ProductCategorySlug) {
  return categoryMap.get(slug);
}

export function isCategorySlug(value: string): value is ProductCategorySlug {
  return categoryMap.has(value as ProductCategorySlug);
}
