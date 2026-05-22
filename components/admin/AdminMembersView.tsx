"use client";

import { FormEvent, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Ban,
  Download,
  Gift,
  Save,
  Search,
  ShoppingBag,
  Sparkles,
  Tags,
  UsersRound,
} from "lucide-react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminSectionHeader from "@/components/admin/AdminSectionHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTableCard from "@/components/admin/AdminTableCard";
import {
  useAdminConfirm,
  useAdminToast,
} from "@/components/admin/feedback/AdminFeedbackProvider";
import {
  bulkUpdateMemberStatusAction,
  updateGeneralCouponAction,
  updateGeneralCouponStatusAction,
  upsertGeneralCouponAction,
} from "@/lib/actions/admin";
import { formatAdminDate } from "@/lib/admin";
import { cn, formatPrice } from "@/lib/utils";
import {
  AdminCoupon,
  AdminMemberSummary,
  CouponStatus,
  UserStatus,
} from "@/types";

const statusLabels: Record<UserStatus, string> = {
  active: "Aktif",
  suspended: "Askıda",
};

export default function AdminMembersView({
  initialMembers,
  initialCoupons,
}: {
  initialMembers: AdminMemberSummary[];
  initialCoupons: AdminCoupon[];
}) {
  const toast = useAdminToast();
  const confirm = useAdminConfirm();
  const generalCouponFormRef = useRef<HTMLFormElement>(null);
  const [members, setMembers] = useState(initialMembers);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponRate, setCouponRate] = useState("15");
  const [couponStatus, setCouponStatus] = useState<CouponStatus>("active");
  const [couponUsageLimit, setCouponUsageLimit] = useState("");
  const [couponExpiresAt, setCouponExpiresAt] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | UserStatus>("all");
  const [segment, setSegment] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const segments = useMemo(
    () => Array.from(new Set(members.map((member) => member.segment))).sort(),
    [members]
  );
  const generalCoupons = useMemo(
    () => coupons.filter((coupon) => !coupon.assignedUserId),
    [coupons]
  );

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr");
    return members.filter((member) => {
      const searchText = [
        member.firstName,
        member.lastName,
        member.email,
        member.phone,
        member.adminNote,
        member.segment,
        member.privateCouponCode,
        ...member.tags,
      ]
        .join(" ")
        .toLocaleLowerCase("tr");
      const matchesQuery = normalizedQuery
        ? searchText.includes(normalizedQuery)
        : true;
      const matchesStatus = status === "all" ? true : member.status === status;
      const matchesSegment =
        segment === "all" ? true : member.segment === segment;
      return matchesQuery && matchesStatus && matchesSegment;
    });
  }, [members, query, segment, status]);

  const filteredIds = useMemo(
    () => filteredMembers.map((member) => member.id),
    [filteredMembers]
  );
  const selectedFilteredCount = filteredIds.filter((id) =>
    selectedIds.has(id)
  ).length;
  const allFilteredSelected =
    filteredIds.length > 0 && selectedFilteredCount === filteredIds.length;

  const activeCount = members.filter((member) => member.status === "active").length;
  const suspendedCount = members.filter(
    (member) => member.status === "suspended"
  ).length;
  const vipCount = members.filter((member) => member.segment === "VIP").length;
  const totalRevenue = members.reduce(
    (total, member) => total + member.totalSpent,
    0
  );

  function toggleAllFiltered() {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (allFilteredSelected) {
        filteredIds.forEach((id) => next.delete(id));
      } else {
        filteredIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }

  function toggleMember(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleBulkStatus(nextStatus: UserStatus) {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const approved = await confirm({
      title:
        nextStatus === "suspended"
          ? "Seçili üyeler askıya alınsın mı?"
          : "Seçili üyeler aktif edilsin mi?",
      description: `${ids.length} üye için hesap durumu güncellenecek.`,
      confirmLabel: nextStatus === "suspended" ? "Askıya Al" : "Aktif Et",
      cancelLabel: "Vazgeç",
      tone: nextStatus === "suspended" ? "danger" : "default",
    });
    if (!approved) return;

    startTransition(async () => {
      const updatedMembers = await bulkUpdateMemberStatusAction(ids, nextStatus);
      const updatedMap = new Map(updatedMembers.map((member) => [member.id, member]));
      setMembers((current) =>
        current.map((member) => updatedMap.get(member.id) ?? member)
      );
      setSelectedIds(new Set());
      toast({
        title: "Toplu işlem tamamlandı",
        description: `${updatedMembers.length} üye güncellendi.`,
        variant: "success",
      });
    });
  }

  function handleGeneralCouponSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      toast({
        title: "Kupon kodu gerekli",
        description: "Genel kupon için kullanmak istediğiniz kodu yazın.",
        variant: "error",
      });
      return;
    }

    startTransition(async () => {
      try {
        const input = {
          code,
          discountRate: Math.floor(Number(couponRate) || 15),
          status: couponStatus,
          usageLimit: couponUsageLimit
            ? Math.floor(Number(couponUsageLimit) || 0)
            : undefined,
          expiresAt: couponExpiresAt || undefined,
        };
        const savedCoupon = editingCouponId
          ? await updateGeneralCouponAction(editingCouponId, input)
          : await upsertGeneralCouponAction(input);
        if (!savedCoupon) {
          throw new Error("Kupon kaydedilemedi.");
        }
        setCoupons((current) => {
          const exists = current.some((coupon) => coupon.id === savedCoupon.id);
          if (exists) {
            return current.map((coupon) =>
              coupon.id === savedCoupon.id ? savedCoupon : coupon
            );
          }
          return [savedCoupon, ...current];
        });
        setCouponCode("");
        setCouponRate("15");
        setCouponStatus("active");
        setCouponUsageLimit("");
        setCouponExpiresAt("");
        setEditingCouponId(null);
        toast({
          title: editingCouponId
            ? "Genel kupon güncellendi"
            : "Genel kupon kaydedildi",
          description: `${savedCoupon.code} tüm müşteriler tarafından kullanılabilir.`,
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Kupon kaydedilemedi",
          description:
            error instanceof Error ? error.message : "Lütfen bilgileri kontrol edin.",
          variant: "error",
        });
      }
    });
  }

  function handleCouponEdit(coupon: AdminCoupon) {
    setEditingCouponId(coupon.id);
    setCouponCode(coupon.code);
    setCouponRate(String(coupon.discountRate));
    setCouponStatus(coupon.status);
    setCouponUsageLimit(coupon.usageLimit ? String(coupon.usageLimit) : "");
    setCouponExpiresAt(coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "");
    window.requestAnimationFrame(() => {
      generalCouponFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      generalCouponFormRef.current
        ?.querySelector<HTMLInputElement>("input[name='coupon-code']")
        ?.focus();
    });
  }

  function resetCouponForm() {
    setEditingCouponId(null);
    setCouponCode("");
    setCouponRate("15");
    setCouponStatus("active");
    setCouponUsageLimit("");
    setCouponExpiresAt("");
  }

  function handleGeneralCouponStatus(coupon: AdminCoupon, status: CouponStatus) {
    startTransition(async () => {
      try {
        const updatedCoupon = await updateGeneralCouponStatusAction(coupon, status);
        if (!updatedCoupon) {
          throw new Error("Kupon bulunamadı.");
        }
        setCoupons((current) =>
          current.map((item) =>
            item.id === updatedCoupon.id ? updatedCoupon : item
          )
        );
        toast({
          title: status === "active" ? "Kupon aktif edildi" : "Kupon durduruldu",
          description: `${updatedCoupon.code} güncellendi.`,
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Kupon güncellenemedi",
          description:
            error instanceof Error ? error.message : "Lütfen tekrar deneyin.",
          variant: "error",
        });
      }
    });
  }

  function exportCsv() {
    const rows = filteredMembers.map((member) => ({
      ad: `${member.firstName} ${member.lastName}`,
      email: member.email,
      telefon: member.phone || "",
      durum: statusLabels[member.status],
      segment: member.segment,
      etiketler: member.tags.join(", "),
      siparis: member.orderCount,
      harcama: member.totalSpent,
      puan: member.loyaltyPoints,
      kupon: member.privateCouponCode || "",
      son_islem: member.lastOrderAt || member.lastLoginAt || "",
    }));
    const headers = Object.keys(rows[0] ?? { ad: "" });
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = String(row[header as keyof typeof row] ?? "");
            return `"${value.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "miss-bella-uyeler.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <AdminSectionHeader
        eyebrow="Customers"
        title="Üye yönetimi"
        description="Üyeleri, sipariş hacimlerini, segmentleri, etiketleri ve hesap durumlarını tek yerden takip edin."
        action={
          <button
            type="button"
            onClick={exportCsv}
            disabled={filteredMembers.length === 0}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:border-slate-950 disabled:opacity-50"
          >
            <Download size={15} />
            CSV İndir
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-5">
        <AdminStatCard title="Toplam üye" value={members.length} icon={UsersRound} />
        <AdminStatCard
          title="Aktif üye"
          value={activeCount}
          icon={BadgeCheck}
          accent="emerald"
        />
        <AdminStatCard
          title="Askıdaki hesap"
          value={suspendedCount}
          icon={Ban}
          accent="rose"
        />
        <AdminStatCard
          title="VIP müşteri"
          value={vipCount}
          icon={Sparkles}
          accent="amber"
        />
        <AdminStatCard
          title="Üye cirosu"
          value={totalRevenue}
          icon={ShoppingBag}
          accent="amber"
          isCurrency
        />
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Gift size={18} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  {editingCouponId ? "Genel kuponu düzenle" : "Genel kupon"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingCouponId
                    ? "Seçili kuponu güncelliyorsunuz."
                    : "Buraya yazdığınız kodu tüm müşteriler kullanabilir."}
                </p>
              </div>
            </div>

            <form
              ref={generalCouponFormRef}
              onSubmit={handleGeneralCouponSubmit}
              className={cn(
                "mt-5 space-y-4 rounded-[24px] border p-4 transition",
                editingCouponId
                  ? "border-rose-200 bg-rose-50/50"
                  : "border-transparent bg-transparent"
              )}
            >
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px]">
                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                    Kod
                  </span>
                  <input
                    name="coupon-code"
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    placeholder="Örn: MAYIS30"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm uppercase outline-none transition focus:border-slate-950"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                    İndirim %
                  </span>
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={couponRate}
                    onChange={(event) => setCouponRate(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                    Durum
                  </span>
                  <select
                    value={couponStatus}
                    onChange={(event) =>
                      setCouponStatus(event.target.value as CouponStatus)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                  >
                    <option value="active">Aktif</option>
                    <option value="passive">Pasif</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                    Limit
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={couponUsageLimit}
                    onChange={(event) => setCouponUsageLimit(event.target.value)}
                    placeholder="Sınırsız"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                    Bitiş
                  </span>
                  <input
                    type="date"
                    value={couponExpiresAt}
                    onChange={(event) => setCouponExpiresAt(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  <Save size={15} />
                  {editingCouponId ? "Kuponu Güncelle" : "Genel Kuponu Kaydet"}
                </button>
                {editingCouponId && (
                  <button
                    type="button"
                    onClick={resetCouponForm}
                    disabled={pending}
                    className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950 disabled:opacity-60"
                  >
                    Vazgeç
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-slate-200">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <h3 className="text-sm font-semibold text-slate-950">
                Aktif genel kodlar
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Üyeye özel olmayan kuponlar burada görünür.
              </p>
            </div>
            {generalCoupons.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {generalCoupons.slice(0, 6).map((coupon) => (
                  <div
                    key={coupon.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-slate-950">
                          {coupon.code}
                        </span>
                        <AdminStatusBadge
                          value={coupon.status}
                          label={coupon.status === "active" ? "Aktif" : "Pasif"}
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        %{coupon.discountRate} indirim
                        {coupon.usageLimit
                          ? ` · ${coupon.usedCount}/${coupon.usageLimit} kullanım`
                          : " · sınırsız kullanım"}
                        {coupon.expiresAt
                          ? ` · ${formatAdminDate(coupon.expiresAt)} bitiş`
                          : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleCouponEdit(coupon)}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleGeneralCouponStatus(
                            coupon,
                            coupon.status === "active" ? "passive" : "active"
                          )
                        }
                        disabled={pending}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs font-medium text-white transition disabled:opacity-60",
                          coupon.status === "active"
                            ? "bg-rose-600 hover:bg-rose-700"
                            : "bg-slate-950 hover:bg-slate-800"
                        )}
                      >
                        {coupon.status === "active" ? "Pasifleştir" : "Aktif Et"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-8 text-sm text-slate-500">
                Henüz genel kupon yok.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ad, e-posta, telefon, etiket veya kupon ara"
            className="w-full rounded-[24px] border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none shadow-sm transition focus:border-slate-950"
          />
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as "all" | UserStatus)}
          className="rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none shadow-sm transition focus:border-slate-950"
        >
          <option value="all">Tüm durumlar</option>
          <option value="active">Aktif üyeler</option>
          <option value="suspended">Askıdakiler</option>
        </select>
        <select
          value={segment}
          onChange={(event) => setSegment(event.target.value)}
          className="rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none shadow-sm transition focus:border-slate-950"
        >
          <option value="all">Tüm segmentler</option>
          {segments.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-rose-100 bg-rose-50 px-5 py-4">
          <p className="text-sm font-medium text-rose-900">
            {selectedIds.size} üye seçildi.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleBulkStatus("active")}
              disabled={pending}
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              Aktif Et
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatus("suspended")}
              disabled={pending}
              className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-60"
            >
              Askıya Al
            </button>
          </div>
        </div>
      )}

      <AdminTableCard
        title="Üye listesi"
        description={`${filteredMembers.length} üye listeleniyor.`}
      >
        {filteredMembers.length > 0 ? (
          <table className="min-w-full text-left">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.25em] text-slate-500">
              <tr>
                <th className="w-12 px-6 py-4 font-medium">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleAllFiltered}
                    className="h-4 w-4 rounded border-slate-300 accent-slate-950"
                    aria-label="Tüm üyeleri seç"
                  />
                </th>
                <th className="px-6 py-4 font-medium">Üye</th>
                <th className="px-6 py-4 font-medium">Segment</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium">Sipariş</th>
                <th className="px-6 py-4 font-medium">Harcama</th>
                <th className="px-6 py-4 font-medium">Son işlem</th>
                <th className="px-6 py-4 font-medium text-right">Detay</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className={cn(
                    "border-b border-slate-100 text-sm last:border-b-0",
                    selectedIds.has(member.id) && "bg-rose-50/50"
                  )}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(member.id)}
                      onChange={() => toggleMember(member.id)}
                      className="h-4 w-4 rounded border-slate-300 accent-slate-950"
                      aria-label={`${member.firstName} ${member.lastName} seç`}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-950">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{member.email}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {member.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600"
                        >
                          <Tags size={11} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                      {member.segment}
                    </span>
                    {member.privateCouponCode && (
                      <p className="mt-2 text-xs text-rose-600">
                        {member.privateCouponCode}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <AdminStatusBadge
                      value={member.status}
                      label={statusLabels[member.status]}
                    />
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {member.orderCount}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-950">
                    {formatPrice(member.totalSpent)}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {member.lastOrderAt
                      ? formatAdminDate(member.lastOrderAt)
                      : member.lastLoginAt
                        ? formatAdminDate(member.lastLoginAt)
                        : "Henüz yok"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/members/${member.id}`}
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
              title="Üye bulunamadı"
              description="Arama veya filtre kriterleriyle eşleşen üye yok."
            />
          </div>
        )}
      </AdminTableCard>
    </div>
  );
}
