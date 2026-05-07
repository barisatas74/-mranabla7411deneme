import { Category, ProductCategorySlug } from "@/types";

export const categories: Category[] = [
  {
    id: "c1",
    name: "Sütyenler",
    slug: "sutyenler",
    image:
      "https://images.unsplash.com/photo-1763192788440-5036b6c90841?w=900&q=80&auto=format&fit=crop",
    tagline: "Zarif destek",
  },
  {
    id: "c2",
    name: "Külotlar",
    slug: "kulotlar",
    image:
      "https://images.unsplash.com/photo-1594956668048-e86c9a562529?w=900&q=80&auto=format&fit=crop",
    tagline: "Yumuşak dokunuş",
  },
  {
    id: "c3",
    name: "Takımlar",
    slug: "takimlar",
    image:
      "https://images.unsplash.com/photo-1762195020450-4447ebcf8de5?w=900&q=80&auto=format&fit=crop",
    tagline: "Uyumun zarafeti",
  },
  {
    id: "c4",
    name: "Gecelikler",
    slug: "gecelikler",
    image:
      "https://images.unsplash.com/photo-1770294759243-664b21a8ac38?w=900&q=80&auto=format&fit=crop",
    tagline: "İpeksi geceler",
  },
  {
    id: "c5",
    name: "Şortlu Takımlar",
    slug: "sortlu-takimlar",
    image:
      "https://images.unsplash.com/photo-1766056278798-39cabf7ca628?w=900&q=80&auto=format&fit=crop",
    tagline: "Rahat lüks",
  },
  {
    id: "c6",
    name: "Spor İç Giyim",
    slug: "spor",
    image:
      "https://images.unsplash.com/photo-1649345946706-afbf86eee046?w=900&q=80&auto=format&fit=crop",
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
