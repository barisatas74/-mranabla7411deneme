-- ============================================================================
-- Miss Bella — Kargo takip alanlari migration
-- ============================================================================
-- Bu SQL'i phpMyAdmin'de `missbell_miss` veritabaninda calistir.
-- Mevcut siparis verilerini etkilemez.
-- Idempotent: zaten ekliyse hata vermez.
-- ============================================================================

-- tracking_number
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'orders'
    AND COLUMN_NAME  = 'tracking_number'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `orders` ADD COLUMN `tracking_number` VARCHAR(120) NULL AFTER `note`',
  'SELECT "tracking_number zaten mevcut" AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- tracking_carrier
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'orders'
    AND COLUMN_NAME  = 'tracking_carrier'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `orders` ADD COLUMN `tracking_carrier` VARCHAR(80) NULL AFTER `tracking_number`',
  'SELECT "tracking_carrier zaten mevcut" AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- tracking_url
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'orders'
    AND COLUMN_NAME  = 'tracking_url'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `orders` ADD COLUMN `tracking_url` VARCHAR(500) NULL AFTER `tracking_carrier`',
  'SELECT "tracking_url zaten mevcut" AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
