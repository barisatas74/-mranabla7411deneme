-- Miss Bella kupon altyapisi
-- Mevcut verileri etkilemeden coupons tablosunu ekler.

CREATE TABLE IF NOT EXISTS `coupons` (
  `id`               VARCHAR(64)   NOT NULL,
  `code`             VARCHAR(60)   NOT NULL,
  `discount_rate`    DECIMAL(5,2)  NOT NULL,
  `status`           ENUM('active','passive') NOT NULL DEFAULT 'active',
  `assigned_user_id` VARCHAR(64)   NULL,
  `usage_limit`      INT UNSIGNED  NULL,
  `used_count`       INT UNSIGNED  NOT NULL DEFAULT 0,
  `expires_at`       DATETIME      NULL,
  `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_coupons_code` (`code`),
  KEY `idx_coupons_status` (`status`),
  KEY `idx_coupons_assigned_user` (`assigned_user_id`),
  KEY `idx_coupons_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `coupons`
  (`id`, `code`, `discount_rate`, `status`, `assigned_user_id`, `usage_limit`, `expires_at`)
VALUES
  ('c-default-rosa30', 'ROSA30', 30.00, 'active', NULL, NULL, NULL);
