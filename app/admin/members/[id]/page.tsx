import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminMemberDetailView from "@/components/admin/AdminMemberDetailView";
import { productService, userService } from "@/lib/services/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Üye Detayı",
};

export default async function AdminMemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [member, products] = await Promise.all([
    userService.getAdminMemberById(id),
    productService.list(),
  ]);
  if (!member) notFound();

  return (
    <AdminMemberDetailView
      member={member}
      products={products.filter((product) => product.status === "active")}
    />
  );
}
