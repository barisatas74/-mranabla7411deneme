import type { Metadata } from "next";
import AdminCategoriesView from "@/components/admin/AdminCategoriesView";
import { categoryService, productService } from "@/lib/services";

export const metadata: Metadata = {
  title: "Kategoriler",
};

export default async function AdminCategoriesPage() {
  const [categories, products] = await Promise.all([
    categoryService.list(),
    productService.list(),
  ]);
  return (
    <AdminCategoriesView
      initialCategories={categories}
      products={products}
    />
  );
}
