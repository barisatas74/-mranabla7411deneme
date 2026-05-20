import "server-only";
import { unstable_cache } from "next/cache";
import { categoryService, productService } from "@/lib/services/server";
import {
  STOREFRONT_CATEGORIES_TAG,
  STOREFRONT_PRODUCTS_TAG,
} from "@/lib/cache-tags";
import { AdminCategory, AdminProduct, ProductSearchItem } from "@/types";

const STOREFRONT_REVALIDATE_SECONDS = 300;

export const getStorefrontProducts = unstable_cache(
  async (): Promise<AdminProduct[]> => productService.list().catch(() => []),
  ["storefront-products-v1"],
  {
    revalidate: STOREFRONT_REVALIDATE_SECONDS,
    tags: [STOREFRONT_PRODUCTS_TAG],
  }
);

export const getStorefrontCategories = unstable_cache(
  async (): Promise<AdminCategory[]> => categoryService.list().catch(() => []),
  ["storefront-categories-v1"],
  {
    revalidate: STOREFRONT_REVALIDATE_SECONDS,
    tags: [STOREFRONT_CATEGORIES_TAG],
  }
);

export const getStorefrontSearchProducts = unstable_cache(
  async (): Promise<ProductSearchItem[]> => {
    const products = await productService.list().catch(() => []);
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: product.price,
      image: product.images[0] ?? "",
      searchText: [
        product.name,
        product.description,
        product.category,
        ...product.sizes,
        ...product.colors.map((color) => color.name),
      ]
        .join(" ")
        .toLocaleLowerCase("tr"),
    }));
  },
  ["storefront-search-products-v1"],
  {
    revalidate: STOREFRONT_REVALIDATE_SECONDS,
    tags: [STOREFRONT_PRODUCTS_TAG],
  }
);

export async function getStorefrontProductBySlug(slug: string) {
  const products = await getStorefrontProducts();
  return products.find((product) => product.slug === slug) ?? null;
}
