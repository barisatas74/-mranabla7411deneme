import type { Metadata } from "next";
import AdminProductsView from "@/components/admin/AdminProductsView";
import { productService } from "@/lib/services";

export const metadata: Metadata = {
  title: "Admin Products",
};

export default async function AdminProductsPage() {
  const products = await productService.list();
  return <AdminProductsView initialProducts={products} />;
}
