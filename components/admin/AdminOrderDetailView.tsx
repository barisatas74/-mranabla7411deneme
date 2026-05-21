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
import { cancelOrderAction, updateOrderStatusAction } from "@/lib/actions/admin";
import { formatPrice } from "@/lib/utils";
import { AdminOrder } from "@/types";

export default function AdminOrderDetailView({ order }: { order: AdminOrder }) {
  const toast = useAdminToast();
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [shippingStatus, setShippingStatus] = useState(order.shippingStatus);
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber ?? ""
  );
  const [trackingCarrier, setTrackingCarrier] = useState(
    order.trackingCarrier ?? ""
  );
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl ?? "");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState(
    order.cancellationReason ?? ""
  );
  const [cancelling, setCancelling] = useState(false);
  const isCancelled = status === "iptal-edildi";

  async function handleCancel() {
    if (cancelReason.trim().length < 3) {
      toast({
        title: "Eksik bilgi",
        description: "Lütfen en az 3 karakterlik bir iptal nedeni yazın.",
        variant: "error",
      });
      return;
    }

    setCancelling(true);
    try {
      const updated = await cancelOrderAction(order.id, cancelReason);
      if (!updated) {
        toast({
          title: "Sipariş iptal edilemedi",
          description: "Sipariş servisi yanıt vermedi.",
          variant: "error",
        });
        return;
      }
      setStatus(updated.status);
      setCancelModalOpen(false);
      toast({
        title: "Sipariş iptal edildi",
        description: `${order.orderNumber} iptal edildi. Müşteriye bilgilendirme e-postası gönderildi.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Sipariş iptal edilemedi",
        description:
          error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
        variant: "error",
      });
    } finally {
      setCancelling(false);
    }
  }

  async function handleSave() {
    const updatedOrder = await updateOrderStatusAction(order.id, {
      status,
      paymentStatus,
      shippingStatus,
      trackingNumber: trackingNumber.trim() || undefined,
      trackingCarrier: trackingCarrier.trim() || undefined,
      trackingUrl: trackingUrl.trim() || undefined,
    });

    if (!updatedOrder) {
      toast({
        title: "Sipariş güncellenemedi",
        description: "Sipariş servisi bu kaydı bulamadı.",
        variant: "error",
      });
      return;
    }

    toast({
      title: "Sipariş güncellendi",
      description: `${order.orderNumber} için durum alanları kaydedildi.`,
      variant: "success",
    });
  }

  return (
    <div className="space-y-8">
      <AdminSectionHeader
        eyebrow="Order Detail"
        title={order.orderNumber}
        description={`Oluşturma tarihi: ${formatAdminDate(order.createdAt)}`}
        action={
          <Link
            href="/admin/orders"
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-950"
          >
            Listeye Dön
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
                  Müşteri
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
              <h2 className="text-lg font-semibold text-slate-950">Ürünler</h2>
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
            <h2 className="text-lg font-semibold text-slate-950">Durumu güncelle</h2>
            <div className="mt-5 space-y-4">
              <AdminSelectField
                label="Sipariş durumu"
                value={status}
                onChange={(value) => setStatus(value as AdminOrder["status"])}
                options={ORDER_STATUS_OPTIONS}
              />
              <AdminSelectField
                label="Ödeme durumu"
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

              <div className="border-t border-slate-200 pt-4">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
                  Kargo Takip Bilgisi
                </p>
                <div className="space-y-3">
                  <TrackingField
                    label="Kargo Firması"
                    value={trackingCarrier}
                    onChange={setTrackingCarrier}
                    placeholder="Aras, Yurtiçi, MNG..."
                  />
                  <TrackingField
                    label="Takip Numarası"
                    value={trackingNumber}
                    onChange={setTrackingNumber}
                    placeholder="örn: 1234567890"
                  />
                  <TrackingField
                    label="Takip URL'si (opsiyonel)"
                    value={trackingUrl}
                    onChange={setTrackingUrl}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Güncellemeyi Kaydet
              </button>
              {!isCancelled && (
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(true)}
                  className="rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-medium text-red-600 transition hover:border-red-400 hover:bg-red-50"
                >
                  Siparişi İptal Et
                </button>
              )}
            </div>
          </section>

          {isCancelled && order.cancellationReason && (
            <section className="rounded-[28px] border border-red-200 bg-red-50/60 p-6">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-red-700">
                İptal Edildi
              </p>
              {order.cancelledAt && (
                <p className="mt-1 text-xs text-red-600/80">
                  {formatAdminDate(order.cancelledAt)}
                </p>
              )}
              <p className="mt-3 text-sm leading-7 text-red-900">
                {order.cancellationReason}
              </p>
            </section>
          )}

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Finansal özet</h2>
            <div className="mt-5 space-y-3 text-sm">
              <SummaryRow label="Ara toplam" value={formatPrice(order.subtotal)} />
              <SummaryRow label="Kargo" value={formatPrice(order.shippingFee)} />
              <SummaryRow label="İndirim" value={formatPrice(order.discount)} />
              <div className="border-t border-slate-200 pt-3">
                <SummaryRow label="Toplam" value={formatPrice(order.total)} strong />
              </div>
            </div>
            {order.note && (
              <div className="mt-5 rounded-[24px] bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Müşteri Notu
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{order.note}</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {cancelModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => !cancelling && setCancelModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-950">
              Siparişi İptal Et
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              <strong>{order.orderNumber}</strong> numaralı sipariş iptal
              edilecek. Müşteriye bilgilendirme e-postası gönderilecek ve
              stoklar geri yüklenecek.
            </p>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-slate-700">
                İptal Nedeni *
              </span>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Örn: Stokta kalmadı, müşteri vazgeçti, ödeme sorunu..."
                disabled={cancelling}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 disabled:opacity-60"
                autoFocus
              />
              <span className="mt-1 block text-right text-[11px] text-slate-400">
                {cancelReason.length} / 1000
              </span>
            </label>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                disabled={cancelling}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling || cancelReason.trim().length < 3}
                className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {cancelling ? "İptal Ediliyor..." : "Siparişi İptal Et"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrackingField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-700">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
      />
    </label>
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
