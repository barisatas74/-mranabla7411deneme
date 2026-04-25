import type { Metadata } from "next";
import AdminProductForm from "@/components/admin/AdminProductForm";
import AdminPageError from "@/components/admin/AdminPageError";
import { categoryService, productService } from "@/lib/services";

export const metadata: Metadata = {
  title: "Urun Duzenle",
};

export default async function AdminEditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    productService.getById(params.id),
    categoryService.list(),
  ]);

  if (!product) {
    return (
      <AdminPageError
        title="Urun bulunamadi"
        description="Duzenlemek istediginiz urun mock data listesinde yer almiyor."
        href="/admin/products"
      />
    );
  }

  return <AdminProductForm product={product} categories={categories} />;
}
