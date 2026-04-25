import { mockCategoryService } from "@/lib/services/mock/category-service";
import { mockDashboardService } from "@/lib/services/mock/dashboard-service";
import { mockOrderService } from "@/lib/services/mock/order-service";
import { mockProductService } from "@/lib/services/mock/product-service";
import { mockSettingsService } from "@/lib/services/mock/settings-service";

export const productService = mockProductService;
export const categoryService = mockCategoryService;
export const orderService = mockOrderService;
export const settingsService = mockSettingsService;
export const dashboardService = mockDashboardService;
