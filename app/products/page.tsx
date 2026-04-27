import type { Metadata } from "next";
import ProductsCatalog from "@/components/products/ProductsCatalog";
import { isCategorySlug } from "@/data/categories";
import { ProductFilter, ProductSort } from "@/types";

export const metadata: Metadata = {
  title: "Urunler",
  description:
    "Kategori, fiyat, renk ve beden filtreleri ile Miss Bella urun katalogunu kesfedin.",
};

type ProductsPageProps = {
  searchParams?: Promise<{
    category?: string | string[];
    filter?: string | string[];
    sort?: string | string[];
  }>;
};

const validFilters = new Set<ProductFilter>(["all", "new", "sale"]);
const validSorts = new Set<ProductSort>([
  "featured",
  "new",
  "price-asc",
  "price-desc",
]);

function getSingleValue(value?: string | string[]) {
  return typeof value === "string" ? value : undefined;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const categoryParam = getSingleValue(resolvedSearchParams?.category);
  const filterParam = getSingleValue(resolvedSearchParams?.filter);
  const sortParam = getSingleValue(resolvedSearchParams?.sort);

  const initialCategory =
    categoryParam && isCategorySlug(categoryParam) ? categoryParam : "all";
  const initialFilter =
    filterParam && validFilters.has(filterParam as ProductFilter)
      ? (filterParam as ProductFilter)
      : "all";
  const initialSort =
    sortParam && validSorts.has(sortParam as ProductSort)
      ? (sortParam as ProductSort)
      : "featured";

  return (
    <ProductsCatalog
      initialCategory={initialCategory}
      initialFilter={initialFilter}
      initialSort={initialSort}
    />
  );
}
