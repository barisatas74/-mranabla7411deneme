/**
 * Admin paneli icin sunucu aksiyonlari (server actions).
 * Istemci bilesenleri bu modulu import ederek mutasyonlari calistirir.
 *
 * MySQL configure edilmisse gercek DB'ye, edilmemisse mock'a yazar.
 */

"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import {
  productService,
  categoryService,
  orderService,
  settingsService,
  userService,
} from "@/lib/services/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import {
  AdminCategoryInput,
  AdminMemberCrmInput,
  AdminMemberManualOrderInput,
  AdminOrderStatusUpdate,
  AdminProductInput,
  AdminSettings,
  UserStatus,
} from "@/types";
import {
  STOREFRONT_CATEGORIES_TAG,
  STOREFRONT_PRODUCTS_TAG,
} from "@/lib/cache-tags";

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
  revalidateTag(STOREFRONT_PRODUCTS_TAG);
  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  return product;
}

export async function updateProductAction(id: string, input: AdminProductInput) {
  await ensureAdmin();
  const product = await productService.update(id, input);
  revalidateTag(STOREFRONT_PRODUCTS_TAG);
  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath("/products");
  if (product?.slug) {
    revalidatePath(`/products/${product.slug}`);
  }
  return product;
}

export async function deleteProductAction(id: string) {
  await ensureAdmin();
  const existing = await productService.getById(id);
  const ok = await productService.remove(id);
  revalidateTag(STOREFRONT_PRODUCTS_TAG);
  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  if (existing?.slug) {
    revalidatePath(`/products/${existing.slug}`);
  }
  return ok;
}

// -----------------------------------------------------------------------------
// Kategori aksiyonlari
// -----------------------------------------------------------------------------
export async function createCategoryAction(input: AdminCategoryInput) {
  await ensureAdmin();
  const category = await categoryService.create(input);
  revalidateTag(STOREFRONT_CATEGORIES_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/api/categories/nav");
  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return category;
}

export async function updateCategoryAction(id: string, input: AdminCategoryInput) {
  await ensureAdmin();
  const category = await categoryService.update(id, input);
  revalidateTag(STOREFRONT_CATEGORIES_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/api/categories/nav");
  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return category;
}

export async function deleteCategoryAction(id: string) {
  await ensureAdmin();
  const ok = await categoryService.remove(id);
  revalidateTag(STOREFRONT_CATEGORIES_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/api/categories/nav");
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
// Uye aksiyonlari
// -----------------------------------------------------------------------------
export async function updateMemberStatusAction(id: string, status: UserStatus) {
  await ensureAdmin();
  const member = await userService.updateAdminMemberStatus(id, status);
  revalidatePath("/admin/members");
  revalidatePath(`/admin/members/${id}`);
  return member;
}

export async function updateMemberNoteAction(id: string, adminNote: string) {
  await ensureAdmin();
  const member = await userService.updateAdminMemberNote(id, adminNote);
  revalidatePath("/admin/members");
  revalidatePath(`/admin/members/${id}`);
  return member;
}

export async function updateMemberCrmAction(
  id: string,
  input: AdminMemberCrmInput
) {
  await ensureAdmin();
  const member = await userService.updateAdminMemberCrm(id, input);
  revalidatePath("/admin/members");
  revalidatePath(`/admin/members/${id}`);
  return member;
}

export async function bulkUpdateMemberStatusAction(
  ids: string[],
  status: UserStatus
) {
  await ensureAdmin();
  const uniqueIds = Array.from(new Set(ids.filter(Boolean))).slice(0, 100);
  const members = await Promise.all(
    uniqueIds.map((id) => userService.updateAdminMemberStatus(id, status))
  );
  revalidatePath("/admin/members");
  for (const id of uniqueIds) {
    revalidatePath(`/admin/members/${id}`);
  }
  return members.filter((member) => member !== null);
}

export async function createMemberManualOrderAction(
  memberId: string,
  input: AdminMemberManualOrderInput
) {
  await ensureAdmin();
  const [member, product] = await Promise.all([
    userService.getAdminMemberById(memberId),
    productService.getById(input.productId),
  ]);

  if (!member) throw new Error("Üye kaydı bulunamadı.");
  if (!product) throw new Error("Ürün bulunamadı.");
  if (product.status !== "active") throw new Error("Bu ürün satışta değil.");

  const quantity = Math.max(1, Math.floor(Number(input.quantity) || 1));
  const subtotal = product.price * quantity;
  const order = await orderService.create({
    userId: member.id,
    customer: {
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: input.phone.trim() || member.phone || "-",
      city: input.city.trim(),
      district: input.district.trim(),
      address: input.address.trim(),
    },
    items: [
      {
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        image: product.images[0] ?? "",
        unitPrice: product.price,
        quantity,
        color: input.color.trim() || product.colors[0]?.name || "",
        size: input.size.trim() || product.sizes[0] || "",
      },
    ],
    subtotal,
    shippingFee: 0,
    discount: 0,
    total: subtotal,
    note: input.note?.trim() || "Admin panelinden manuel oluşturuldu.",
  });

  revalidateTag(STOREFRONT_PRODUCTS_TAG);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${order.id}`);
  revalidatePath("/admin/members");
  revalidatePath(`/admin/members/${member.id}`);
  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
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
