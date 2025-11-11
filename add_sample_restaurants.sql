-- إضافة مطاعم تجريبية لقاعدة البيانات
USE `eat_to_eat`;

-- إضافة مستخدمين لأصحاب المطاعم
INSERT INTO `users` (`name`, `email`, `password`, `role`, `phone`, `address`, `latitude`, `longitude`, `is_active`, `created_at`, `updated_at`) VALUES
('أحمد المطعم', 'restaurant1@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'restaurant', '+212612345678', 'شارع محمد الخامس، الدار البيضاء، المغرب', 33.5731, -7.5898, 1, NOW(), NOW()),
('فاطمة المطعم', 'restaurant2@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'restaurant', '+212612345679', 'شارع الحسن الثاني، الرباط، المغرب', 34.0209, -6.8416, 1, NOW(), NOW()),
('محمد المطعم', 'restaurant3@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'restaurant', '+212612345680', 'شارع علال الفاسي، مراكش، المغرب', 31.6295, -7.9811, 1, NOW(), NOW());

-- إضافة المطاعم
INSERT INTO `restaurants` (`user_id`, `name`, `description`, `address`, `latitude`, `longitude`, `phone`, `email`, `opening_time`, `closing_time`, `delivery_fee`, `delivery_radius`, `rating`, `total_reviews`, `is_active`, `is_open`, `created_at`, `updated_at`) VALUES
((SELECT id FROM users WHERE email = 'restaurant1@test.com'), 'مطعم الأصالة', 'مطعم يقدم أشهى الأطباق العربية التقليدية', 'شارع محمد الخامس، الدار البيضاء، المغرب', 33.5731, -7.5898, '+212612345678', 'info@alasala.com', '09:00', '23:00', 15.00, 10, 4.5, 120, 1, 1, NOW(), NOW()),
((SELECT id FROM users WHERE email = 'restaurant2@test.com'), 'مطعم البيتزا الإيطالية', 'أفضل البيتزا الإيطالية الأصيلة', 'شارع الحسن الثاني، الرباط، المغرب', 34.0209, -6.8416, '+212612345679', 'info@italianpizza.com', '10:00', '24:00', 20.00, 8, 4.7, 85, 1, 1, NOW(), NOW()),
((SELECT id FROM users WHERE email = 'restaurant3@test.com'), 'مطعم السوشي الياباني', 'سوشي طازج ومأكولات يابانية أصيلة', 'شارع علال الفاسي، مراكش، المغرب', 31.6295, -7.9811, '+212612345680', 'info@sushijapan.com', '11:00', '23:00', 25.00, 12, 4.8, 95, 1, 1, NOW(), NOW());

