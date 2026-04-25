import {
  AdminCategory,
  AdminCategoryInput,
  AdminDashboardData,
  AdminOrder,
  AdminOrderStatusUpdate,
  AdminProduct,
  AdminProductInput,
  AdminSettings,
} from "@/types";

export interface ProductService {
  list(): Promise<AdminProduct[]>;
  getById(id: string): Promise<AdminProduct | null>;
  create(input: AdminProductInput): Promise<AdminProduct>;
  update(id: string, input: AdminProductInput): Promise<AdminProduct | null>;
  remove(id: string): Promise<boolean>;
}

export interface CategoryService {
  list(): Promise<AdminCategory[]>;
  getById(id: string): Promise<AdminCategory | null>;
  create(input: AdminCategoryInput): Promise<AdminCategory>;
  update(id: string, input: AdminCategoryInput): Promise<AdminCategory | null>;
  remove(id: string): Promise<boolean>;
}

export interface OrderService {
  list(): Promise<AdminOrder[]>;
  getById(id: string): Promise<AdminOrder | null>;
  updateStatus(
    id: string,
    input: AdminOrderStatusUpdate
  ): Promise<AdminOrder | null>;
}

export interface SettingsService {
  get(): Promise<AdminSettings>;
  update(input: AdminSettings): Promise<AdminSettings>;
}

export interface DashboardService {
  getOverview(): Promise<AdminDashboardData>;
}
