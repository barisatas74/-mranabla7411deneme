import "server-only";
import { OrderService } from "@/lib/services/contracts";
import { getDb } from "@/lib/db";
import {
  AdminOrder,
  AdminOrderItem,
  CreateOrderInput,
  OrderStatus,
  PaymentStatus,
  ShippingStatus,
} from "@/types";
import {
  generateId,
  generateOrderNumber,
  parseDate,
  toNumber,
} from "@/lib/services/mysql/_helpers";
import type { RowDataPacket } from "mysql2";

type OrderRow = RowDataPacket & {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  shipping_status: ShippingStatus;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  customer_city: string;
  customer_district: string;
  customer_address: string;
  subtotal: string | number;
  shipping_fee: string | number;
  discount: string | number;
  total: string | number;
  note: string | null;
  tracking_number: string | null;
  tracking_carrier: string | null;
  tracking_url: string | null;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
};

type ItemRow = RowDataPacket & {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_slug: string;
  image: string | null;
  unit_price: string | number;
  quantity: number;
  color: string | null;
  size: string | null;
};

function rowToOrder(row: OrderRow, items: AdminOrderItem[]): AdminOrder {
  return {
    id: row.id,
    orderNumber: row.order_number,
    createdAt: parseDate(row.created_at),
    status: row.status,
    paymentStatus: row.payment_status,
    shippingStatus: row.shipping_status,
    customer: {
      firstName: row.customer_first_name,
      lastName: row.customer_last_name,
      email: row.customer_email,
      phone: row.customer_phone,
      city: row.customer_city,
      district: row.customer_district,
      address: row.customer_address,
    },
    items,
    subtotal: toNumber(row.subtotal),
    shippingFee: toNumber(row.shipping_fee),
    discount: toNumber(row.discount),
    total: toNumber(row.total),
    note: row.note ?? undefined,
    trackingNumber: row.tracking_number ?? undefined,
    trackingCarrier: row.tracking_carrier ?? undefined,
    trackingUrl: row.tracking_url ?? undefined,
    cancellationReason: row.cancellation_reason ?? undefined,
    cancelledAt: row.cancelled_at ? parseDate(row.cancelled_at) : undefined,
  };
}

function rowToItem(row: ItemRow): AdminOrderItem {
  return {
    id: row.id,
    productId: row.product_id ?? "",
    productName: row.product_name,
    productSlug: row.product_slug,
    image: row.image ?? "",
    unitPrice: toNumber(row.unit_price),
    quantity: toNumber(row.quantity),
    color: row.color ?? "",
    size: row.size ?? "",
  };
}

export const mysqlOrderService: OrderService = {
  async list() {
    const db = getDb();
    const [orderRows] = await db.execute<OrderRow[]>(
      `SELECT * FROM orders ORDER BY created_at DESC`
    );
    if (orderRows.length === 0) return [];

    const ids = orderRows.map((row) => row.id);
    const placeholders = ids.map(() => "?").join(",");
    const [itemRows] = await db.execute<ItemRow[]>(
      `SELECT * FROM order_items WHERE order_id IN (${placeholders})`,
      ids
    );

    const itemsByOrder = new Map<string, AdminOrderItem[]>();
    for (const item of itemRows) {
      const list = itemsByOrder.get(item.order_id) ?? [];
      list.push(rowToItem(item));
      itemsByOrder.set(item.order_id, list);
    }

    return orderRows.map((row) =>
      rowToOrder(row, itemsByOrder.get(row.id) ?? [])
    );
  },

  async getById(id) {
    const db = getDb();
    const [rows] = await db.execute<OrderRow[]>(
      `SELECT * FROM orders WHERE id = ? LIMIT 1`,
      [id]
    );
    if (!rows[0]) return null;

    const [itemRows] = await db.execute<ItemRow[]>(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [id]
    );

    return rowToOrder(rows[0], itemRows.map(rowToItem));
  },

  async create(input: CreateOrderInput) {
    const db = getDb();
    const id = generateId("o");
    const orderNumber = generateOrderNumber();

    await db.execute(
      `INSERT INTO orders
        (id, order_number, user_id,
         customer_first_name, customer_last_name, customer_email, customer_phone,
         customer_city, customer_district, customer_address,
         subtotal, shipping_fee, discount, total, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        orderNumber,
        input.userId ?? null,
        input.customer.firstName,
        input.customer.lastName,
        input.customer.email,
        input.customer.phone,
        input.customer.city,
        input.customer.district,
        input.customer.address,
        input.subtotal,
        input.shippingFee,
        input.discount,
        input.total,
        input.note ?? null,
      ]
    );

    for (const item of input.items) {
      const itemId = generateId("oi");
      await db.execute(
        `INSERT INTO order_items
          (id, order_id, product_id, product_name, product_slug,
           image, unit_price, quantity, color, size)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          itemId,
          id,
          item.productId || null,
          item.productName,
          item.productSlug,
          item.image || null,
          item.unitPrice,
          item.quantity,
          item.color || null,
          item.size || null,
        ]
      );

      // Stok düşür (stok eksiye düşmesin)
      if (item.productId) {
        await db.execute(
          `UPDATE products
           SET stock = GREATEST(stock - ?, 0)
           WHERE id = ?`,
          [item.quantity, item.productId]
        );
      }
    }

    const created = await mysqlOrderService.getById(id);
    if (!created) {
      throw new Error("Siparis olusturuldu fakat okunamadi.");
    }
    return created;
  },

  async updateStatus(id, input) {
    const db = getDb();

    // Mevcut siparisi al — durum gecisini kontrol etmek icin
    const existing = await mysqlOrderService.getById(id);
    if (!existing) return null;

    const wasCancelled = existing.status === "iptal-edildi";
    const willBeCancelled = input.status === "iptal-edildi";

    const [result] = await db.execute(
      `UPDATE orders
         SET status = ?, payment_status = ?, shipping_status = ?,
             tracking_number = ?, tracking_carrier = ?, tracking_url = ?
       WHERE id = ?`,
      [
        input.status,
        input.paymentStatus,
        input.shippingStatus,
        input.trackingNumber?.trim() || null,
        input.trackingCarrier?.trim() || null,
        input.trackingUrl?.trim() || null,
        id,
      ]
    );

    const affected = (result as { affectedRows?: number }).affectedRows ?? 0;
    if (affected === 0) return null;

    // Stok ayarlamasi
    if (!wasCancelled && willBeCancelled) {
      // Iptal edildi → stoklari geri yukle
      for (const item of existing.items) {
        if (item.productId) {
          await db.execute(
            `UPDATE products SET stock = stock + ? WHERE id = ?`,
            [item.quantity, item.productId]
          );
        }
      }
    } else if (wasCancelled && !willBeCancelled) {
      // Iptal geri alindi → stoklari tekrar dus
      for (const item of existing.items) {
        if (item.productId) {
          await db.execute(
            `UPDATE products SET stock = GREATEST(stock - ?, 0) WHERE id = ?`,
            [item.quantity, item.productId]
          );
        }
      }
    }

    return mysqlOrderService.getById(id);
  },

  async cancel(id, reason) {
    const db = getDb();

    const existing = await mysqlOrderService.getById(id);
    if (!existing) return null;

    // Zaten iptal edilmişse — sadece sebebi güncelle, stok dokunma
    if (existing.status === "iptal-edildi") {
      await db.execute(
        `UPDATE orders
           SET cancellation_reason = ?,
               cancelled_at = COALESCE(cancelled_at, NOW())
         WHERE id = ?`,
        [reason.trim() || null, id]
      );
      return mysqlOrderService.getById(id);
    }

    // Status'u iptal'e çek + sebep + tarih
    const [result] = await db.execute(
      `UPDATE orders
         SET status = 'iptal-edildi',
             cancellation_reason = ?,
             cancelled_at = NOW()
       WHERE id = ?`,
      [reason.trim() || null, id]
    );

    const affected = (result as { affectedRows?: number }).affectedRows ?? 0;
    if (affected === 0) return null;

    // Stokları geri yükle
    for (const item of existing.items) {
      if (item.productId) {
        await db.execute(
          `UPDATE products SET stock = stock + ? WHERE id = ?`,
          [item.quantity, item.productId]
        );
      }
    }

    return mysqlOrderService.getById(id);
  },
};
