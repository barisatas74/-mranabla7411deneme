import { OrderService } from "@/lib/services/contracts";
import { getOrderStore, setOrderStore } from "@/lib/services/mock/admin-db";
import { AdminOrder } from "@/types";

export const mockOrderService: OrderService = {
  async list() {
    return structuredClone(getOrderStore());
  },

  async getById(id) {
    const order = getOrderStore().find((item) => item.id === id);
    return order ? structuredClone(order) : null;
  },

  async create(input) {
    const id = `o-${Date.now().toString(36)}`;
    const order: AdminOrder = {
      id,
      orderNumber: `MB-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "beklemede",
      paymentStatus: "bekleniyor",
      shippingStatus: "hazirlaniyor",
      customer: input.customer,
      items: input.items.map((item, index) => ({
        id: `oi-${id}-${index}`,
        ...item,
      })),
      subtotal: input.subtotal,
      shippingFee: input.shippingFee,
      discount: input.discount,
      total: input.total,
      note: input.note,
    };
    setOrderStore([order, ...getOrderStore()]);
    return structuredClone(order);
  },

  async updateStatus(id, input) {
    const existing = getOrderStore().find((item) => item.id === id);
    if (!existing) {
      return null;
    }

    const nextOrder = { ...existing, ...input };
    setOrderStore(getOrderStore().map((item) => (item.id === id ? nextOrder : item)));
    return structuredClone(nextOrder);
  },

  async cancel(id, reason) {
    const existing = getOrderStore().find((item) => item.id === id);
    if (!existing) return null;

    const nextOrder: AdminOrder = {
      ...existing,
      status: "iptal-edildi",
      cancellationReason: reason.trim() || undefined,
      cancelledAt: existing.cancelledAt ?? new Date().toISOString(),
    };
    setOrderStore(
      getOrderStore().map((item) => (item.id === id ? nextOrder : item))
    );
    return structuredClone(nextOrder);
  },
};
