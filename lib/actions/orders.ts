"use server";

import { getShippingPrice } from "@/lib/commerce";
import { getCurrentUser } from "@/lib/actions/auth";
import { orderService, productService } from "@/lib/services/server";
import { AdminOrder, CreateOrderInput, ShippingMethod } from "@/types";

type PlaceOrderResult =
  | { ok: true; order: AdminOrder }
  | { ok: false; message: string };

export async function placeOrderAction(
  input: CreateOrderInput
): Promise<PlaceOrderResult> {
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
    const discount = Math.max(0, Math.min(input.discount, subtotal));
    const total = Math.max(0, subtotal + shippingFee - discount);
    const user = await getCurrentUser().catch(() => null);
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
    console.error("placeOrderAction error:", error);
    return {
      ok: false,
      message: "Sipariş kaydedilemedi. Lütfen tekrar deneyin.",
    };
  }
}
