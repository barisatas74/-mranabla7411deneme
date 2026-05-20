"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Ban,
  BadgeCheck,
  Mail,
  MapPin,
  Phone,
  Save,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import AdminSectionHeader from "@/components/admin/AdminSectionHeader";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTableCard from "@/components/admin/AdminTableCard";
import {
  useAdminConfirm,
  useAdminToast,
} from "@/components/admin/feedback/AdminFeedbackProvider";
import {
  updateMemberNoteAction,
  updateMemberStatusAction,
} from "@/lib/actions/admin";
import { formatAdminDate } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import { AdminMemberDetail, UserStatus } from "@/types";

const statusLabels: Record<UserStatus, string> = {
  active: "Aktif",
  suspended: "Askıda",
};

export default function AdminMemberDetailView({
  member,
}: {
  member: AdminMemberDetail;
}) {
  const toast = useAdminToast();
  const confirm = useAdminConfirm();
  const [currentMember, setCurrentMember] = useState(member);
  const [note, setNote] = useState(member.adminNote);
  const [pending, startTransition] = useTransition();

  async function handleStatusChange(nextStatus: UserStatus) {
    const approved = await confirm({
      title:
        nextStatus === "suspended"
          ? "Hesap askıya alınsın mı?"
          : "Hesap yeniden aktif edilsin mi?",
      description:
        nextStatus === "suspended"
          ? "Bu üye giriş yapamaz ve hesabına erişemez. Sipariş geçmişi admin arşivinde kalır."
          : "Bu üye tekrar giriş yapabilir ve hesabını kullanabilir.",
      confirmLabel: nextStatus === "suspended" ? "Askıya Al" : "Aktif Et",
      cancelLabel: "Vazgeç",
      tone: nextStatus === "suspended" ? "danger" : "default",
    });
    if (!approved) return;

    startTransition(async () => {
      const updated = await updateMemberStatusAction(currentMember.id, nextStatus);
      if (!updated) {
        toast({
          title: "Durum güncellenemedi",
          description: "Üye kaydı bulunamadı.",
          variant: "error",
        });
        return;
      }
      setCurrentMember((current) => ({ ...current, ...updated }));
      toast({
        title: "Üye durumu güncellendi",
        description: `${currentMember.firstName} ${currentMember.lastName} artık ${statusLabels[nextStatus].toLocaleLowerCase("tr")}.`,
        variant: "success",
      });
    });
  }

  function handleNoteSave() {
    startTransition(async () => {
      const updated = await updateMemberNoteAction(currentMember.id, note);
      if (!updated) {
        toast({
          title: "Not kaydedilemedi",
          description: "Üye kaydı bulunamadı.",
          variant: "error",
        });
        return;
      }
      setCurrentMember((current) => ({ ...current, ...updated }));
      toast({
        title: "Müşteri notu kaydedildi",
        description: "Bu not sadece admin panelinde görünür.",
        variant: "success",
      });
    });
  }

  return (
    <div className="space-y-8">
      <AdminSectionHeader
        eyebrow="Customer"
        title={`${currentMember.firstName} ${currentMember.lastName}`}
        description="Profil, adres, sipariş geçmişi ve iç admin notlarını yönetin."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <AdminStatusBadge
              value={currentMember.status}
              label={statusLabels[currentMember.status]}
            />
            {currentMember.status === "active" ? (
              <button
                type="button"
                onClick={() => handleStatusChange("suspended")}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-60"
              >
                <Ban size={15} />
                Askıya Al
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleStatusChange("active")}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                <BadgeCheck size={15} />
                Askıyı Kaldır
              </button>
            )}
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Toplam sipariş"
          value={String(currentMember.orderCount)}
          icon={<ShoppingBag size={18} />}
        />
        <MetricCard
          label="Toplam harcama"
          value={formatPrice(currentMember.totalSpent)}
          icon={<BadgeCheck size={18} />}
        />
        <MetricCard
          label="Son sipariş"
          value={
            currentMember.lastOrderAt
              ? formatAdminDate(currentMember.lastOrderAt)
              : "Henüz yok"
          }
          icon={<ShoppingBag size={18} />}
        />
        <MetricCard
          label="Son giriş"
          value={
            currentMember.lastLoginAt
              ? formatAdminDate(currentMember.lastLoginAt)
              : "Henüz yok"
          }
          icon={<UserRound size={18} />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Profil bilgileri
            </h2>
            <div className="mt-5 space-y-4 text-sm">
              <InfoLine
                icon={<Mail size={15} />}
                label="E-posta"
                value={currentMember.email}
              />
              <InfoLine
                icon={<Phone size={15} />}
                label="Telefon"
                value={currentMember.phone || "Telefon yok"}
              />
              <InfoLine
                icon={<UserRound size={15} />}
                label="Üyelik"
                value={formatAdminDate(currentMember.createdAt)}
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Admin notu
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  VIP, riskli müşteri veya özel takip bilgisi.
                </p>
              </div>
              <button
                type="button"
                onClick={handleNoteSave}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                <Save size={14} />
                Kaydet
              </button>
            </div>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={7}
              placeholder="Örn: VIP müşteri, hızlı kargo tercih ediyor..."
              className="mt-5 w-full rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
            />
          </section>
        </div>

        <div className="space-y-6">
          <AdminTableCard
            title="Kayıtlı adresler"
            description={`${currentMember.addresses.length} adres kayıtlı.`}
          >
            {currentMember.addresses.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {currentMember.addresses.map((address) => (
                  <div key={address.id} className="px-6 py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-950">
                          {address.label}
                          {address.isDefault && (
                            <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
                              Varsayılan
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {address.fullName} · {address.phone}
                        </p>
                      </div>
                      <MapPin size={17} className="text-rose-600" />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {address.address}, {address.district} / {address.city}
                      {address.postalCode ? ` · ${address.postalCode}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-6 py-8 text-sm text-slate-500">
                Bu üyenin kayıtlı adresi yok.
              </p>
            )}
          </AdminTableCard>

          <AdminTableCard
            title="Sipariş geçmişi"
            description={`${currentMember.orders.length} sipariş görünüyor.`}
          >
            {currentMember.orders.length > 0 ? (
              <table className="min-w-full text-left">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.25em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Sipariş</th>
                    <th className="px-6 py-4 font-medium">Durum</th>
                    <th className="px-6 py-4 font-medium">Toplam</th>
                    <th className="px-6 py-4 font-medium text-right">Detay</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMember.orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-slate-100 text-sm last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-950">
                          {order.orderNumber}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatAdminDate(order.createdAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <AdminStatusBadge value={order.status} />
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-950">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-medium text-slate-950 transition hover:text-rose-600"
                        >
                          Aç
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="px-6 py-8 text-sm text-slate-500">
                Bu üye henüz sipariş vermemiş.
              </p>
            )}
          </AdminTableCard>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 truncate text-xl font-semibold text-slate-950">
            {value}
          </p>
        </div>
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          {icon}
        </span>
      </div>
    </div>
  );
}

function InfoLine({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="mt-0.5 text-rose-600">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-slate-950">{value}</p>
      </div>
    </div>
  );
}
