"use server";

import { getShippingPrice, normalizeCouponCode } from "@/lib/commerce";
import { getCurrentUser } from "@/lib/actions/auth";
import {
  couponService,
  orderService,
  productService,
} from "@/lib/services/server";
import {
  AdminCoupon,
  AdminOrder,
  CreateOrderInput,
  ShippingMethod,
  User,
} from "@/types";

type PlaceOrderResult =
  | { ok: true; order: AdminOrder }
  | { ok: false; message: string };

function getCouponError(coupon: AdminCoupon, user: User | null) {
  if (coupon.status !== "active") {
    return "Bu kupon artık aktif değil.";
  }
  if (coupon.expiresAt && Date.parse(coupon.expiresAt) < Date.now()) {
    return "Bu kuponun kullanım süresi dolmuş.";
  }
  if (
    coupon.usageLimit != null &&
    Number.isFinite(Number(coupon.usageLimit)) &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    return "Bu kuponun kullanım hakkı dolmuş.";
  }
  if (coupon.assignedUserId && !user) {
    return "Bu kupon üyeye özel. Kullanmak için giriş yapın.";
  }
  if (coupon.assignedUserId && coupon.assignedUserId !== user?.id) {
    return "Bu kupon başka bir üyeye özel.";
  }
  return null;
}

export async function placeOrderAction(
  input: CreateOrderInput
): Promise<PlaceOrderResult> {
  let reservedCouponCode: string | null = null;

  try {
    if (!input.items.length) {
      return { ok: false, message: "Sepetiniz boş görünüyor." };
    }

    const items: CreateOrderInput["items"] = [];
    for (const item of input.items) {
      const product = item.productId
        ? await productService.getById(item.productId)
        : null;

      if (!product || product.status !== "active") {
        return {
          ok: false,
          message: `${item.productName || "Ürün"} şu anda satışta değil.`,
        };
      }

      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      if (product.stock < quantity) {
        return {
          ok: false,
          message: `${product.name} için yeterli stok yok. Mevcut stok: ${product.stock}.`,
        };
      }

      if (product.sizes.length > 0 && !product.sizes.includes(item.size)) {
        return {
          ok: false,
          message: `${product.name} için seçilen beden artık geçerli değil.`,
        };
      }

      const productColorNames = product.colors.map((color) => color.name);
      if (
        productColorNames.length > 0 &&
        item.color &&
        !productColorNames.includes(item.color)
      ) {
        return {
          ok: false,
          message: `${product.name} için seçilen renk artık geçerli değil.`,
        };
      }

      items.push({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        image: product.images[0] ?? "",
        unitPrice: product.price,
        quantity,
        color: item.color,
        size: item.size,
      });
    }

    const subtotal = items.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );
    const shippingMethod: ShippingMethod =
      input.shippingMethod === "express" ? "express" : "standard";
    const shippingFee = getShippingPrice(subtotal, shippingMethod);
    const user = await getCurrentUser().catch(() => null);
    const couponCode = normalizeCouponCode(input.couponCode);
    let discount = 0;

    if (couponCode) {
      const coupon = await couponService.getByCode(couponCode);
      if (!coupon) {
        return { ok: false, message: "Kupon kodu geçersiz veya tanımsız." };
      }

      const couponError = getCouponError(coupon, user);
      if (couponError) {
        return { ok: false, message: couponError };
      }

      const marked = await couponService.markUsed(coupon.code);
      if (!marked) {
        return { ok: false, message: "Bu kupon şu anda kullanılamıyor." };
      }

      reservedCouponCode = coupon.code;
      discount = Math.max(
        0,
        Math.min(Math.round(subtotal * (coupon.discountRate / 100)), subtotal)
      );
    }

    const total = Math.max(0, subtotal + shippingFee - discount);
    const payload: CreateOrderInput = {
      ...input,
      items,
      subtotal,
      shippingFee,
      discount,
      total,
      userId: user?.id,
    };

    const order = await orderService.create(payload);
    return { ok: true, order };
  } catch (error) {
    if (reservedCouponCode) {
      await couponService.releaseUsage(reservedCouponCode).catch(() => undefined);
    }
    console.error("placeOrderAction error:", error);
    return {
      ok: false,
      message: "Sipariş kaydedilemedi. Lütfen tekrar deneyin.",
    };
  }
}
