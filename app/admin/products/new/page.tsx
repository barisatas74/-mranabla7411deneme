import type { Metadata } from "next";
import AdminProductForm from "@/components/admin/AdminProductForm";
import { categoryService } from "@/lib/services";

export const metadata: Metadata = {
  title: "Yeni Urun",
};

export default async function AdminNewProductPage() {
  const categories = await categoryService.list();
  return <AdminProductForm categories={categories} />;
}
