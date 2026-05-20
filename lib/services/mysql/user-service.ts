import "server-only";
import { getDb } from "@/lib/db";
import { generateId, parseDate } from "@/lib/services/mysql/_helpers";
import { hashPassword, verifyPassword } from "@/lib/user-auth";
import {
  AdminMemberDetail,
  AdminMemberCrmInput,
  AdminMemberSummary,
  AdminOrder,
  RegisterInput,
  User,
  UserStatus,
} from "@/types";
import type { RowDataPacket } from "mysql2";

type UserRow = RowDataPacket & {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  status?: UserStatus;
  admin_note?: string | null;
  customer_tags?: string | null;
  loyalty_points?: number | null;
  private_coupon_code?: string | null;
  private_coupon_rate?: number | string | null;
  last_login_at?: string | null;
  created_at: string;
};

type AdminMemberRow = UserRow & {
  order_count: number | string;
  total_spent: number | string | null;
  last_order_at: string | null;
};

let adminColumnsReady = false;

async function ensureAdminUserColumns() {
  if (adminColumnsReady) return;
  const db = getDb();
  const [columns] = await db.execute<RowDataPacket[]>(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME IN (
          'status',
          'admin_note',
          'customer_tags',
          'loyalty_points',
          'private_coupon_code',
          'private_coupon_rate',
          'last_login_at'
        )`
  );
  const existing = new Set(columns.map((column) => String(column.COLUMN_NAME)));

  if (!existing.has("status")) {
    await db.execute(
      `ALTER TABLE users
        ADD COLUMN status ENUM('active','suspended') NOT NULL DEFAULT 'active'
        AFTER phone`
    );
  }
  if (!existing.has("admin_note")) {
    await db.execute(`ALTER TABLE users ADD COLUMN admin_note TEXT NULL AFTER status`);
  }
  if (!existing.has("last_login_at")) {
    await db.execute(
      `ALTER TABLE users ADD COLUMN last_login_at DATETIME NULL AFTER admin_note`
    );
  }
  if (!existing.has("customer_tags")) {
    await db.execute(`ALTER TABLE users ADD COLUMN customer_tags TEXT NULL`);
  }
  if (!existing.has("loyalty_points")) {
    await db.execute(
      `ALTER TABLE users ADD COLUMN loyalty_points INT NOT NULL DEFAULT 0`
    );
  }
  if (!existing.has("private_coupon_code")) {
    await db.execute(`ALTER TABLE users ADD COLUMN private_coupon_code VARCHAR(60) NULL`);
  }
  if (!existing.has("private_coupon_rate")) {
    await db.execute(
      `ALTER TABLE users ADD COLUMN private_coupon_rate DECIMAL(5,2) NULL`
    );
  }

  adminColumnsReady = true;
}

function parseTags(value?: string | null) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((tag): tag is string => typeof tag === "string")
      : [];
  } catch {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
}

function normalizeTags(tags: string[]) {
  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 12)
    )
  );
}

function getMemberSegment(row: AdminMemberRow) {
  const orderCount = Number(row.order_count ?? 0);
  const totalSpent = Number(row.total_spent ?? 0);
  const lastOrderAt = row.last_order_at ? Date.parse(row.last_order_at) : 0;
  const daysSinceLastOrder = lastOrderAt
    ? (Date.now() - lastOrderAt) / (1000 * 60 * 60 * 24)
    : Infinity;

  if ((row.status ?? "active") === "suspended") return "Askıda";
  if (orderCount === 0) return "Sipariş vermeyen";
  if (totalSpent >= 5000 || orderCount >= 5) return "VIP";
  if (orderCount >= 2) return "Tekrar alışveriş";
  if (daysSinceLastOrder > 90) return "Pasif müşteri";
  return "Yeni müşteri";
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone ?? "",
    status: row.status ?? "active",
    adminNote: row.admin_note ?? "",
    lastLoginAt: row.last_login_at ? parseDate(row.last_login_at) : undefined,
    createdAt: parseDate(row.created_at),
  };
}

function rowToAdminMember(row: AdminMemberRow): AdminMemberSummary {
  return {
    ...rowToUser(row),
    status: row.status ?? "active",
    adminNote: row.admin_note ?? "",
    tags: parseTags(row.customer_tags),
    segment: getMemberSegment(row),
    loyaltyPoints: Number(row.loyalty_points ?? 0),
    privateCouponCode: row.private_coupon_code ?? undefined,
    privateCouponRate:
      row.private_coupon_rate != null ? Number(row.private_coupon_rate) : undefined,
    orderCount: Number(row.order_count ?? 0),
    totalSpent: Number(row.total_spent ?? 0),
    lastOrderAt: row.last_order_at ? parseDate(row.last_order_at) : undefined,
    lastLoginAt: row.last_login_at ? parseDate(row.last_login_at) : undefined,
  };
}

export const mysqlUserService = {
  async getById(id: string): Promise<User | null> {
    await ensureAdminUserColumns();
    const db = getDb();
    const [rows] = await db.execute<UserRow[]>(
      `SELECT * FROM users WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] ? rowToUser(rows[0]) : null;
  },

  async getByEmail(email: string): Promise<User | null> {
    await ensureAdminUserColumns();
    const db = getDb();
    const [rows] = await db.execute<UserRow[]>(
      `SELECT * FROM users WHERE email = ? LIMIT 1`,
      [email.toLowerCase().trim()]
    );
    return rows[0] ? rowToUser(rows[0]) : null;
  },

  async create(input: RegisterInput): Promise<User> {
    await ensureAdminUserColumns();
    const db = getDb();
    const email = input.email.toLowerCase().trim();

    // Email zaten var mi?
    const existing = await mysqlUserService.getByEmail(email);
    if (existing) {
      throw new Error("Bu e-posta ile bir hesap zaten mevcut.");
    }

    const id = generateId("u");
    const passwordHash = await hashPassword(input.password);

    await db.execute(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, phone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        email,
        passwordHash,
        input.firstName.trim(),
        input.lastName.trim(),
        input.phone?.trim() || null,
      ]
    );

    const created = await mysqlUserService.getById(id);
    if (!created) throw new Error("Kullanici olusturuldu fakat okunamadi.");
    return created;
  },

  async verifyCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    await ensureAdminUserColumns();
    const db = getDb();
    const [rows] = await db.execute<UserRow[]>(
      `SELECT * FROM users WHERE email = ? LIMIT 1`,
      [email.toLowerCase().trim()]
    );
    const row = rows[0];
    if (!row) return null;
    const ok = await verifyPassword(password, row.password_hash);
    if (!ok) return null;
    if ((row.status ?? "active") === "suspended") return rowToUser(row);
    await db.execute(`UPDATE users SET last_login_at = NOW() WHERE id = ?`, [row.id]);
    return rowToUser({ ...row, last_login_at: new Date().toISOString() });
  },

  async update(
    id: string,
    input: Partial<Pick<User, "firstName" | "lastName" | "phone">>
  ): Promise<User | null> {
    await ensureAdminUserColumns();
    const db = getDb();
    const fields: string[] = [];
    const values: (string | null)[] = [];
    if (input.firstName !== undefined) {
      fields.push("first_name = ?");
      values.push(input.firstName.trim());
    }
    if (input.lastName !== undefined) {
      fields.push("last_name = ?");
      values.push(input.lastName.trim());
    }
    if (input.phone !== undefined) {
      fields.push("phone = ?");
      values.push(input.phone.trim() || null);
    }
    if (fields.length === 0) return mysqlUserService.getById(id);
    values.push(id);
    await db.execute(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    return mysqlUserService.getById(id);
  },

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ ok: boolean; message?: string }> {
    await ensureAdminUserColumns();
    const db = getDb();
    const [rows] = await db.execute<UserRow[]>(
      `SELECT * FROM users WHERE id = ? LIMIT 1`,
      [id]
    );
    const row = rows[0];
    if (!row) return { ok: false, message: "Kullanıcı bulunamadı." };
    const ok = await verifyPassword(currentPassword, row.password_hash);
    if (!ok) return { ok: false, message: "Mevcut şifreniz hatalı." };
    if (newPassword.length < 6) {
      return { ok: false, message: "Yeni şifre en az 6 karakter olmalı." };
    }
    const newHash = await hashPassword(newPassword);
    await db.execute(`UPDATE users SET password_hash = ? WHERE id = ?`, [
      newHash,
      id,
    ]);
    return { ok: true };
  },

  async removeAccount(id: string): Promise<boolean> {
    await ensureAdminUserColumns();
    const db = getDb();
    const existing = await mysqlUserService.getById(id);
    if (!existing) return false;

    await db.execute(`UPDATE orders SET user_id = NULL WHERE user_id = ?`, [id]);
    await db.execute(`DELETE FROM user_addresses WHERE user_id = ?`, [id]);
    await db.execute(`DELETE FROM users WHERE id = ?`, [id]);
    return true;
  },

  async listAdminMembers(): Promise<AdminMemberSummary[]> {
    await ensureAdminUserColumns();
    const db = getDb();
    const [rows] = await db.execute<AdminMemberRow[]>(
      `SELECT
          u.id, u.email, u.password_hash, u.first_name, u.last_name, u.phone,
          u.status, u.admin_note, u.customer_tags, u.loyalty_points,
          u.private_coupon_code, u.private_coupon_rate, u.last_login_at, u.created_at,
          COUNT(o.id) AS order_count,
          COALESCE(SUM(o.total), 0) AS total_spent,
          MAX(o.created_at) AS last_order_at
        FROM users u
        LEFT JOIN orders o ON o.user_id = u.id
        GROUP BY
          u.id, u.email, u.password_hash, u.first_name, u.last_name, u.phone,
          u.status, u.admin_note, u.customer_tags, u.loyalty_points,
          u.private_coupon_code, u.private_coupon_rate, u.last_login_at, u.created_at
        ORDER BY u.created_at DESC`
    );

    return rows.map(rowToAdminMember);
  },

  async getAdminMemberById(id: string): Promise<AdminMemberDetail | null> {
    await ensureAdminUserColumns();
    const members = await mysqlUserService.listAdminMembers();
    const member = members.find((item) => item.id === id);
    if (!member) return null;

    const [{ mysqlAddressService }] = await Promise.all([
      import("@/lib/services/mysql/address-service"),
    ]);
    const [addresses, orders] = await Promise.all([
      mysqlAddressService.listForUser(id).catch(() => []),
      mysqlUserService.getOrdersForUser(id).catch(() => []),
    ]);

    return {
      ...member,
      addresses,
      orders,
    };
  },

  async updateAdminMemberStatus(
    id: string,
    status: UserStatus
  ): Promise<AdminMemberSummary | null> {
    await ensureAdminUserColumns();
    const db = getDb();
    await db.execute(`UPDATE users SET status = ? WHERE id = ?`, [status, id]);
    const member = await mysqlUserService.getAdminMemberById(id);
    return member;
  },

  async updateAdminMemberNote(
    id: string,
    adminNote: string
  ): Promise<AdminMemberSummary | null> {
    await ensureAdminUserColumns();
    const db = getDb();
    await db.execute(`UPDATE users SET admin_note = ? WHERE id = ?`, [
      adminNote.trim() || null,
      id,
    ]);
    const member = await mysqlUserService.getAdminMemberById(id);
    return member;
  },

  async updateAdminMemberCrm(
    id: string,
    input: AdminMemberCrmInput
  ): Promise<AdminMemberSummary | null> {
    await ensureAdminUserColumns();
    const db = getDb();
    const tags = normalizeTags(input.tags);
    const loyaltyPoints = Math.max(0, Math.floor(Number(input.loyaltyPoints) || 0));
    const privateCouponCode = input.privateCouponCode?.trim().toUpperCase() || null;
    const privateCouponRate =
      input.privateCouponRate != null && Number.isFinite(Number(input.privateCouponRate))
        ? Math.max(5, Math.min(50, Number(input.privateCouponRate)))
        : null;

    await db.execute(
      `UPDATE users
        SET customer_tags = ?,
            loyalty_points = ?,
            private_coupon_code = ?,
            private_coupon_rate = ?
       WHERE id = ?`,
      [
        tags.length > 0 ? JSON.stringify(tags) : null,
        loyaltyPoints,
        privateCouponCode,
        privateCouponRate,
        id,
      ]
    );
    const member = await mysqlUserService.getAdminMemberById(id);
    return member;
  },

  async listOrdersByUserId(userId: string) {
    await ensureAdminUserColumns();
    const db = getDb();
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT id FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    return rows.map((r) => String(r.id));
  },

  async getOrderForUserByNumber(
    userId: string,
    orderNumber: string
  ): Promise<AdminOrder | null> {
    const db = getDb();
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT id FROM orders WHERE user_id = ? AND order_number = ? LIMIT 1`,
      [userId, orderNumber]
    );
    if (!rows[0]) return null;
    const { mysqlOrderService } = await import(
      "@/lib/services/mysql/order-service"
    );
    return await mysqlOrderService.getById(String(rows[0].id));
  },

  async getOrdersForUser(userId: string): Promise<AdminOrder[]> {
    const { mysqlOrderService } = await import(
      "@/lib/services/mysql/order-service"
    );
    const db = getDb();
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT id FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );
    const orders = await Promise.all(
      rows.map((row) => mysqlOrderService.getById(String(row.id)))
    );
    return orders.filter((order): order is AdminOrder => order !== null);
  },
};

export type UserService = typeof mysqlUserService;
