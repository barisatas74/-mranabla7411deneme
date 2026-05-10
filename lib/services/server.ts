/**
 * Sunucu tarafi servis erişim noktasi.
 * .env DB_TYPE=mysql + baglanti bilgileri varsa MySQL servislerini,
 * yoksa mock (bellek) servislerini kullanir.
 *
 * Bu modul yalnizca sunucuda calisir ("server-only"). Server Component
 * page.tsx dosyalarindan veya server action'lardan import edilmelidir.
 */

import "server-only";
import { isDbEnabled } from "@/lib/db";
import {
  CategoryService,
  DashboardService,
  OrderService,
  ProductService,
  SettingsService,
} from "@/lib/services/contracts";

import { mockCategoryService } from "@/lib/services/mock/category-service";
import { mockDashboardService } from "@/lib/services/mock/dashboard-service";
import { mockOrderService } from "@/lib/services/mock/order-service";
import { mockProductService } from "@/lib/services/mock/product-service";
import { mockSettingsService } from "@/lib/services/mock/settings-service";

import { mysqlCategoryService } from "@/lib/services/mysql/category-service";
import { mysqlDashboardService } from "@/lib/services/mysql/dashboard-service";
import { mysqlOrderService } from "@/lib/services/mysql/order-service";
import { mysqlProductService } from "@/lib/services/mysql/product-service";
import { mysqlSettingsService } from "@/lib/services/mysql/settings-service";

const useMysql = isDbEnabled();

export const productService: ProductService = useMysql
  ? mysqlProductService
  : mockProductService;

export const categoryService: CategoryService = useMysql
  ? mysqlCategoryService
  : mockCategoryService;

export const orderService: OrderService = useMysql
  ? mysqlOrderService
  : mockOrderService;

export const settingsService: SettingsService = useMysql
  ? mysqlSettingsService
  : mockSettingsService;

export const dashboardService: DashboardService = useMysql
  ? mysqlDashboardService
  : mockDashboardService;

export function getServiceMode(): "mysql" | "mock" {
  return useMysql ? "mysql" : "mock";
}
