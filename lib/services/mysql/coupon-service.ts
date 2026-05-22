import "server-only";
import { CouponService } from "@/lib/services/contracts";
import { getDb } from "@/lib/db";
import { AdminCoupon, AdminCouponInput, CouponStatus } from "@/types";
import { generateId, parseDate, toNumber } from "@/lib/services/mysql/_helpers";
import type { RowDataPacket } from "mysql2";

type CouponRow = RowDataPacket & {
  id: string;
  code: string;
  discount_rate: number | string;
  status: CouponStatus;
  assigned_user_id: string | null;
  usage_limit: number | null;
  used_count: number | string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

let couponTableReady = false;

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

function normalizeCouponInput(input: AdminCouponInput) {
  const discountRate = Math.max(
    5,
    Math.min(50, Number(input.discountRate) || 0)
  );
  const usageLimit =
    input.usageLimit != null && Number.isFinite(Number(input.usageLimit))
      ? Math.max(1, Math.floor(Number(input.usageLimit)))
      : null;

  return {
    code: normalizeCode(input.code),
    discountRate,
    status: input.status,
    assignedUserId: input.assignedUserId?.trim() || null,
    usageLimit,
    expiresAt: input.expiresAt?.trim() || null,
  };
}

async function ensureCouponTable() {
  if (couponTableReady) return;
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS coupons (
      id VARCHAR(64) NOT NULL,
      code VARCHAR(60) NOT NULL,
      discount_rate DECIMAL(5,2) NOT NULL,
      status ENUM('active','passive') NOT NULL DEFAULT 'active',
      assigned_user_id VARCHAR(64) NULL,
      usage_limit INT UNSIGNED NULL,
      used_count INT UNSIGNED NOT NULL DEFAULT 0,
      expires_at DATETIME NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uniq_coupons_code (code),
      KEY idx_coupons_status (status),
      KEY idx_coupons_assigned_user (assigned_user_id),
      KEY idx_coupons_expires (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  couponTableReady = true;
}

function rowToCoupon(row: CouponRow): AdminCoupon {
  return {
    id: row.id,
    code: row.code,
    discountRate: toNumber(row.discount_rate),
    status: row.status,
    assignedUserId: row.assigned_user_id ?? undefined,
    usageLimit: row.usage_limit ?? undefined,
    usedCount: toNumber(row.used_count),
    expiresAt: row.expires_at ? parseDate(row.expires_at) : undefined,
    createdAt: parseDate(row.created_at),
    updatedAt: parseDate(row.updated_at),
  };
}

export const mysqlCouponService: CouponService = {
  async list() {
    await ensureCouponTable();
    const db = getDb();
    const [rows] = await db.execute<CouponRow[]>(
      `SELECT * FROM coupons ORDER BY created_at DESC`
    );
    return rows.map(rowToCoupon);
  },

  async getByCode(code) {
    await ensureCouponTable();
    const db = getDb();
    const [rows] = await db.execute<CouponRow[]>(
      `SELECT * FROM coupons WHERE code = ? LIMIT 1`,
      [normalizeCode(code)]
    );
    return rows[0] ? rowToCoupon(rows[0]) : null;
  },

  async create(input) {
    await ensureCouponTable();
    const db = getDb();
    const id = generateId("c");
    const normalized = normalizeCouponInput(input);

    await db.execute(
      `INSERT INTO coupons
        (id, code, discount_rate, status, assigned_user_id, usage_limit, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        normalized.code,
        normalized.discountRate,
        normalized.status,
        normalized.assignedUserId,
        normalized.usageLimit,
        normalized.expiresAt,
      ]
    );

    const created = await mysqlCouponService.getByCode(normalized.code);
    if (!created) throw new Error("Kupon olusturuldu fakat okunamadi.");
    return created;
  },

  async update(id, input) {
    await ensureCouponTable();
    const db = getDb();
    const normalized = normalizeCouponInput(input);

    const [result] = await db.execute(
      `UPDATE coupons
       SET code = ?,
           discount_rate = ?,
           status = ?,
           assigned_user_id = ?,
           usage_limit = ?,
           expires_at = ?
       WHERE id = ?`,
      [
        normalized.code,
        normalized.discountRate,
        normalized.status,
        normalized.assignedUserId,
        normalized.usageLimit,
        normalized.expiresAt,
        id,
      ]
    );

    const affected = (result as { affectedRows?: number }).affectedRows ?? 0;
    if (affected === 0) return null;
    return mysqlCouponService.getByCode(normalized.code);
  },
};
