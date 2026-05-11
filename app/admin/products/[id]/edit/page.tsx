import type { Metadata } from "next";
import AdminProductForm from "@/components/admin/AdminProductForm";
import AdminPageError from "@/components/admin/AdminPageError";
import { categoryService, productService } from "@/lib/services/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Urun Duzenle",
};

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    productService.getById(id),
    categoryService.list(),
  ]);

  if (!product) {
    return (
      <AdminPageError
        title="Urun bulunamadi"
        description="Düzenlemek istediğiniz ürün listede yer almıyor."
        href="/admin/products"
      />
    );
  }

  return <AdminProductForm product={product} categories={categories} />;
}
