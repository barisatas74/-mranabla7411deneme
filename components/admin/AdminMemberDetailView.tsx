"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Ban,
  Mail,
  MapPin,
  PackagePlus,
  Phone,
  Save,
  ShoppingBag,
  Sparkles,
  Tags,
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
  createMemberManualOrderAction,
  updateMemberCrmAction,
  updateMemberNoteAction,
  updateMemberStatusAction,
} from "@/lib/actions/admin";
import { formatAdminDate } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import {
  AdminMemberDetail,
  AdminMemberManualOrderInput,
  AdminProduct,
  UserStatus,
} from "@/types";

const statusLabels: Record<UserStatus, string> = {
  active: "Aktif",
  suspended: "Askıda",
};

const adminInputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-950";

export default function AdminMemberDetailView({
  member,
  products,
}: {
  member: AdminMemberDetail;
  products: AdminProduct[];
}) {
  const toast = useAdminToast();
  const confirm = useAdminConfirm();
  const [currentMember, setCurrentMember] = useState(member);
  const [note, setNote] = useState(member.adminNote);
  const [tags, setTags] = useState(member.tags.join(", "));
  const [loyaltyPoints, setLoyaltyPoints] = useState(String(member.loyaltyPoints));
  const [couponRate, setCouponRate] = useState(
    member.privateCouponRate ? String(member.privateCouponRate) : "15"
  );
  const [couponCode, setCouponCode] = useState(member.privateCouponCode ?? "");
  const [pending, startTransition] = useTransition();

  const defaultAddress = currentMember.addresses.find((address) => address.isDefault)
    ?? currentMember.addresses[0];
  const initialProductId = products[0]?.id ?? "";
  const [manualOrder, setManualOrder] = useState<AdminMemberManualOrderInput>({
    productId: initialProductId,
    quantity: 1,
    size: products[0]?.sizes[0] ?? "",
    color: products[0]?.colors[0]?.name ?? "",
    phone: defaultAddress?.phone || currentMember.phone || "",
    city: defaultAddress?.city || "",
    district: defaultAddress?.district || "",
    address: defaultAddress?.address || "",
    note: "",
  });
  const selectedProduct = useMemo(
    () => products.find((product) => product.id === manualOrder.productId),
    [manualOrder.productId, products]
  );

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

  function handleCrmSave() {
    const rate = couponCode ? Math.floor(Number(couponRate) || 15) : undefined;
    startTransition(async () => {
      const updated = await updateMemberCrmAction(currentMember.id, {
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        loyaltyPoints: Math.max(0, Math.floor(Number(loyaltyPoints) || 0)),
        privateCouponCode: couponCode || undefined,
        privateCouponRate: rate,
      });
      if (!updated) {
        toast({
          title: "CRM bilgileri kaydedilemedi",
          description: "Üye kaydı bulunamadı.",
          variant: "error",
        });
        return;
      }
      setCurrentMember((current) => ({ ...current, ...updated }));
      setTags(updated.tags.join(", "));
      setLoyaltyPoints(String(updated.loyaltyPoints));
      setCouponCode(updated.privateCouponCode ?? "");
      setCouponRate(updated.privateCouponRate ? String(updated.privateCouponRate) : "15");
      toast({
        title: "Müşteri profili güncellendi",
        description: "Etiketler, puan ve özel kupon kaydedildi.",
        variant: "success",
      });
    });
  }

  function updateManualOrder(
    key: keyof AdminMemberManualOrderInput,
    value: string | number
  ) {
    setManualOrder((current) => ({ ...current, [key]: value }));
  }

  function handleProductChange(productId: string) {
    const product = products.find((item) => item.id === productId);
    setManualOrder((current) => ({
      ...current,
      productId,
      size: product?.sizes[0] ?? "",
      color: product?.colors[0]?.name ?? "",
    }));
  }

  function handleManualOrderSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!manualOrder.productId || !manualOrder.city || !manualOrder.address) {
      toast({
        title: "Sipariş bilgileri eksik",
        description: "Ürün, şehir ve adres alanlarını doldurun.",
        variant: "error",
      });
      return;
    }

    startTransition(async () => {
      try {
        const order = await createMemberManualOrderAction(
          currentMember.id,
          manualOrder
        );
        setCurrentMember((current) => ({
          ...current,
          orders: [order, ...current.orders],
          orderCount: current.orderCount + 1,
          totalSpent: current.totalSpent + order.total,
          lastOrderAt: order.createdAt,
        }));
        toast({
          title: "Manuel sipariş oluşturuldu",
          description: `${order.orderNumber} numaralı sipariş eklendi.`,
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Sipariş oluşturulamadı",
          description:
            error instanceof Error ? error.message : "Lütfen bilgileri kontrol edin.",
          variant: "error",
        });
      }
    });
  }

  return (
    <div className="space-y-8">
      <AdminSectionHeader
        eyebrow="Customer"
        title={`${currentMember.firstName} ${currentMember.lastName}`}
        description="Profil, adres, sipariş geçmişi, segment ve iç admin notlarını yönetin."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800">
              {currentMember.segment}
            </span>
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

      <div className="grid gap-4 md:grid-cols-5">
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
          label="Sadakat puanı"
          value={String(currentMember.loyaltyPoints)}
          icon={<Sparkles size={18} />}
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

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
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
                  CRM profili
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Etiket, puan ve kişiye özel kupon.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCrmSave}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                <Save size={14} />
                Kaydet
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <Field label="Etiketler">
                <input
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  placeholder="VIP, iade hassas, hızlı kargo"
                  className={adminInputClass}
                />
              </Field>
              <Field label="Sadakat puanı">
                <input
                  type="number"
                  min={0}
                  value={loyaltyPoints}
                  onChange={(event) => setLoyaltyPoints(event.target.value)}
                  className={adminInputClass}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-[110px_minmax(0,1fr)]">
                <Field label="Kupon %">
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={couponRate}
                    onChange={(event) => setCouponRate(event.target.value)}
                    className={adminInputClass}
                  />
                </Field>
                <Field label="Özel kupon">
                  <input
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    placeholder="Örn: VIP30"
                    className={adminInputClass}
                  />
                </Field>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Admin notu
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Sadece admin panelinde görünür.
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
              rows={6}
              placeholder="Örn: VIP müşteri, hızlı kargo tercih ediyor..."
              className="mt-5 w-full rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
            />
          </section>
        </div>

        <div className="space-y-6">
          <AdminTableCard
            title="Manuel sipariş oluştur"
            description="Telefonla veya DM üzerinden gelen siparişleri üyeye bağlayın."
          >
            <form onSubmit={handleManualOrderSubmit} className="space-y-5 p-6">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_110px]">
                <Field label="Ürün">
                  <select
                    value={manualOrder.productId}
                    onChange={(event) => handleProductChange(event.target.value)}
                    className={adminInputClass}
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} · {formatPrice(product.price)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Adet">
                  <input
                    type="number"
                    min={1}
                    value={manualOrder.quantity}
                    onChange={(event) =>
                      updateManualOrder("quantity", Number(event.target.value))
                    }
                    className={adminInputClass}
                  />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Beden">
                  <select
                    value={manualOrder.size}
                    onChange={(event) => updateManualOrder("size", event.target.value)}
                    className={adminInputClass}
                  >
                    {(selectedProduct?.sizes.length ? selectedProduct.sizes : [""]).map(
                      (size) => (
                        <option key={size || "empty"} value={size}>
                          {size || "Beden yok"}
                        </option>
                      )
                    )}
                  </select>
                </Field>
                <Field label="Renk">
                  <select
                    value={manualOrder.color}
                    onChange={(event) =>
                      updateManualOrder("color", event.target.value)
                    }
                    className={adminInputClass}
                  >
                    {(selectedProduct?.colors.length
                      ? selectedProduct.colors.map((color) => color.name)
                      : [""]
                    ).map((color) => (
                      <option key={color || "empty"} value={color}>
                        {color || "Renk yok"}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Telefon">
                  <input
                    value={manualOrder.phone}
                    onChange={(event) =>
                      updateManualOrder("phone", event.target.value)
                    }
                    className={adminInputClass}
                  />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Şehir">
                  <input
                    value={manualOrder.city}
                    onChange={(event) => updateManualOrder("city", event.target.value)}
                    className={adminInputClass}
                  />
                </Field>
                <Field label="İlçe">
                  <input
                    value={manualOrder.district}
                    onChange={(event) =>
                      updateManualOrder("district", event.target.value)
                    }
                    className={adminInputClass}
                  />
                </Field>
              </div>
              <Field label="Adres">
                <textarea
                  value={manualOrder.address}
                  onChange={(event) =>
                    updateManualOrder("address", event.target.value)
                  }
                  rows={3}
                  className={adminInputClass}
                />
              </Field>
              <Field label="Sipariş notu">
                <input
                  value={manualOrder.note ?? ""}
                  onChange={(event) => updateManualOrder("note", event.target.value)}
                  placeholder="Opsiyonel"
                  className={adminInputClass}
                />
              </Field>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                <p className="text-sm text-slate-500">
                  Tahmini toplam:{" "}
                  <span className="font-semibold text-slate-950">
                    {formatPrice((selectedProduct?.price ?? 0) * manualOrder.quantity)}
                  </span>
                </p>
                <button
                  type="submit"
                  disabled={pending || products.length === 0}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  <PackagePlus size={16} />
                  Sipariş Oluştur
                </button>
              </div>
            </form>
          </AdminTableCard>

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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        <Tags size={13} />
        {label}
      </span>
      {children}
    </label>
  );
}
