import "server-only";
import { CategoryService } from "@/lib/services/contracts";
import { getDb } from "@/lib/db";
import { deleteUploadedFile } from "@/lib/uploads";
import { AdminCategory, AdminCategoryInput, ProductCategorySlug } from "@/types";
import { generateId } from "@/lib/services/mysql/_helpers";
import type { RowDataPacket } from "mysql2";

type CategoryRow = RowDataPacket & {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  image: string | null;
  status: "active" | "passive";
};

function rowToCategory(row: CategoryRow): AdminCategory {
  return {
    id: row.id,
    slug: row.slug as ProductCategorySlug,
    name: row.name,
    image: row.image ?? "",
    tagline: row.tagline ?? undefined,
    description: row.description ?? undefined,
    status: row.status,
  };
}

const SELECT_COLS = `id, slug, name, tagline, description, image, status`;

export const mysqlCategoryService: CategoryService = {
  async list() {
    const db = getDb();
    const [rows] = await db.execute<CategoryRow[]>(
      `SELECT ${SELECT_COLS} FROM categories ORDER BY name ASC`
    );
    return rows.map(rowToCategory);
  },

  async getById(id) {
    const db = getDb();
    const [rows] = await db.execute<CategoryRow[]>(
      `SELECT ${SELECT_COLS} FROM categories WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] ? rowToCategory(rows[0]) : null;
  },

  async create(input: AdminCategoryInput) {
    const db = getDb();
    const id = generateId("cat");
    await db.execute(
      `INSERT INTO categories (id, slug, name, tagline, description, image, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.slug,
        input.name,
        input.tagline ?? null,
        input.description ?? null,
        input.image || null,
        input.status,
      ]
    );
    const created = await mysqlCategoryService.getById(id);
    if (!created) throw new Error("Kategori olusturulamadi.");
    return created;
  },

  async update(id, input) {
    const db = getDb();
    const existing = await mysqlCategoryService.getById(id);
    if (!existing) return null;

    await db.execute(
      `UPDATE categories SET
         slug = ?, name = ?, tagline = ?, description = ?, image = ?, status = ?
       WHERE id = ?`,
      [
        input.slug,
        input.name,
        input.tagline ?? null,
        input.description ?? null,
        input.image || null,
        input.status,
        id,
      ]
    );

    // Gorsel degistiyse eskisini sil
    if (existing.image && existing.image !== input.image) {
      void deleteUploadedFile(existing.image);
    }

    return mysqlCategoryService.getById(id);
  },

  async remove(id) {
    const db = getDb();
    const existing = await mysqlCategoryService.getById(id);
    if (!existing) return false;

    await db.execute(`DELETE FROM categories WHERE id = ?`, [id]);
    if (existing.image) {
      void deleteUploadedFile(existing.image);
    }
    return true;
  },
};
