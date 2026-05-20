import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminMemberDetailView from "@/components/admin/AdminMemberDetailView";
import { userService } from "@/lib/services/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Üye Detayı",
};

export default async function AdminMemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await userService.getAdminMemberById(id);
  if (!member) notFound();

  return <AdminMemberDetailView member={member} />;
}
