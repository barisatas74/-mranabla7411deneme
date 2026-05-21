-- ============================================================================
-- Miss Bella — Sipariş İptal Bilgileri Migration
-- ============================================================================
-- Bu SQL'i phpMyAdmin'de `missbell_miss` veritabaninda calistir.
-- Idempotent: tekrar calistirilirsa hata vermez.
-- ============================================================================

-- cancellation_reason kolonu (iptal nedeni — admin paneli yazar)
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'orders'
    AND COLUMN_NAME  = 'cancellation_reason'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `orders` ADD COLUMN `cancellation_reason` TEXT NULL AFTER `note`',
  'SELECT "cancellation_reason zaten mevcut" AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- cancelled_at kolonu (iptal tarihi)
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'orders'
    AND COLUMN_NAME  = 'cancelled_at'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `orders` ADD COLUMN `cancelled_at` DATETIME NULL AFTER `cancellation_reason`',
  'SELECT "cancelled_at zaten mevcut" AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
