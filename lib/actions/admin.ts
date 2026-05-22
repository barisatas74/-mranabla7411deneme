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
  couponService,
  orderService,
  settingsService,
  userService,
} from "@/lib/services/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import {
  AdminCategoryInput,
  AdminCoupon,
  AdminCouponInput,
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

export async function cancelOrderAction(id: string, reason: string) {
  await ensureAdmin();

  const trimmedReason = reason.trim();
  if (trimmedReason.length < 3) {
    throw new Error("Lütfen en az 3 karakterlik bir iptal nedeni yazın.");
  }
  if (trimmedReason.length > 1000) {
    throw new Error("İptal nedeni 1000 karakteri aşamaz.");
  }

  const order = await orderService.cancel(id, trimmedReason);
  if (!order) {
    throw new Error("Sipariş bulunamadı veya iptal edilemedi.");
  }

  // E-posta bildirimi (stub — RESEND_API_KEY yoksa sessizce loglar)
  // İçe import: server-only modüller server action içinde yüklenebilir.
  try {
    const [{ sendEmail }, { orderStatusUpdateEmail }] = await Promise.all([
      import("@/lib/email"),
      import("@/lib/email-templates"),
    ]);

    const tpl = orderStatusUpdateEmail({
      orderNumber: order.orderNumber,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
      status: "Siparişiniz İptal Edildi",
      message: `Siparişiniz aşağıdaki nedenle iptal edilmiştir:\n\n"${trimmedReason}"\n\nÖdemeniz alındıysa 5-10 iş günü içinde iade edilecektir. Sorularınız için bize ulaşabilirsiniz.`,
    });

    await sendEmail({
      to: order.customer.email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });
  } catch (error) {
    // E-posta gönderimi başarısız olursa iptali geri alma — sadece logla.
    console.error("[cancelOrderAction] e-posta gönderilemedi:", error);
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/hesabim");
  revalidatePath(`/hesabim/siparis/${order.orderNumber}`);
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
  const couponCode = input.privateCouponCode?.trim().toUpperCase();
  const couponRate =
    input.privateCouponRate != null && Number.isFinite(Number(input.privateCouponRate))
      ? Math.max(5, Math.min(50, Math.floor(Number(input.privateCouponRate))))
      : undefined;

  if (couponCode && couponRate) {
    const existingCoupon = await couponService.getByCode(couponCode);
    if (existingCoupon?.assignedUserId && existingCoupon.assignedUserId !== id) {
      throw new Error("Bu kupon kodu başka bir üyeye atanmış.");
    }

    if (existingCoupon) {
      await couponService.update(existingCoupon.id, {
        code: couponCode,
        discountRate: couponRate,
        status: "active",
        assignedUserId: id,
        usageLimit: existingCoupon.usageLimit ?? 1,
        expiresAt: existingCoupon.expiresAt,
      });
    } else {
      await couponService.create({
        code: couponCode,
        discountRate: couponRate,
        status: "active",
        assignedUserId: id,
        usageLimit: 1,
      });
    }
  }

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

// -----------------------------------------------------------------------------
// Kupon aksiyonlari
// -----------------------------------------------------------------------------
export async function upsertGeneralCouponAction(
  input: Omit<AdminCouponInput, "assignedUserId">
) {
  await ensureAdmin();
  const code = input.code.trim().toUpperCase();
  if (!code) {
    throw new Error("Kupon kodu boş olamaz.");
  }

  const couponInput: AdminCouponInput = {
    ...input,
    code,
    assignedUserId: undefined,
    usageLimit:
      input.usageLimit != null && Number.isFinite(Number(input.usageLimit))
        ? Math.max(1, Math.floor(Number(input.usageLimit)))
        : undefined,
    expiresAt: input.expiresAt?.trim() || undefined,
  };
  const existingCoupon = await couponService.getByCode(code);

  if (existingCoupon?.assignedUserId) {
    throw new Error("Bu kupon kodu üyeye özel tanımlanmış.");
  }

  const coupon = existingCoupon
    ? await couponService.update(existingCoupon.id, couponInput)
    : await couponService.create(couponInput);

  revalidatePath("/admin/members");
  return coupon;
}

export async function updateGeneralCouponStatusAction(
  coupon: AdminCoupon,
  status: AdminCoupon["status"]
) {
  await ensureAdmin();
  if (coupon.assignedUserId) {
    throw new Error("Üyeye özel kupon buradan güncellenemez.");
  }

  const updated = await couponService.update(coupon.id, {
    code: coupon.code,
    discountRate: coupon.discountRate,
    status,
    assignedUserId: undefined,
    usageLimit: coupon.usageLimit,
    expiresAt: coupon.expiresAt,
  });

  revalidatePath("/admin/members");
  return updated;
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
