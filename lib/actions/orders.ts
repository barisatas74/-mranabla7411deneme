"use server";

import { orderService } from "@/lib/services/server";
import { getCurrentUser } from "@/lib/actions/auth";
import { AdminOrder, CreateOrderInput } from "@/types";

export async function placeOrderAction(
  input: CreateOrderInput
): Promise<AdminOrder | null> {
  try {
    if (!input.items.length) return null;
    const user = await getCurrentUser().catch(() => null);
    const payload: CreateOrderInput = user
      ? { ...input, userId: user.id }
      : input;
    return await orderService.create(payload);
  } catch (error) {
    console.error("placeOrderAction error:", error);
    return null;
  }
}
