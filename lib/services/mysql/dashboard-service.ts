import "server-only";
import { DashboardService } from "@/lib/services/contracts";
import {
  getDashboardMetrics,
  getLowStockProducts,
  getRecentOrders,
} from "@/lib/admin";
import { mysqlOrderService } from "@/lib/services/mysql/order-service";
import { mysqlProductService } from "@/lib/services/mysql/product-service";

export const mysqlDashboardService: DashboardService = {
  async getOverview() {
    const [products, orders] = await Promise.all([
      mysqlProductService.list(),
      mysqlOrderService.list(),
    ]);

    return {
      metrics: getDashboardMetrics(products, orders),
      recentOrders: getRecentOrders(orders),
      lowStockProducts: getLowStockProducts(products),
    };
  },
};
