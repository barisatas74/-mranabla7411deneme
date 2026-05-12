import { getCategoryBySlug } from "@/data/categories";
import {
  Product,
  ProductFilter,
  ProductSort,
  ProductCategorySlug,
} from "@/types";

export const products: Product[] = [];

export function isProductOnSale(product: Product) {
  return Boolean(product.oldPrice && product.oldPrice > product.price);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getFeaturedProducts() {
  return products.filter((product) => product.isFeatured);
}

export function getNewProducts() {
  return products.filter((product) => product.isNew);
}

export function getSaleProducts() {
  return products.filter(isProductOnSale);
}

export function getRelatedProducts(
  productId: string,
  category: Product["category"],
  limit = 4
) {
  return products
    .filter((product) => product.category === category && product.id !== productId)
    .slice(0, limit);
}

export function getCategoryName(category: ProductCategorySlug) {
  return getCategoryBySlug(category)?.name ?? category;
}

export function getAvailableSizes(items: Product[] = products) {
  return Array.from(
    new Set(items.flatMap((product) => product.sizes))
  ).sort((left, right) =>
    left.localeCompare(right, "tr", { numeric: true, sensitivity: "base" })
  );
}

export function getAvailableColors(items: Product[] = products) {
  return Array.from(
    new Set(items.flatMap((product) => product.colors.map((color) => color.name)))
  ).sort((left, right) => left.localeCompare(right, "tr"));
}

function getFeaturedScore(product: Product) {
  return (
    (product.isFeatured ? 2 : 0) +
    (product.isNew ? 1 : 0) +
    (isProductOnSale(product) ? 1 : 0)
  );
}

function getSearchableText(product: Product) {
  return [
    product.name,
    product.description,
    getCategoryName(product.category),
    ...product.sizes,
    ...product.colors.map((color) => color.name),
  ]
    .join(" ")
    .toLocaleLowerCase("tr");
}

export function sortProducts(items: Product[], sort: ProductSort) {
  const list = [...items];

  switch (sort) {
    case "new":
      return list.sort(
        (a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew))
      );
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "featured":
    default:
      return list.sort((a, b) => getFeaturedScore(b) - getFeaturedScore(a));
  }
}

export function filterProducts(args: {
  category?: Product["category"] | "all";
  filter?: ProductFilter;
  sort?: ProductSort;
  query?: string;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  products?: Product[];
}) {
  const {
    category = "all",
    filter = "all",
    sort = "featured",
    query = "",
    sizes = [],
    colors = [],
    minPrice,
    maxPrice,
    products: inputProducts,
  } = args;
  let filtered = [...(inputProducts ?? products)];
  const normalizedQuery = query.trim().toLocaleLowerCase("tr");

  if (category !== "all") {
    filtered = filtered.filter((product) => product.category === category);
  }

  if (filter === "new") {
    filtered = filtered.filter((product) => product.isNew);
  }

  if (filter === "sale") {
    filtered = filtered.filter(isProductOnSale);
  }

  if (normalizedQuery) {
    filtered = filtered.filter((product) =>
      getSearchableText(product).includes(normalizedQuery)
    );
  }

  if (sizes.length > 0) {
    filtered = filtered.filter((product) =>
      product.sizes.some((size) => sizes.includes(size))
    );
  }

  if (colors.length > 0) {
    filtered = filtered.filter((product) =>
      product.colors.some((color) => colors.includes(color.name))
    );
  }

  if (typeof minPrice === "number") {
    filtered = filtered.filter((product) => product.price >= minPrice);
  }

  if (typeof maxPrice === "number") {
    filtered = filtered.filter((product) => product.price <= maxPrice);
  }

  return sortProducts(filtered, sort);
}
