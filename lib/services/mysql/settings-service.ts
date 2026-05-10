import "server-only";
import { SettingsService } from "@/lib/services/contracts";
import { getDb } from "@/lib/db";
import { AdminSettings } from "@/types";
import { toBool, toNumber } from "@/lib/services/mysql/_helpers";
import type { RowDataPacket } from "mysql2";

type SettingsRow = RowDataPacket & {
  store_name: string;
  support_email: string | null;
  support_phone: string | null;
  whatsapp_number: string | null;
  address: string | null;
  free_shipping_limit: string | number;
  tax_rate: string | number;
  instagram_url: string | null;
  cargo_lead_time: string | null;
  maintenance_mode: number;
};

const DEFAULT_SETTINGS: AdminSettings = {
  storeName: "Miss Bella",
  supportEmail: "",
  supportPhone: "0530 990 71 63",
  whatsappNumber: "905309907163",
  address: "Esref Dincer Mah., Eski Pazar Cd. No: 20/A, 16600 Gemlik / Bursa",
  freeShippingLimit: 300,
  taxRate: 20,
  instagramUrl: "",
  cargoLeadTime: "1-3 is gunu",
  maintenanceMode: false,
};

function rowToSettings(row: SettingsRow): AdminSettings {
  return {
    storeName: row.store_name,
    supportEmail: row.support_email ?? "",
    supportPhone: row.support_phone ?? "",
    whatsappNumber: row.whatsapp_number ?? "",
    address: row.address ?? "",
    freeShippingLimit: toNumber(row.free_shipping_limit),
    taxRate: toNumber(row.tax_rate),
    instagramUrl: row.instagram_url ?? "",
    cargoLeadTime: row.cargo_lead_time ?? "",
    maintenanceMode: toBool(row.maintenance_mode),
  };
}

export const mysqlSettingsService: SettingsService = {
  async get() {
    const db = getDb();
    const [rows] = await db.execute<SettingsRow[]>(
      `SELECT * FROM settings WHERE id = 1 LIMIT 1`
    );
    return rows[0] ? rowToSettings(rows[0]) : { ...DEFAULT_SETTINGS };
  },

  async update(input) {
    const db = getDb();
    await db.execute(
      `INSERT INTO settings
        (id, store_name, support_email, support_phone, whatsapp_number, address,
         free_shipping_limit, tax_rate, instagram_url, cargo_lead_time, maintenance_mode)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         store_name = VALUES(store_name),
         support_email = VALUES(support_email),
         support_phone = VALUES(support_phone),
         whatsapp_number = VALUES(whatsapp_number),
         address = VALUES(address),
         free_shipping_limit = VALUES(free_shipping_limit),
         tax_rate = VALUES(tax_rate),
         instagram_url = VALUES(instagram_url),
         cargo_lead_time = VALUES(cargo_lead_time),
         maintenance_mode = VALUES(maintenance_mode)`,
      [
        input.storeName,
        input.supportEmail || null,
        input.supportPhone || null,
        input.whatsappNumber || null,
        input.address || null,
        input.freeShippingLimit,
        input.taxRate,
        input.instagramUrl || null,
        input.cargoLeadTime || null,
        input.maintenanceMode ? 1 : 0,
      ]
    );
    return mysqlSettingsService.get();
  },
};
