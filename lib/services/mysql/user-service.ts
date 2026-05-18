import "server-only";
import { getDb } from "@/lib/db";
import { generateId, parseDate } from "@/lib/services/mysql/_helpers";
import { hashPassword, verifyPassword } from "@/lib/user-auth";
import { AdminOrder, RegisterInput, User } from "@/types";
import type { RowDataPacket } from "mysql2";

type UserRow = RowDataPacket & {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  created_at: string;
};

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone ?? "",
    createdAt: parseDate(row.created_at),
  };
}

export const mysqlUserService = {
  async getById(id: string): Promise<User | null> {
    const db = getDb();
    const [rows] = await db.execute<UserRow[]>(
      `SELECT * FROM users WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] ? rowToUser(rows[0]) : null;
  },

  async getByEmail(email: string): Promise<User | null> {
    const db = getDb();
    const [rows] = await db.execute<UserRow[]>(
      `SELECT * FROM users WHERE email = ? LIMIT 1`,
      [email.toLowerCase().trim()]
    );
    return rows[0] ? rowToUser(rows[0]) : null;
  },

  async create(input: RegisterInput): Promise<User> {
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
    const db = getDb();
    const [rows] = await db.execute<UserRow[]>(
      `SELECT * FROM users WHERE email = ? LIMIT 1`,
      [email.toLowerCase().trim()]
    );
    const row = rows[0];
    if (!row) return null;
    const ok = await verifyPassword(password, row.password_hash);
    return ok ? rowToUser(row) : null;
  },

  async update(
    id: string,
    input: Partial<Pick<User, "firstName" | "lastName" | "phone">>
  ): Promise<User | null> {
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

  async listOrdersByUserId(userId: string) {
    const db = getDb();
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT id FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    return rows.map((r) => String(r.id));
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
