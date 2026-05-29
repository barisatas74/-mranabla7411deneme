/**
 * MySQL / MariaDB baglanti havuzu.
 * .env DB_TYPE=mysql ise gercek baglanti, degilse null doner ve servisler
 * mock'a duser.
 *
 * Kullanim:
 *   const db = getDb();
 *   const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [id]);
 */

import "server-only";
import mysql, { type Pool, type PoolOptions } from "mysql2/promise";

let pool: Pool | null = null;

export function isDbEnabled(): boolean {
  return (
    (process.env.DB_TYPE ?? "").toLowerCase() === "mysql" &&
    Boolean(
      process.env.DB_HOST &&
        process.env.DB_USER &&
        process.env.DB_NAME
    )
  );
}

export function getDb(): Pool {
  if (pool) return pool;
  if (!isDbEnabled()) {
    throw new Error(
      "Veritabani konfigurasyonu eksik. .env dosyasinda DB_TYPE=mysql ve DB_HOST/DB_USER/DB_NAME doldurun."
    );
  }

  const sslEnabled = (process.env.DB_SSL ?? "false").toLowerCase() === "true";

  const options: PoolOptions = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 8000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    timezone: "+03:00",
    dateStrings: true,
    ...(sslEnabled
      ? { ssl: { rejectUnauthorized: false } }
      : {}),
  };

  pool = mysql.createPool(options);
  return pool;
}

/** Test amaciyla baglantiyi kapat (ornek: jest setup) */
export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
