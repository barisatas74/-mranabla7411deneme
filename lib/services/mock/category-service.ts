import { CategoryService } from "@/lib/services/contracts";
import {
  getCategoryStore,
  setCategoryStore,
} from "@/lib/services/mock/admin-db";
import { AdminCategoryInput } from "@/types";

export const mockCategoryService: CategoryService = {
  async list() {
    return structuredClone(getCategoryStore());
  },

  async getById(id) {
    const category = getCategoryStore().find((item) => item.id === id);
    return category ? structuredClone(category) : null;
  },

  async create(input: AdminCategoryInput) {
    const nextCategory = {
      id: `cat-${getCategoryStore().length + 1}`,
      ...input,
    };
    setCategoryStore([nextCategory, ...getCategoryStore()]);
    return structuredClone(nextCategory);
  },

  async update(id, input) {
    const existing = getCategoryStore().find((item) => item.id === id);
    if (!existing) {
      return null;
    }

    const nextCategory = { ...existing, ...input };
    setCategoryStore(
      getCategoryStore().map((item) => (item.id === id ? nextCategory : item))
    );
    return structuredClone(nextCategory);
  },

  async remove(id) {
    const exists = getCategoryStore().some((item) => item.id === id);
    if (!exists) {
      return false;
    }

    setCategoryStore(getCategoryStore().filter((item) => item.id !== id));
    return true;
  },
};
