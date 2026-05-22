import {
  adminCategories as seedCategories,
  adminOrders as seedOrders,
  adminProducts as seedProducts,
  adminSettings as seedSettings,
} from "@/data/admin";
import {
  AdminCategory,
  AdminCoupon,
  AdminOrder,
  AdminProduct,
  AdminSettings,
} from "@/types";

let productStore: AdminProduct[] = structuredClone(seedProducts);
let categoryStore: AdminCategory[] = structuredClone(seedCategories);
let orderStore: AdminOrder[] = structuredClone(seedOrders);
let settingsStore: AdminSettings = structuredClone(seedSettings);
let couponStore: AdminCoupon[] = [
  {
    id: "c-default-rosa30",
    code: "ROSA30",
    discountRate: 30,
    status: "active",
    usedCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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

export function getCouponStore() {
  return couponStore;
}

export function setCouponStore(nextCoupons: AdminCoupon[]) {
  couponStore = nextCoupons;
}
