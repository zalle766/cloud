-- =====================================================
-- قاعدة بيانات مبسطة لتطبيق Eat to Eat
-- بدون إنشاء المستخدمين والصلاحيات
-- =====================================================

-- استخدام قاعدة البيانات الموجودة
USE `eattoeat`;

-- =====================================================
-- حذف الجداول الموجودة (إن وجدت)
-- =====================================================

DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `couriers`;
DROP TABLE IF EXISTS `restaurants`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `personal_access_tokens`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `failed_jobs`;
DROP TABLE IF EXISTS `cache`;
DROP TABLE IF EXISTS `cache_locks`;
DROP TABLE IF EXISTS `sessions`;

-- =====================================================
-- إنشاء الجداول الأساسية
-- =====================================================

-- جدول المستخدمين
CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','restaurant','courier','customer') NOT NULL DEFAULT 'customer',
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `users_email_index` (`email`),
  KEY `users_role_index` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول المطاعم
CREATE TABLE `restaurants` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `address` text NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `opening_time` time DEFAULT NULL,
  `closing_time` time DEFAULT NULL,
  `delivery_fee` decimal(8,2) NOT NULL DEFAULT 0.00,
  `delivery_radius` int(11) NOT NULL DEFAULT 5,
  `minimum_order` decimal(8,2) DEFAULT 0.00,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `total_reviews` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_open` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `restaurants_user_id_foreign` (`user_id`),
  KEY `restaurants_is_active_index` (`is_active`),
  KEY `restaurants_is_open_index` (`is_open`),
  CONSTRAINT `restaurants_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول المنتجات
CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `restaurant_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(8,2) NOT NULL,
  `category` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `preparation_time` int(11) NOT NULL DEFAULT 15,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `products_restaurant_id_foreign` (`restaurant_id`),
  KEY `products_category_index` (`category`),
  KEY `products_is_available_index` (`is_available`),
  CONSTRAINT `products_restaurant_id_foreign` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول السائقين
CREATE TABLE `couriers` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `vehicle_type` enum('bike','motorcycle','car') NOT NULL DEFAULT 'bike',
  `license_number` varchar(100) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 0,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `total_deliveries` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `couriers_user_id_foreign` (`user_id`),
  KEY `couriers_is_available_index` (`is_available`),
  CONSTRAINT `couriers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول الطلبات
CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `restaurant_id` bigint(20) UNSIGNED NOT NULL,
  `courier_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_number` varchar(50) NOT NULL UNIQUE,
  `status` enum('pending','confirmed','preparing','ready','picked_up','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `subtotal` decimal(8,2) NOT NULL,
  `delivery_fee` decimal(8,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(8,2) NOT NULL DEFAULT 0.00,
  `total` decimal(8,2) NOT NULL,
  `delivery_address` text NOT NULL,
  `delivery_latitude` decimal(10,8) DEFAULT NULL,
  `delivery_longitude` decimal(11,8) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `estimated_delivery_time` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_user_id_foreign` (`user_id`),
  KEY `orders_restaurant_id_foreign` (`restaurant_id`),
  KEY `orders_courier_id_foreign` (`courier_id`),
  KEY `orders_status_index` (`status`),
  KEY `orders_order_number_index` (`order_number`),
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_restaurant_id_foreign` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_courier_id_foreign` FOREIGN KEY (`courier_id`) REFERENCES `couriers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول عناصر الطلبات
CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_product_id_foreign` (`product_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول التقييمات
CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `reviewable_type` varchar(255) NOT NULL,
  `reviewable_id` bigint(20) UNSIGNED NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_user_id_foreign` (`user_id`),
  KEY `reviews_reviewable_type_reviewable_id_index` (`reviewable_type`,`reviewable_id`),
  CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول الإشعارات
CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'info',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `data` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_foreign` (`user_id`),
  KEY `notifications_is_read_index` (`is_read`),
  CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول Laravel Sanctum
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL UNIQUE,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول إعادة تعيين كلمة المرور
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول المهام الفاشلة
CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL UNIQUE,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول الكاش
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL PRIMARY KEY,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول كاش الأقفال
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL PRIMARY KEY,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول الجلسات
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL PRIMARY KEY,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- إدراج البيانات التجريبية
-- =====================================================

-- إدراج المستخدمين
INSERT INTO `users` (`name`, `email`, `password`, `role`, `phone`, `address`, `latitude`, `longitude`, `is_active`, `created_at`, `updated_at`) VALUES
('مدير النظام', 'admin@eattoeat.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '+201234567890', 'مقر الشركة، الرباط', 34.0209, -6.8416, 1, NOW(), NOW()),
('أحمد صاحب المطعم', 'restaurant@eattoeat.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'restaurant', '+201234567891', 'شارع التحرير، الرباط', 34.0209, -6.8416, 1, NOW(), NOW()),
('محمد العميل', 'customer@eattoeat.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '+201234567892', 'مدينة نصر، الرباط', 34.0209, -6.8416, 1, NOW(), NOW()),
('علي السائق', 'courier@eattoeat.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'courier', '+201234567893', 'المعادي، الرباط', 34.0209, -6.8416, 1, NOW(), NOW()),
('فاطمة العميلة', 'fatima@eattoeat.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '+201234567894', 'الزمالك، الرباط', 34.0209, -6.8416, 1, NOW(), NOW()),
('سارة صاحبة المطعم', 'sara@eattoeat.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'restaurant', '+201234567895', 'المغرب الجديدة، الرباط', 34.0209, -6.8416, 1, NOW(), NOW());

-- إدراج المطاعم
INSERT INTO `restaurants` (`user_id`, `name`, `description`, `address`, `latitude`, `longitude`, `phone`, `email`, `opening_time`, `closing_time`, `delivery_fee`, `delivery_radius`, `minimum_order`, `rating`, `total_reviews`, `is_open`, `is_active`, `created_at`, `updated_at`) VALUES
(2, 'مطعم الأصالة', 'مطعم يقدم أشهى الأطباق العربية التقليدية مع أجود أنواع اللحوم والخضار الطازجة', 'شارع التحرير، الرباط', 34.0209, -6.8416, '+201234567891', 'info@alasala.com', '09:00:00', '23:00:00', 15.00, 10, 50.00, 4.50, 120, 1, 1, NOW(), NOW()),
(2, 'مطعم الشرق الأوسط', 'أفضل المأكولات العربية الأصيلة مع أجود أنواع اللحوم والخضار الطازجة', 'شارع التحرير، الرباط', 34.0209, -6.8416, '+201234567891', 'info@middleeast.com', '09:00:00', '23:00:00', 15.00, 10, 50.00, 4.50, 120, 1, 1, NOW(), NOW()),
(6, 'بيتزا إيطاليا', 'أشهى البيتزا الإيطالية الأصيلة مع العجين المخمر والجبن المستورد', 'شارع النيل، الرباط', 34.0209, -6.8416, '+201234567892', 'info@pizzaitalia.com', '10:00:00', '24:00:00', 20.00, 8, 80.00, 4.20, 95, 1, 1, NOW(), NOW()),
(6, 'برجر هاوس', 'ألذ البرجرز والوجبات السريعة مع اللحوم الطازجة والصلصات المميزة', 'مدينة نصر، الرباط', 34.0209, -6.8416, '+201234567893', 'info@burgerhouse.com', '11:00:00', '02:00:00', 12.00, 8, 40.00, 4.30, 80, 1, 1, NOW(), NOW()),
(2, 'مطعم الصين الذهبية', 'أشهى الأطباق الصينية الأصيلة مع التوابل الطبيعية', 'شارع الهرم، الجيزة', 30.0131, 31.2089, '+201234567894', 'info@goldenchina.com', '12:00:00', '23:00:00', 18.00, 12, 60.00, 4.40, 75, 1, 1, NOW(), NOW()),
(6, 'كافيه الحلويات', 'أجمل الحلويات الشرقية والغربية مع القهوة المميزة', 'شارع المعز، الرباط القديمة', 34.0209, -6.8416, '+201234567895', 'info@sweetscafe.com', '08:00:00', '22:00:00', 10.00, 5, 30.00, 4.60, 200, 1, 1, NOW(), NOW()),
(2, 'مطعم البحار', 'أطيب المأكولات البحرية الطازجة من البحر المتوسط', 'كورنيش النيل، الرباط', 34.0209, -6.8416, '+201234567896', 'info@seafood.com', '13:00:00', '23:00:00', 25.00, 15, 100.00, 4.70, 150, 1, 1, NOW(), NOW()),
(6, 'مطعم السوشي الياباني', 'سوشي طازج ومأكولات يابانية أصيلة', 'شارع الهرم، الجيزة', 30.0131, 31.2089, '+201234567897', 'info@sushijapan.com', '11:00:00', '23:00:00', 25.00, 12, 80.00, 4.40, 75, 1, 1, NOW(), NOW());

-- إدراج المنتجات
INSERT INTO `products` (`restaurant_id`, `name`, `description`, `price`, `category`, `preparation_time`, `is_available`, `created_at`, `updated_at`) VALUES
-- منتجات مطعم الأصالة
(1, 'كباب مشوي', 'كباب مشوي طازج مع الأرز والسلطة', 45.00, 'مشويات', 20, 1, NOW(), NOW()),
(1, 'شاورما دجاج', 'شاورما دجاج مع الخضار والصلصة', 35.00, 'ساندويتش', 15, 1, NOW(), NOW()),
(1, 'مشويات مشكلة', 'طبق مشويات متنوعة مع الأرز والسلطة', 80.00, 'مشويات', 25, 1, NOW(), NOW()),
(1, 'كفتة مشوية', 'كفتة مشوية مع الأرز والسلطة', 40.00, 'مشويات', 18, 1, NOW(), NOW()),
(1, 'فراخ مشوية', 'فراخ مشوية كاملة مع الأرز والسلطة', 55.00, 'مشويات', 30, 1, NOW(), NOW()),

-- منتجات مطعم الشرق الأوسط
(2, 'منسف أردني', 'منسف أردني أصيل مع اللحم والأرز', 65.00, 'مأكولات عربية', 25, 1, NOW(), NOW()),
(2, 'كبسة سعودية', 'كبسة سعودية مع الدجاج والأرز', 50.00, 'مأكولات عربية', 20, 1, NOW(), NOW()),
(2, 'مقلوبة فلسطينية', 'مقلوبة فلسطينية مع الدجاج والخضار', 45.00, 'مأكولات عربية', 22, 1, NOW(), NOW()),

-- منتجات بيتزا إيطاليا
(3, 'بيتزا مارغريتا', 'بيتزا بالجبن والطماطم الطازجة', 55.00, 'بيتزا', 18, 1, NOW(), NOW()),
(3, 'بيتزا بيبروني', 'بيتزا بالبيبروني والجبن', 65.00, 'بيتزا', 20, 1, NOW(), NOW()),
(3, 'بيتزا هاواي', 'بيتزا بالأناناس والجبن', 60.00, 'بيتزا', 18, 1, NOW(), NOW()),
(3, 'بيتزا سوبر سوبريم', 'بيتزا بجميع الإضافات', 75.00, 'بيتزا', 22, 1, NOW(), NOW()),

-- منتجات برجر هاوس
(4, 'برجر كلاسيك', 'برجر باللحم مع الخضار والصلصة', 40.00, 'برجر', 12, 1, NOW(), NOW()),
(4, 'برجر دجاج', 'برجر بالدجاج مع الخضار والصلصة', 35.00, 'برجر', 10, 1, NOW(), NOW()),
(4, 'برجر مزدوج', 'برجر مزدوج مع الجبن والخضار', 55.00, 'برجر', 15, 1, NOW(), NOW()),
(4, 'برجر نباتي', 'برجر نباتي مع الخضار الطازجة', 30.00, 'برجر', 8, 1, NOW(), NOW()),

-- منتجات مطعم الصين الذهبية
(5, 'أرز مقلي بالدجاج', 'أرز مقلي بالدجاج والخضار', 35.00, 'مأكولات آسيوية', 15, 1, NOW(), NOW()),
(5, 'نودلز بالجمبري', 'نودلز بالجمبري والخضار', 45.00, 'مأكولات آسيوية', 18, 1, NOW(), NOW()),
(5, 'دجاج بالعسل', 'دجاج بالعسل والخضار', 50.00, 'مأكولات آسيوية', 20, 1, NOW(), NOW()),

-- منتجات كافيه الحلويات
(6, 'كنافة نابلسية', 'كنافة نابلسية بالجبن والقطر', 25.00, 'حلويات', 10, 1, NOW(), NOW()),
(6, 'بسبوسة', 'بسبوسة بالقطر والجوز', 20.00, 'حلويات', 8, 1, NOW(), NOW()),
(6, 'تشيز كيك', 'تشيز كيك بالفراولة', 30.00, 'حلويات', 12, 1, NOW(), NOW()),
(6, 'قهوة تركية', 'قهوة تركية أصيلة', 15.00, 'مشروبات', 5, 1, NOW(), NOW()),

-- منتجات مطعم البحار
(7, 'سمك مشوي', 'سمك مشوي طازج مع الأرز والسلطة', 70.00, 'مأكولات بحرية', 25, 1, NOW(), NOW()),
(7, 'جمبري مشوي', 'جمبري مشوي مع الأرز والسلطة', 60.00, 'مأكولات بحرية', 20, 1, NOW(), NOW()),
(7, 'كابوريا', 'كابوريا بالصلصة الحارة', 55.00, 'مأكولات بحرية', 18, 1, NOW(), NOW()),

-- منتجات مطعم السوشي الياباني
(8, 'سوشي سالمون', 'سوشي سالمون طازج', 75.00, 'سوشي', 15, 1, NOW(), NOW()),
(8, 'سوشي تونة', 'سوشي تونة طازجة', 70.00, 'سوشي', 15, 1, NOW(), NOW()),
(8, 'سوشي رول', 'سوشي رول بالخضار', 45.00, 'سوشي', 12, 1, NOW(), NOW()),
(8, 'رامين', 'شوربة رامين بالدجاج', 40.00, 'مأكولات آسيوية', 18, 1, NOW(), NOW());

-- إدراج السائقين
INSERT INTO `couriers` (`user_id`, `vehicle_type`, `license_number`, `is_available`, `latitude`, `longitude`, `rating`, `total_deliveries`, `created_at`, `updated_at`) VALUES
(4, 'motorcycle', 'MC123456', 1, 34.0209, -6.8416, 4.50, 150, NOW(), NOW());

-- إدراج الطلبات التجريبية
INSERT INTO `orders` (`user_id`, `restaurant_id`, `courier_id`, `order_number`, `status`, `subtotal`, `delivery_fee`, `tax`, `total`, `delivery_address`, `delivery_latitude`, `delivery_longitude`, `notes`, `estimated_delivery_time`, `delivered_at`, `created_at`, `updated_at`) VALUES
(3, 1, 1, 'ORD-001', 'delivered', 80.00, 15.00, 9.50, 104.50, 'مدينة نصر، الرباط', 34.0209, -6.8416, 'بدون بصل', NOW() + INTERVAL 30 MINUTE, NOW() + INTERVAL 35 MINUTE, NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 25 MINUTE),
(5, 3, 1, 'ORD-002', 'delivered', 120.00, 20.00, 14.00, 154.00, 'الزمالك، الرباط', 34.0209, -6.8416, 'بيتزا رقيقة', NOW() + INTERVAL 25 MINUTE, NOW() + INTERVAL 28 MINUTE, NOW() - INTERVAL 45 MINUTE, NOW() - INTERVAL 17 MINUTE),
(3, 4, NULL, 'ORD-003', 'preparing', 95.00, 12.00, 10.70, 117.70, 'مدينة نصر، الرباط', 34.0209, -6.8416, 'برجر بدون خس', NOW() + INTERVAL 20 MINUTE, NULL, NOW() - INTERVAL 10 MINUTE, NOW() - INTERVAL 5 MINUTE);

-- إدراج عناصر الطلبات
INSERT INTO `order_items` (`order_id`, `product_id`, `quantity`, `price`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 45.00, 'بدون بصل', NOW(), NOW()),
(1, 3, 1, 35.00, NULL, NOW(), NOW()),
(2, 9, 1, 55.00, 'بيتزا رقيقة', NOW(), NOW()),
(2, 10, 1, 65.00, NULL, NOW(), NOW()),
(3, 13, 2, 40.00, 'برجر بدون خس', NOW(), NOW()),
(3, 15, 1, 35.00, NULL, NOW(), NOW());

-- إدراج التقييمات
INSERT INTO `reviews` (`user_id`, `reviewable_type`, `reviewable_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(3, 'App\\Models\\Restaurant', 1, 5, 'مطعم رائع والطعام لذيذ جداً', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY),
(5, 'App\\Models\\Restaurant', 3, 4, 'البيتزا ممتازة والتوصيل سريع', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY),
(3, 'App\\Models\\Courier', 1, 5, 'سائق مهذب والتوصيل سريع', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY);

-- إدراج الإشعارات
INSERT INTO `notifications` (`user_id`, `title`, `message`, `type`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 'مرحباً بك في النظام', 'تم إنشاء حسابك بنجاح', 'welcome', 1, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY),
(2, 'مرحباً بك في النظام', 'تم إنشاء حسابك بنجاح', 'welcome', 1, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY),
(3, 'مرحباً بك في النظام', 'تم إنشاء حسابك بنجاح', 'welcome', 1, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY),
(4, 'مرحباً بك في النظام', 'تم إنشاء حسابك بنجاح', 'welcome', 1, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY),
(5, 'مرحباً بك في النظام', 'تم إنشاء حسابك بنجاح', 'welcome', 1, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY),
(6, 'مرحباً بك في النظام', 'تم إنشاء حسابك بنجاح', 'welcome', 1, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY),
(3, 'طلب جديد', 'تم تأكيد طلبك رقم ORD-003', 'order', 0, NOW() - INTERVAL 10 MINUTE, NOW() - INTERVAL 10 MINUTE),
(2, 'طلب جديد', 'طلب جديد من العميل محمد', 'order', 0, NOW() - INTERVAL 10 MINUTE, NOW() - INTERVAL 10 MINUTE);

-- =====================================================
-- إنشاء الفهارس الإضافية
-- =====================================================

-- فهارس للبحث السريع
CREATE INDEX `restaurants_location_index` ON `restaurants` (`latitude`, `longitude`);
CREATE INDEX `products_price_index` ON `products` (`price`);
CREATE INDEX `orders_created_at_index` ON `orders` (`created_at`);
CREATE INDEX `reviews_rating_index` ON `reviews` (`rating`);

-- =====================================================
-- إنهاء قاعدة البيانات
-- =====================================================

-- عرض رسالة النجاح
SELECT 'تم إنشاء قاعدة البيانات بنجاح!' as message;
SELECT 'تم إدراج البيانات التجريبية بنجاح!' as message;
SELECT 'قاعدة البيانات جاهزة للاستخدام!' as message;
