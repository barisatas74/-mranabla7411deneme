import type { Metadata } from "next";
import AdminMembersView from "@/components/admin/AdminMembersView";
import { userService } from "@/lib/services/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Üyeler",
};

export default async function AdminMembersPage() {
  const members = await userService.listAdminMembers();
  return <AdminMembersView initialMembers={members} />;
}
