import { ProductService } from "@/lib/services/contracts";
import { getProductStore, setProductStore } from "@/lib/services/mock/admin-db";
import { AdminProduct, AdminProductInput } from "@/types";

function nowIso() {
  return new Date().toISOString();
}

function toAdminProduct(id: string, input: AdminProductInput, existing?: AdminProduct) {
  return {
    id,
    sku: existing?.sku ?? `LR-${id.toUpperCase()}-${Math.floor(Math.random() * 90) + 10}`,
    createdAt: existing?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
    ...input,
  };
}

export const mockProductService: ProductService = {
  async list() {
    return structuredClone(getProductStore());
  },

  async getById(id) {
    const product = getProductStore().find((item) => item.id === id);
    return product ? structuredClone(product) : null;
  },

  async create(input) {
    const nextId = `p${getProductStore().length + 1}`;
    const nextProduct = toAdminProduct(nextId, input);
    setProductStore([nextProduct, ...getProductStore()]);
    return structuredClone(nextProduct);
  },

  async update(id, input) {
    const existing = getProductStore().find((item) => item.id === id);
    if (!existing) {
      return null;
    }

    const nextProduct = toAdminProduct(id, input, existing);
    setProductStore(
      getProductStore().map((item) => (item.id === id ? nextProduct : item))
    );

    return structuredClone(nextProduct);
  },

  async remove(id) {
    const exists = getProductStore().some((item) => item.id === id);
    if (!exists) {
      return false;
    }

    setProductStore(getProductStore().filter((item) => item.id !== id));
    return true;
  },
};
