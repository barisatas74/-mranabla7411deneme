import type { Metadata } from "next";
import AdminOrderDetailView from "@/components/admin/AdminOrderDetailView";
import AdminPageError from "@/components/admin/AdminPageError";
import { orderService } from "@/lib/services";

export const metadata: Metadata = {
  title: "Siparis Detayi",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await orderService.getById(id);

  if (!order) {
    return (
      <AdminPageError
        title="Siparis bulunamadi"
        description="İncelemek istediğiniz sipariş listede yer almıyor."
        href="/admin/orders"
      />
    );
  }

  return <AdminOrderDetailView order={order} />;
}
