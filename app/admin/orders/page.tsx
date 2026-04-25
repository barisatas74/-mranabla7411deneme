import type { Metadata } from "next";
import AdminOrdersView from "@/components/admin/AdminOrdersView";
import { orderService } from "@/lib/services";

export const metadata: Metadata = {
  title: "Siparisler",
};

export default async function AdminOrdersPage() {
  const orders = await orderService.list();
  return <AdminOrdersView initialOrders={orders} />;
}
