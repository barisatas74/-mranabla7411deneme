"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdminSectionHeader from "@/components/admin/AdminSectionHeader";
import AdminTableCard from "@/components/admin/AdminTableCard";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { formatAdminDate, ORDER_STATUS_OPTIONS } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import { AdminOrder } from "@/types";

export default function AdminOrdersView({
  initialOrders,
}: {
  initialOrders: AdminOrder[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | AdminOrder["status"]>("all");

  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      const searchText = [
        order.orderNumber,
        order.customer.firstName,
        order.customer.lastName,
        order.customer.email,
      ]
        .join(" ")
        .toLocaleLowerCase("tr");

      const matchesQuery = searchText.includes(query.trim().toLocaleLowerCase("tr"));
      const matchesStatus = status === "all" ? true : order.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [initialOrders, query, status]);

  return (
    <div className="space-y-8">
      <AdminSectionHeader
        eyebrow="Orders"
        title="Sipariş yönetimi"
        description="Müşteri bilgileri, ödeme durumu ve kargo akışlarını siparişler üzerinden takip edin. Detay sayfasında durum güncelleme arayüzü de yer alır."
      />

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Sipariş no veya müşteri ara"
          className="rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none shadow-sm transition focus:border-slate-950"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as "all" | AdminOrder["status"])}
          className="rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none shadow-sm transition focus:border-slate-950"
        >
          <option value="all">Tüm durumlar</option>
          {ORDER_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <AdminTableCard
        title="Sipariş listesi"
        description={`${filteredOrders.length} sipariş listeleniyor.`}
      >
        {filteredOrders.length > 0 ? (
          <table className="min-w-full text-left">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.25em] text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Sipariş</th>
                <th className="px-6 py-4 font-medium">Müşteri</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium">Ödeme</th>
                <th className="px-6 py-4 font-medium">Kargo</th>
                <th className="px-6 py-4 font-medium">Toplam</th>
                <th className="px-6 py-4 font-medium text-right">Detay</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 text-sm last:border-b-0">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-950">{order.orderNumber}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatAdminDate(order.createdAt)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {order.customer.firstName} {order.customer.lastName}
                  </td>
                  <td className="px-6 py-4">
                    <AdminStatusBadge value={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <AdminStatusBadge value={order.paymentStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <AdminStatusBadge value={order.shippingStatus} />
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-950">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm font-medium text-slate-950 transition hover:text-rose-600"
                    >
                      İncele
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6">
            <AdminEmptyState
              title="Sipariş bulunamadı"
              description="Seçili filtre ile eşleşen sipariş yok. Farklı bir durum veya arama terimi deneyin."
            />
          </div>
        )}
      </AdminTableCard>
    </div>
  );
}
