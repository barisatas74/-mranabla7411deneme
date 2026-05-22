import type { Metadata } from "next";
import AdminMembersView from "@/components/admin/AdminMembersView";
import { couponService, userService } from "@/lib/services/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Üyeler",
};

export default async function AdminMembersPage() {
  const [members, coupons] = await Promise.all([
    userService.listAdminMembers(),
    couponService.list(),
  ]);
  return <AdminMembersView initialMembers={members} initialCoupons={coupons} />;
}
