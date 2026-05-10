import "server-only";
import { ProductService } from "@/lib/services/contracts";
import { getDb } from "@/lib/db";
import { deleteUploadedFiles } from "@/lib/uploads";
import {
  AdminProduct,
  AdminProductInput,
  ProductCategorySlug,
  ProductColor,
} from "@/types";
import {
  generateId,
  parseDate,
  parseJson,
  toBool,
  toNumber,
} from "@/lib/services/mysql/_helpers";
import type { RowDataPacket } from "mysql2";

type ProductRow = RowDataPacket & {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  category_slug: string;
  price: string | number;
  old_price: string | number | null;
  stock: number;
  images: unknown;
  colors: unknown;
  sizes: unknown;
  is_featured: number;
  is_new: number;
  status: "active" | "passive";
  created_at: string;
  updated_at: string;
};

function rowToProduct(row: ProductRow): AdminProduct {
  return {
    id: row.id,
    sku: row.sku,
    slug: row.slug,
    name: row.name,
    description: row.description,
    category: row.category_slug as ProductCategorySlug,
    price: toNumber(row.price),
    oldPrice: row.old_price != null ? toNumber(row.old_price) : undefined,
    stock: toNumber(row.stock),
    images: parseJson<string[]>(row.images, []),
    colors: parseJson<ProductColor[]>(row.colors, []),
    sizes: parseJson<string[]>(row.sizes, []),
    isFeatured: toBool(row.is_featured),
    isNew: toBool(row.is_new),
    status: row.status,
    createdAt: parseDate(row.created_at),
    updatedAt: parseDate(row.updated_at),
  };
}

const SELECT_COLS = `
  id, sku, slug, name, description, category_slug, price, old_price,
  stock, images, colors, sizes, is_featured, is_new, status,
  created_at, updated_at
`;

export const mysqlProductService: ProductService = {
  async list() {
    const db = getDb();
    const [rows] = await db.execute<ProductRow[]>(
      `SELECT ${SELECT_COLS} FROM products ORDER BY created_at DESC`
    );
    return rows.map(rowToProduct);
  },

  async getById(id) {
    const db = getDb();
    const [rows] = await db.execute<ProductRow[]>(
      `SELECT ${SELECT_COLS} FROM products WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] ? rowToProduct(rows[0]) : null;
  },

  async create(input: AdminProductInput) {
    const db = getDb();
    const id = generateId("p");
    const sku = `MB-${id.toUpperCase().slice(0, 12)}`;

    await db.execute(
      `INSERT INTO products
        (id, sku, slug, name, description, category_slug, price, old_price,
         stock, images, colors, sizes, is_featured, is_new, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CAST(? AS JSON), CAST(? AS JSON),
               CAST(? AS JSON), ?, ?, ?)`,
      [
        id,
        sku,
        input.slug,
        input.name,
        input.description,
        input.category,
        input.price,
        input.oldPrice ?? null,
        input.stock,
        JSON.stringify(input.images ?? []),
        JSON.stringify(input.colors ?? []),
        JSON.stringify(input.sizes ?? []),
        input.isFeatured ? 1 : 0,
        input.isNew ? 1 : 0,
        input.status,
      ]
    );

    const created = await mysqlProductService.getById(id);
    if (!created) throw new Error("Urun olusturulamadi.");
    return created;
  },

  async update(id, input) {
    const db = getDb();
    const existing = await mysqlProductService.getById(id);
    if (!existing) return null;

    await db.execute(
      `UPDATE products SET
         slug = ?, name = ?, description = ?, category_slug = ?,
         price = ?, old_price = ?, stock = ?,
         images = CAST(? AS JSON), colors = CAST(? AS JSON), sizes = CAST(? AS JSON),
         is_featured = ?, is_new = ?, status = ?
       WHERE id = ?`,
      [
        input.slug,
        input.name,
        input.description,
        input.category,
        input.price,
        input.oldPrice ?? null,
        input.stock,
        JSON.stringify(input.images ?? []),
        JSON.stringify(input.colors ?? []),
        JSON.stringify(input.sizes ?? []),
        input.isFeatured ? 1 : 0,
        input.isNew ? 1 : 0,
        input.status,
        id,
      ]
    );

    // Kaldirilan gorselleri diskten sil
    const removedImages = (existing.images ?? []).filter(
      (url) => !(input.images ?? []).includes(url)
    );
    if (removedImages.length > 0) {
      void deleteUploadedFiles(removedImages);
    }

    return mysqlProductService.getById(id);
  },

  async remove(id) {
    const db = getDb();
    const existing = await mysqlProductService.getById(id);
    if (!existing) return false;

    await db.execute(`DELETE FROM products WHERE id = ?`, [id]);

    // Tum gorselleri diskten sil
    if (existing.images?.length) {
      void deleteUploadedFiles(existing.images);
    }

    return true;
  },
};
