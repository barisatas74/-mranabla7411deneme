import {
  adminCategories as seedCategories,
  adminOrders as seedOrders,
  adminProducts as seedProducts,
  adminSettings as seedSettings,
} from "@/data/admin";
import { AdminCategory, AdminOrder, AdminProduct, AdminSettings } from "@/types";

let productStore: AdminProduct[] = structuredClone(seedProducts);
let categoryStore: AdminCategory[] = structuredClone(seedCategories);
let orderStore: AdminOrder[] = structuredClone(seedOrders);
let settingsStore: AdminSettings = structuredClone(seedSettings);

export function getProductStore() {
  return productStore;
}

export function setProductStore(nextProducts: AdminProduct[]) {
  productStore = nextProducts;
}

export function getCategoryStore() {
  return categoryStore;
}

export function setCategoryStore(nextCategories: AdminCategory[]) {
  categoryStore = nextCategories;
}

export function getOrderStore() {
  return orderStore;
}

export function setOrderStore(nextOrders: AdminOrder[]) {
  orderStore = nextOrders;
}

export function getSettingsStore() {
  return settingsStore;
}

export function setSettingsStore(nextSettings: AdminSettings) {
  settingsStore = nextSettings;
}
