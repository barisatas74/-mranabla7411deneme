import type { Metadata } from "next";
import { AdminFeedbackProvider } from "@/components/admin/feedback/AdminFeedbackProvider";
import AdminShell from "@/components/admin/AdminShell";

// Admin sayfalarini build sirasinda statik onceden render etme:
// her zaman istek aninda render edilsin. Boylece build sirasinda
// DB'ye erisilmez (DB ulasilamasa bile build basarili olur).
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin",
  description: "Miss Bella admin paneli yönetim arayüzü.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminFeedbackProvider>
      <AdminShell>{children}</AdminShell>
    </AdminFeedbackProvider>
  );
}
