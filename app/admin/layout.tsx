import type { Metadata } from "next";
import { AdminFeedbackProvider } from "@/components/admin/feedback/AdminFeedbackProvider";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin",
  description: "Miss Bella admin paneli yonetim arayuzu.",
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
