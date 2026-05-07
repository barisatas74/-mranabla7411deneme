import { Category, ProductCategorySlug } from "@/types";

export const categories: Category[] = [
  {
    id: "c1",
    name: "Sütyenler",
    slug: "sutyenler",
    image: "",
    tagline: "Zarif destek",
  },
  {
    id: "c2",
    name: "Külotlar",
    slug: "kulotlar",
    image: "",
    tagline: "Yumuşak dokunuş",
  },
  {
    id: "c3",
    name: "Takımlar",
    slug: "takimlar",
    image: "",
    tagline: "Uyumun zarafeti",
  },
  {
    id: "c4",
    name: "Gecelikler",
    slug: "gecelikler",
    image: "",
    tagline: "İpeksi geceler",
  },
  {
    id: "c5",
    name: "Şortlu Takımlar",
    slug: "sortlu-takimlar",
    image: "",
    tagline: "Rahat lüks",
  },
  {
    id: "c6",
    name: "Spor İç Giyim",
    slug: "spor",
    image: "",
    tagline: "Hareket özgürlüğü",
  },
];

const categoryMap = new Map(categories.map((category) => [category.slug, category]));

export function getCategoryBySlug(slug: ProductCategorySlug) {
  return categoryMap.get(slug);
}

export function isCategorySlug(value: string): value is ProductCategorySlug {
  return categoryMap.has(value as ProductCategorySlug);
}
