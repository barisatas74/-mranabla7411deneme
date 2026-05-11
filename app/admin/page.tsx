import AdminDashboardView from "@/components/admin/AdminDashboardView";
import { dashboardService } from "@/lib/services/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const data = await dashboardService.getOverview();
  return <AdminDashboardView data={data} />;
}
