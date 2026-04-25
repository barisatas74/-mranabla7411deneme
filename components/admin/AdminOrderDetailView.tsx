"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminSectionHeader from "@/components/admin/AdminSectionHeader";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { useAdminToast } from "@/components/admin/feedback/AdminFeedbackProvider";
import { AdminSelectField } from "@/components/admin/forms/AdminFormFields";
import {
  formatAdminDate,
  ORDER_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  SHIPPING_STATUS_OPTIONS,
} from "@/lib/admin";
import { orderService } from "@/lib/services";
import { formatPrice } from "@/lib/utils";
import { AdminOrder } from "@/types";

export default function AdminOrderDetailView({ order }: { order: AdminOrder }) {
  const toast = useAdminToast();
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [shippingStatus, setShippingStatus] = useState(order.shippingStatus);

  async function handleSave() {
    const updatedOrder = await orderService.updateStatus(order.id, {
      status,
      paymentStatus,
      shippingStatus,
    });

    if (!updatedOrder) {
      toast({
        title: "Siparis guncellenemedi",
        description: "Mock order service bu siparisi bulamadi.",
        variant: "error",
      });
      return;
    }

    toast({
      title: "Siparis guncellendi",
      description: `${order.orderNumber} icin durum alanlari order service uzerinden kaydedildi.`,
      variant: "success",
    });
  }

  return (
    <div className="space-y-8">
      <AdminSectionHeader
        eyebrow="Order Detail"
        title={order.orderNumber}
        description={`Olusturma tarihi: ${formatAdminDate(order.createdAt)}`}
        action={
          <Link
            href="/admin/orders"
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-950"
          >
            Listeye Don
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_380px]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap gap-3">
              <AdminStatusBadge value={status} />
              <AdminStatusBadge value={paymentStatus} />
              <AdminStatusBadge value={shippingStatus} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Musteri
                </p>
                <p className="mt-3 font-medium text-slate-950">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="mt-2 text-sm text-slate-600">{order.customer.email}</p>
                <p className="mt-1 text-sm text-slate-600">{order.customer.phone}</p>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Teslimat Adresi
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  {order.customer.address}
                  <br />
                  {order.customer.district} / {order.customer.city}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-950">Urunler</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 px-6 py-5">
                  <div className="relative h-20 w-16 overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-950">{item.productName}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.color} / {item.size} / {item.quantity} adet
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-950">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Durum guncelle</h2>
            <div className="mt-5 space-y-4">
              <AdminSelectField
                label="Siparis durumu"
                value={status}
                onChange={(value) => setStatus(value as AdminOrder["status"])}
                options={ORDER_STATUS_OPTIONS}
              />
              <AdminSelectField
                label="Odeme durumu"
                value={paymentStatus}
                onChange={(value) => setPaymentStatus(value as AdminOrder["paymentStatus"])}
                options={PAYMENT_STATUS_OPTIONS}
              />
              <AdminSelectField
                label="Kargo durumu"
                value={shippingStatus}
                onChange={(value) => setShippingStatus(value as AdminOrder["shippingStatus"])}
                options={SHIPPING_STATUS_OPTIONS}
              />
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Guncellemeyi Kaydet
            </button>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Finansal ozet</h2>
            <div className="mt-5 space-y-3 text-sm">
              <SummaryRow label="Ara toplam" value={formatPrice(order.subtotal)} />
              <SummaryRow label="Kargo" value={formatPrice(order.shippingFee)} />
              <SummaryRow label="Indirim" value={formatPrice(order.discount)} />
              <div className="border-t border-slate-200 pt-3">
                <SummaryRow label="Toplam" value={formatPrice(order.total)} strong />
              </div>
            </div>
            {order.note && (
              <div className="mt-5 rounded-[24px] bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Musteri Notu
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{order.note}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className={strong ? "font-semibold text-slate-950" : "text-slate-950"}>
        {value}
      </span>
    </div>
  );
}
