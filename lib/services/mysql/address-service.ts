import "server-only";
import { getDb } from "@/lib/db";
import {
  generateId,
  parseDate,
  toBool,
} from "@/lib/services/mysql/_helpers";
import { UserAddress, UserAddressInput } from "@/types";
import type { RowDataPacket } from "mysql2";

type AddressRow = RowDataPacket & {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  postal_code: string | null;
  is_default: number;
  created_at: string;
};

function rowToAddress(row: AddressRow): UserAddress {
  return {
    id: row.id,
    userId: row.user_id,
    label: row.label,
    fullName: row.full_name,
    phone: row.phone,
    city: row.city,
    district: row.district,
    address: row.address,
    postalCode: row.postal_code ?? "",
    isDefault: toBool(row.is_default),
    createdAt: parseDate(row.created_at),
  };
}

function sanitize(input: UserAddressInput) {
  return {
    label: input.label.trim().slice(0, 60),
    fullName: input.fullName.trim().slice(0, 180),
    phone: input.phone.trim().slice(0, 40),
    city: input.city.trim().slice(0, 80),
    district: input.district.trim().slice(0, 120),
    address: input.address.trim().slice(0, 2000),
    postalCode: input.postalCode?.trim().slice(0, 12) || null,
  };
}

export const mysqlAddressService = {
  async listForUser(userId: string): Promise<UserAddress[]> {
    const db = getDb();
    const [rows] = await db.execute<AddressRow[]>(
      `SELECT * FROM user_addresses
        WHERE user_id = ?
        ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );
    return rows.map(rowToAddress);
  },

  async getById(id: string, userId: string): Promise<UserAddress | null> {
    const db = getDb();
    const [rows] = await db.execute<AddressRow[]>(
      `SELECT * FROM user_addresses WHERE id = ? AND user_id = ? LIMIT 1`,
      [id, userId]
    );
    return rows[0] ? rowToAddress(rows[0]) : null;
  },

  async create(
    userId: string,
    input: UserAddressInput
  ): Promise<UserAddress> {
    const db = getDb();
    const id = generateId("addr");
    const s = sanitize(input);

    // Eger bu ilk adres ise veya isDefault true ise -> diger adreslerin default'unu kaldir
    const [existing] = await db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS c FROM user_addresses WHERE user_id = ?`,
      [userId]
    );
    const count = Number(existing[0]?.c ?? 0);
    const makeDefault = count === 0 || input.isDefault === true;

    if (makeDefault) {
      await db.execute(
        `UPDATE user_addresses SET is_default = 0 WHERE user_id = ?`,
        [userId]
      );
    }

    await db.execute(
      `INSERT INTO user_addresses
        (id, user_id, label, full_name, phone, city, district, address, postal_code, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId,
        s.label,
        s.fullName,
        s.phone,
        s.city,
        s.district,
        s.address,
        s.postalCode,
        makeDefault ? 1 : 0,
      ]
    );

    const created = await mysqlAddressService.getById(id, userId);
    if (!created) throw new Error("Adres olusturuldu fakat okunamadi.");
    return created;
  },

  async update(
    id: string,
    userId: string,
    input: UserAddressInput
  ): Promise<UserAddress | null> {
    const db = getDb();
    const existing = await mysqlAddressService.getById(id, userId);
    if (!existing) return null;
    const s = sanitize(input);
    const setDefault = input.isDefault === true;

    if (setDefault) {
      await db.execute(
        `UPDATE user_addresses SET is_default = 0 WHERE user_id = ?`,
        [userId]
      );
    }

    await db.execute(
      `UPDATE user_addresses
          SET label = ?, full_name = ?, phone = ?, city = ?,
              district = ?, address = ?, postal_code = ?, is_default = ?
        WHERE id = ? AND user_id = ?`,
      [
        s.label,
        s.fullName,
        s.phone,
        s.city,
        s.district,
        s.address,
        s.postalCode,
        setDefault ? 1 : existing.isDefault ? 1 : 0,
        id,
        userId,
      ]
    );

    return mysqlAddressService.getById(id, userId);
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const db = getDb();
    const existing = await mysqlAddressService.getById(id, userId);
    if (!existing) return false;

    await db.execute(
      `DELETE FROM user_addresses WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    // Default silindiyse, kalan en yenisini default yap
    if (existing.isDefault) {
      const remaining = await mysqlAddressService.listForUser(userId);
      if (remaining[0]) {
        await db.execute(
          `UPDATE user_addresses SET is_default = 1 WHERE id = ? AND user_id = ?`,
          [remaining[0].id, userId]
        );
      }
    }
    return true;
  },

  async setDefault(id: string, userId: string): Promise<boolean> {
    const db = getDb();
    const existing = await mysqlAddressService.getById(id, userId);
    if (!existing) return false;
    await db.execute(
      `UPDATE user_addresses SET is_default = 0 WHERE user_id = ?`,
      [userId]
    );
    await db.execute(
      `UPDATE user_addresses SET is_default = 1 WHERE id = ? AND user_id = ?`,
      [id, userId]
    );
    return true;
  },
};

export type AddressService = typeof mysqlAddressService;
