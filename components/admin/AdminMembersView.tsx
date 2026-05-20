"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Ban, Search, ShoppingBag, UsersRound } from "lucide-react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminSectionHeader from "@/components/admin/AdminSectionHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTableCard from "@/components/admin/AdminTableCard";
import { formatAdminDate } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import { AdminMemberSummary, UserStatus } from "@/types";

const statusLabels: Record<UserStatus, string> = {
  active: "Aktif",
  suspended: "Askıda",
};

export default function AdminMembersView({
  initialMembers,
}: {
  initialMembers: AdminMemberSummary[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | UserStatus>("all");

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr");
    return initialMembers.filter((member) => {
      const searchText = [
        member.firstName,
        member.lastName,
        member.email,
        member.phone,
        member.adminNote,
      ]
        .join(" ")
        .toLocaleLowerCase("tr");
      const matchesQuery = normalizedQuery
        ? searchText.includes(normalizedQuery)
        : true;
      const matchesStatus = status === "all" ? true : member.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [initialMembers, query, status]);

  const activeCount = initialMembers.filter(
    (member) => member.status === "active"
  ).length;
  const suspendedCount = initialMembers.filter(
    (member) => member.status === "suspended"
  ).length;
  const totalRevenue = initialMembers.reduce(
    (total, member) => total + member.totalSpent,
    0
  );

  return (
    <div className="space-y-8">
      <AdminSectionHeader
        eyebrow="Customers"
        title="Üye yönetimi"
        description="Üyeleri, sipariş hacimlerini, notları ve hesap durumlarını tek yerden takip edin."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <AdminStatCard
          title="Toplam üye"
          value={initialMembers.length}
          icon={UsersRound}
        />
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
          title="Üye cirosu"
          value={totalRevenue}
          icon={ShoppingBag}
          accent="amber"
          isCurrency
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ad, e-posta, telefon veya not ara"
            className="w-full rounded-[24px] border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none shadow-sm transition focus:border-slate-950"
          />
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as "all" | UserStatus)}
          className="rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none shadow-sm transition focus:border-slate-950"
        >
          <option value="all">Tüm üyeler</option>
          <option value="active">Aktif üyeler</option>
          <option value="suspended">Askıdakiler</option>
        </select>
      </div>

      <AdminTableCard
        title="Üye listesi"
        description={`${filteredMembers.length} üye listeleniyor.`}
      >
        {filteredMembers.length > 0 ? (
          <table className="min-w-full text-left">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.25em] text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Üye</th>
                <th className="px-6 py-4 font-medium">İletişim</th>
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
                  className="border-b border-slate-100 text-sm last:border-b-0"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-950">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Üyelik: {formatAdminDate(member.createdAt)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-950">{member.email}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {member.phone || "Telefon yok"}
                    </p>
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
