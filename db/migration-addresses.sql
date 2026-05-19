-- ============================================================================
-- Miss Bella — Adres Defteri Migration
-- ============================================================================
-- Bu SQL'i phpMyAdmin'de `missbell_miss` veritabaninda calistir.
-- Idempotent: tekrar calistirilirsa hata vermez.
-- ============================================================================

CREATE TABLE IF NOT EXISTS `user_addresses` (
  `id`           VARCHAR(64)  NOT NULL,
  `user_id`      VARCHAR(64)  NOT NULL,
  `label`        VARCHAR(60)  NOT NULL,
  `full_name`    VARCHAR(180) NOT NULL,
  `phone`        VARCHAR(40)  NOT NULL,
  `city`         VARCHAR(80)  NOT NULL,
  `district`     VARCHAR(120) NOT NULL,
  `address`      TEXT         NOT NULL,
  `is_default`   TINYINT(1)   NOT NULL DEFAULT 0,
  `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_addr_user` (`user_id`),
  CONSTRAINT `fk_addr_user`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
