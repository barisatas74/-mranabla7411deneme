import { SettingsService } from "@/lib/services/contracts";
import {
  getSettingsStore,
  setSettingsStore,
} from "@/lib/services/mock/admin-db";

export const mockSettingsService: SettingsService = {
  async get() {
    return structuredClone(getSettingsStore());
  },

  async update(input) {
    setSettingsStore(structuredClone(input));
    return structuredClone(getSettingsStore());
  },
};
