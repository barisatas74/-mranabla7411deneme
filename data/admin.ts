import {
  AdminCategory,
  AdminOrder,
  AdminProduct,
  AdminSettings,
} from "@/types";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

export const adminProducts: AdminProduct[] = products.map((product) => ({
  ...product,
  sku: `MB-${product.id.toUpperCase()}`,
  status: "active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const adminCategories: AdminCategory[] = categories.map((category) => ({
  ...category,
  status: "active",
  description: "",
}));

export const adminOrders: AdminOrder[] = [];

export const adminSettings: AdminSettings = {
  storeName: "Miss Bella",
  supportEmail: "",
  supportPhone: "",
  whatsappNumber: "",
  address: "",
  freeShippingLimit: 300,
  taxRate: 20,
  instagramUrl: "",
  cargoLeadTime: "1-3 iş günü",
  maintenanceMode: false,
};

export function getAdminProductById(id: string) {
  return adminProducts.find((product) => product.id === id);
}

export function getAdminOrderById(id: string) {
  return adminOrders.find((order) => order.id === id);
}
