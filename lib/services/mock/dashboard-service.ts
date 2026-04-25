import { DashboardService } from "@/lib/services/contracts";
import {
  getDashboardMetrics,
  getLowStockProducts,
  getRecentOrders,
} from "@/lib/admin";
import { getOrderStore, getProductStore } from "@/lib/services/mock/admin-db";

export const mockDashboardService: DashboardService = {
  async getOverview() {
    const products = structuredClone(getProductStore());
    const orders = structuredClone(getOrderStore());

    return {
      metrics: getDashboardMetrics(products, orders),
      recentOrders: getRecentOrders(orders),
      lowStockProducts: getLowStockProducts(products),
    };
  },
};
