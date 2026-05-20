import type { Metadata } from "next";
import ProductsCatalog from "@/components/products/ProductsCatalog";
import ComingSoon from "@/components/ComingSoon";
import Breadcrumb from "@/components/Breadcrumb";
import { getStorefrontCategories, getStorefrontProducts } from "@/lib/storefront-data";
import { ProductFilter, ProductSort } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ürünler",
  description:
    "Kategori, fiyat, renk ve beden filtreleri ile Miss Bella ürün kataloğunu keşfedin.",
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
  const [products, categories] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontCategories(),
  ]);
  if (products.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: "Ürünler" }]} />
        <ComingSoon />
      </>
    );
  }

  const resolvedSearchParams = await searchParams;
  const categoryParam = getSingleValue(resolvedSearchParams?.category);
  const filterParam = getSingleValue(resolvedSearchParams?.filter);
  const sortParam = getSingleValue(resolvedSearchParams?.sort);
  const visibleCategories = categories.filter((category) => category.status === "active");
  const categorySlugs = new Set(visibleCategories.map((category) => category.slug));

  const initialCategory =
    categoryParam && categorySlugs.has(categoryParam) ? categoryParam : "all";
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
      products={products}
      categories={visibleCategories}
    />
  );
}
