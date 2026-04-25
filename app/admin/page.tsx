import AdminDashboardView from "@/components/admin/AdminDashboardView";
import { dashboardService } from "@/lib/services";

export default async function AdminDashboardPage() {
  const data = await dashboardService.getOverview();
  return <AdminDashboardView data={data} />;
}
