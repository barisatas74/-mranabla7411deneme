/**
 * Admin paneli icin sunucu aksiyonlari (server actions).
 * Istemci bilesenleri bu modulu import ederek mutasyonlari calistirir.
 *
 * MySQL configure edilmisse gercek DB'ye, edilmemisse mock'a yazar.
 */

"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  productService,
  categoryService,
  orderService,
  settingsService,
} from "@/lib/services/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import {
  AdminCategoryInput,
  AdminOrderStatusUpdate,
  AdminProductInput,
  AdminSettings,
} from "@/types";

async function ensureAdmin() {
  const expectedToken = process.env.ADMIN_SESSION_TOKEN;
  if (!expectedToken) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Admin paneli yapilandirilmamis.");
    }
    return; // gelistirme modunda izin ver
  }
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (value !== expectedToken) {
    throw new Error("Yetkisiz islem.");
  }
}

// -----------------------------------------------------------------------------
// Urun aksiyonlari
// -----------------------------------------------------------------------------
export async function createProductAction(input: AdminProductInput) {
  await ensureAdmin();
  const product = await productService.create(input);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return product;
}

export async function updateProductAction(id: string, input: AdminProductInput) {
  await ensureAdmin();
  const product = await productService.update(id, input);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath("/products");
  return product;
}

export async function deleteProductAction(id: string) {
  await ensureAdmin();
  const ok = await productService.remove(id);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return ok;
}

// -----------------------------------------------------------------------------
// Kategori aksiyonlari
// -----------------------------------------------------------------------------
export async function createCategoryAction(input: AdminCategoryInput) {
  await ensureAdmin();
  const category = await categoryService.create(input);
  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return category;
}

export async function updateCategoryAction(id: string, input: AdminCategoryInput) {
  await ensureAdmin();
  const category = await categoryService.update(id, input);
  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return category;
}

export async function deleteCategoryAction(id: string) {
  await ensureAdmin();
  const ok = await categoryService.remove(id);
  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return ok;
}

// -----------------------------------------------------------------------------
// Siparis aksiyonlari
// -----------------------------------------------------------------------------
export async function updateOrderStatusAction(
  id: string,
  input: AdminOrderStatusUpdate
) {
  await ensureAdmin();
  const order = await orderService.updateStatus(id, input);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return order;
}

// -----------------------------------------------------------------------------
// Ayarlar
// -----------------------------------------------------------------------------
export async function updateSettingsAction(input: AdminSettings) {
  await ensureAdmin();
  const settings = await settingsService.update(input);
  revalidatePath("/admin/settings");
  return settings;
}
