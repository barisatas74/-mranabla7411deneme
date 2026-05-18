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
        (id, order_number,
         customer_first_name, customer_last_name, customer_email, customer_phone,
         customer_city, customer_district, customer_address,
         subtotal, shipping_fee, discount, total, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        orderNumber,
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
    }

    const created = await mysqlOrderService.getById(id);
    if (!created) {
      throw new Error("Siparis olusturuldu fakat okunamadi.");
    }
    return created;
  },

  async updateStatus(id, input) {
    const db = getDb();
    const [result] = await db.execute(
      `UPDATE orders SET status = ?, payment_status = ?, shipping_status = ?
       WHERE id = ?`,
      [input.status, input.paymentStatus, input.shippingStatus, id]
    );

    const affected = (result as { affectedRows?: number }).affectedRows ?? 0;
    if (affected === 0) return null;
    return mysqlOrderService.getById(id);
  },
};
