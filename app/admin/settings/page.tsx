import type { Metadata } from "next";
import AdminSettingsForm from "@/components/admin/AdminSettingsForm";
import { settingsService } from "@/lib/services";

export const metadata: Metadata = {
  title: "Ayarlar",
};

export default async function AdminSettingsPage() {
  const settings = await settingsService.get();
  return <AdminSettingsForm initialSettings={settings} />;
}
