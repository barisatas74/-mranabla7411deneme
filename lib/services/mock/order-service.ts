import { OrderService } from "@/lib/services/contracts";
import { getOrderStore, setOrderStore } from "@/lib/services/mock/admin-db";

export const mockOrderService: OrderService = {
  async list() {
    return structuredClone(getOrderStore());
  },

  async getById(id) {
    const order = getOrderStore().find((item) => item.id === id);
    return order ? structuredClone(order) : null;
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
};
