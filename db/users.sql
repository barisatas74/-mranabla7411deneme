-- ============================================================================
-- Miss Bella — Kullanici (uyelik) tablosu
-- ============================================================================
-- Bu SQL'i phpMyAdmin'de `missbell_miss` veritabaninda calistir.
-- Mevcut verileri etkilemez. Tum guest siparisler korunur.

-- ----------------------------------------------------------------------------
-- users tablosu
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`              VARCHAR(64)   NOT NULL,
  `email`           VARCHAR(180)  NOT NULL,
  `password_hash`   VARCHAR(255)  NOT NULL,
  `first_name`      VARCHAR(120)  NOT NULL,
  `last_name`       VARCHAR(120)  NOT NULL,
  `phone`           VARCHAR(40)   NULL,
  `status`          ENUM('active','suspended') NOT NULL DEFAULT 'active',
  `admin_note`      TEXT          NULL,
  `customer_tags`   TEXT          NULL,
  `loyalty_points`  INT           NOT NULL DEFAULT 0,
  `private_coupon_code` VARCHAR(60) NULL,
  `private_coupon_rate` DECIMAL(5,2) NULL,
  `last_login_at`   DATETIME      NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- orders tablosuna user_id kolonu (opsiyonel — guest siparisler NULL)
-- ----------------------------------------------------------------------------
-- Once kolonu var mi diye kontrol et (hata vermesin diye)
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'orders'
    AND COLUMN_NAME = 'user_id'
);

SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `orders` ADD COLUMN `user_id` VARCHAR(64) NULL AFTER `id`, ADD KEY `idx_orders_user` (`user_id`)',
  'SELECT "user_id zaten mevcut" AS info'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
