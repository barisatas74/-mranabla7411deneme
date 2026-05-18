"use server";

import { orderService } from "@/lib/services/server";
import { AdminOrder, CreateOrderInput } from "@/types";

export async function placeOrderAction(
  input: CreateOrderInput
): Promise<AdminOrder | null> {
  try {
    if (!input.items.length) return null;
    return await orderService.create(input);
  } catch (error) {
    console.error("placeOrderAction error:", error);
    return null;
  }
}
