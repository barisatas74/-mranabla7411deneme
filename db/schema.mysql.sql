-- =============================================================================
-- Miss Bella — MySQL / MariaDB seması
-- Hedef: MySQL 8.0+ veya MariaDB 10.5+
-- Karakter seti: utf8mb4 (Türkçe karakterler ve emoji destegi)
-- =============================================================================
--
-- Kurulum:
--   1) Hosting panelinden (cPanel/Plesk) yeni bir veritabani olusturun.
--      Ornek isim: missbella  (yada hostingin verdigi isim)
--   2) Bu dosyayi phpMyAdmin -> Import sekmesinden yukleyin.
--   3) .env dosyasinda DB_TYPE=mysql ve DB_HOST/DB_USER/... degerlerini doldurun.
--
-- Not: Tablo yapilari Next.js app icindeki TypeScript tipleriyle (types/index.ts)
-- birebir eslesir. Liste alanlari (images / sizes / colors) JSON kolonu
-- olarak tutulur — tek sorguyla okunur, ek tablo gerekmez.
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1) Kategoriler
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id`           VARCHAR(64)   NOT NULL,
  `slug`         VARCHAR(120)  NOT NULL,
  `name`         VARCHAR(180)  NOT NULL,
  `tagline`      VARCHAR(255)  NULL,
  `description`  TEXT          NULL,
  `image`        VARCHAR(500)  NULL,
  `status`       ENUM('active','passive') NOT NULL DEFAULT 'active',
  `created_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_categories_slug` (`slug`),
  KEY `idx_categories_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2) Urunler
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id`            VARCHAR(64)   NOT NULL,
  `sku`           VARCHAR(64)   NOT NULL,
  `slug`          VARCHAR(180)  NOT NULL,
  `name`          VARCHAR(255)  NOT NULL,
  `description`   TEXT          NOT NULL,
  `category_slug` VARCHAR(120)  NOT NULL,
  `price`         DECIMAL(10,2) NOT NULL,
  `old_price`     DECIMAL(10,2) NULL,
  `stock`         INT UNSIGNED  NOT NULL DEFAULT 0,
  `images`        JSON          NOT NULL,    -- ["/uploads/products/x.webp", ...]
  `colors`        JSON          NOT NULL,    -- [{ "name": "Pudra", "hex": "#ff..." }, ...]
  `sizes`         JSON          NOT NULL,    -- ["S", "M", "L"]
  `is_featured`   TINYINT(1)    NOT NULL DEFAULT 0,
  `is_new`        TINYINT(1)    NOT NULL DEFAULT 0,
  `status`        ENUM('active','passive') NOT NULL DEFAULT 'active',
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_products_slug` (`slug`),
  UNIQUE KEY `uniq_products_sku` (`sku`),
  KEY `idx_products_category` (`category_slug`),
  KEY `idx_products_status` (`status`),
  KEY `idx_products_featured` (`is_featured`),
  KEY `idx_products_new` (`is_new`),
  CONSTRAINT `fk_products_category`
    FOREIGN KEY (`category_slug`) REFERENCES `categories`(`slug`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3) Siparisler
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id`               VARCHAR(64)   NOT NULL,
  `order_number`     VARCHAR(32)   NOT NULL,
  `status`           ENUM('beklemede','hazirlaniyor','kargoya-verildi','tamamlandi','iptal-edildi')
                     NOT NULL DEFAULT 'beklemede',
  `payment_status`   ENUM('bekleniyor','odendi','iade-edildi')
                     NOT NULL DEFAULT 'bekleniyor',
  `shipping_status`  ENUM('hazirlaniyor','paketlendi','yolda','teslim-edildi')
                     NOT NULL DEFAULT 'hazirlaniyor',
  -- Musteri bilgileri (siparise embed)
  `customer_first_name` VARCHAR(120) NOT NULL,
  `customer_last_name`  VARCHAR(120) NOT NULL,
  `customer_email`      VARCHAR(180) NOT NULL,
  `customer_phone`      VARCHAR(40)  NOT NULL,
  `customer_city`       VARCHAR(120) NOT NULL,
  `customer_district`   VARCHAR(120) NOT NULL,
  `customer_address`    TEXT         NOT NULL,
  -- Tutarlar
  `subtotal`         DECIMAL(10,2) NOT NULL,
  `shipping_fee`     DECIMAL(10,2) NOT NULL DEFAULT 0,
  `discount`         DECIMAL(10,2) NOT NULL DEFAULT 0,
  `total`            DECIMAL(10,2) NOT NULL,
  `note`             TEXT          NULL,
  `tracking_number`  VARCHAR(120)  NULL,
  `tracking_carrier` VARCHAR(80)   NULL,
  `tracking_url`     VARCHAR(500)  NULL,
  `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_orders_order_number` (`order_number`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_payment_status` (`payment_status`),
  KEY `idx_orders_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4) Siparis kalemleri
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id`            VARCHAR(64)   NOT NULL,
  `order_id`      VARCHAR(64)   NOT NULL,
  `product_id`    VARCHAR(64)   NULL,         -- urun silinmis olabilir → NULL'a duser
  `product_name`  VARCHAR(255)  NOT NULL,
  `product_slug`  VARCHAR(180)  NOT NULL,
  `image`         VARCHAR(500)  NULL,
  `unit_price`    DECIMAL(10,2) NOT NULL,
  `quantity`      INT UNSIGNED  NOT NULL DEFAULT 1,
  `color`         VARCHAR(80)   NULL,
  `size`          VARCHAR(40)   NULL,
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order` (`order_id`),
  KEY `idx_order_items_product` (`product_id`),
  CONSTRAINT `fk_order_items_order`
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_product`
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5) Site ayarlari (tek satirli singleton tablo)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id`                    TINYINT       NOT NULL DEFAULT 1,
  `store_name`            VARCHAR(180)  NOT NULL DEFAULT 'Miss Bella',
  `support_email`         VARCHAR(180)  NULL,
  `support_phone`         VARCHAR(40)   NULL,
  `whatsapp_number`       VARCHAR(40)   NULL,
  `address`               VARCHAR(500)  NULL,
  `free_shipping_limit`   DECIMAL(10,2) NOT NULL DEFAULT 300.00,
  `tax_rate`              DECIMAL(5,2)  NOT NULL DEFAULT 20.00,
  `instagram_url`         VARCHAR(255)  NULL,
  `cargo_lead_time`       VARCHAR(100)  NULL DEFAULT '1-3 is gunu',
  `maintenance_mode`      TINYINT(1)    NOT NULL DEFAULT 0,
  `updated_at`            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_settings_singleton` CHECK (`id` = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6) Bulten abonelikleri (opsiyonel — footer formu icin)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `newsletter_subscribers`;
CREATE TABLE `newsletter_subscribers` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email`        VARCHAR(180) NOT NULL,
  `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `unsubscribed_at` DATETIME  NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_newsletter_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7) Iletisim formu mesajlari (opsiyonel)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name`    VARCHAR(180) NOT NULL,
  `email`        VARCHAR(180) NOT NULL,
  `phone`        VARCHAR(40)  NULL,
  `subject`      VARCHAR(180) NULL,
  `message`      TEXT         NOT NULL,
  `is_read`      TINYINT(1)   NOT NULL DEFAULT 0,
  `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contact_messages_read` (`is_read`),
  KEY `idx_contact_messages_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- Baslangic Verisi
-- =============================================================================

-- Varsayilan kategoriler
INSERT INTO `categories` (`id`, `slug`, `name`, `tagline`, `description`, `image`, `status`) VALUES
  ('cat-1', 'sutyenler',       'Sutyenler',       'Konfor ve zarafet',          'Pudra tonlarinda zarafet hissi.',                NULL, 'active'),
  ('cat-2', 'kulotlar',        'Kulotlar',        'Hijyen ve nefes alabilen kumas','Gunluk kullanima uygun butik secimler.',         NULL, 'active'),
  ('cat-3', 'takimlar',        'Takimlar',        'Sutyen + kulot uyumu',       'Kombinli iki parca takimlar.',                   NULL, 'active'),
  ('cat-4', 'gecelikler',      'Gecelikler',      'Saten dokunus',              'Salon ve uyku icin sik secimler.',               NULL, 'active'),
  ('cat-5', 'sortlu-takimlar', 'Sortlu Takimlar', 'Yazlik ve serin',            'Yazlik konfor takimlari.',                       NULL, 'active'),
  ('cat-6', 'spor',            'Spor',            'Fonksiyon ve tasarim',       'Aktif yasam icin destekli secimler.',            NULL, 'active');

-- Varsayilan ayar satiri (singleton)
INSERT INTO `settings` (
  `id`, `store_name`, `support_email`, `support_phone`, `whatsapp_number`,
  `address`, `free_shipping_limit`, `tax_rate`, `instagram_url`,
  `cargo_lead_time`, `maintenance_mode`
) VALUES (
  1,
  'Miss Bella',
  NULL,
  '0530 990 71 63',
  '905309907163',
  'Esref Dincer Mah., Eski Pazar Cd. No: 20/A, 16600 Gemlik / Bursa',
  300.00,
  20.00,
  NULL,
  '1-3 is gunu',
  0
);

-- =============================================================================
-- Kullanici (uyelik) tablosu
-- =============================================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id`            VARCHAR(64)  NOT NULL,
  `email`         VARCHAR(180) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name`    VARCHAR(120) NOT NULL,
  `last_name`     VARCHAR(120) NOT NULL,
  `phone`         VARCHAR(40)  NULL,
  `status`        ENUM('active','suspended') NOT NULL DEFAULT 'active',
  `admin_note`    TEXT         NULL,
  `customer_tags` TEXT         NULL,
  `loyalty_points` INT         NOT NULL DEFAULT 0,
  `private_coupon_code` VARCHAR(60) NULL,
  `private_coupon_rate` DECIMAL(5,2) NULL,
  `last_login_at` DATETIME     NULL,
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- orders.user_id (guest siparisler icin NULL)
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'orders'
    AND COLUMN_NAME  = 'user_id'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `orders` ADD COLUMN `user_id` VARCHAR(64) NULL AFTER `id`, ADD KEY `idx_orders_user` (`user_id`)',
  'SELECT "user_id zaten mevcut" AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =============================================================================
-- Kullanici / Yetki notu
-- =============================================================================
-- Eger MySQL 8.x kullaniyorsaniz ve "caching_sha2_password" sebebiyle Node tarafi
-- baglanamiyorsa, hosting panelinden DB kullanicinizin sifre eklentisini
-- "mysql_native_password" yapin veya .env'de DB_SSL=true deneyin.
-- =============================================================================
