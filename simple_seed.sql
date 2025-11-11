-- بيانات تجريبية أساسية لتطبيق Eat to Eat

-- إدراج المستخدمين
INSERT INTO `users` (`name`, `email`, `password`, `role`, `phone`, `is_active`, `created_at`, `updated_at`) VALUES
('Admin User', 'admin@eattoeat.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '+1234567890', 1, NOW(), NOW()),
('Ahmed Restaurant Owner', 'restaurant@eattoeat.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'restaurant', '+1234567891', 1, NOW(), NOW()),
('Test Customer', 'customer@eattoeat.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '+1234567892', 1, NOW(), NOW());

-- إدراج المطاعم
INSERT INTO `restaurants` (`user_id`, `name`, `description`, `address`, `latitude`, `longitude`, `phone`, `email`, `opening_time`, `closing_time`, `delivery_fee`, `delivery_radius`, `rating`, `total_reviews`, `is_open`, `is_active`, `created_at`, `updated_at`) VALUES
(2, 'مطعم الأصالة', 'مطعم يقدم أشهى الأطباق العربية التقليدية', '123 Main Street, Cairo, Morocco', 34.0209, -6.8416, '+1234567891', 'info@alasala.com', '09:00:00', '23:00:00', 15.00, 10, 4.50, 120, 1, 1, NOW(), NOW()),
(2, 'مطعم البيتزا الإيطالية', 'أفضل البيتزا الإيطالية الأصيلة', '321 Pizza Street, Cairo, Morocco', 30.0344, 31.2257, '+1234567894', 'info@italianpizza.com', '10:00:00', '24:00:00', 20.00, 8, 4.20, 95, 1, 1, NOW(), NOW()),
(2, 'مطعم السوشي الياباني', 'سوشي طازج ومأكولات يابانية أصيلة', '654 Sushi Street, Cairo, Morocco', 30.0744, 31.2757, '+1234567895', 'info@sushijapan.com', '11:00:00', '23:00:00', 25.00, 12, 4.40, 75, 1, 1, NOW(), NOW());

-- إدراج المنتجات
INSERT INTO `products` (`restaurant_id`, `name`, `description`, `price`, `category`, `preparation_time`, `is_available`, `created_at`, `updated_at`) VALUES
(1, 'كباب مشوي', 'كباب مشوي طازج مع الأرز والسلطة', 45.00, 'Grilled', 20, 1, NOW(), NOW()),
(1, 'شاورما دجاج', 'شاورما دجاج مع الخضار والصلصة', 35.00, 'Sandwiches', 15, 1, NOW(), NOW()),
(2, 'بيتزا مارغريتا', 'بيتزا بالجبن والطماطم الطازجة', 55.00, 'Pizza', 18, 1, NOW(), NOW()),
(2, 'بيتزا بيبروني', 'بيتزا بالبيبروني والجبن', 65.00, 'Pizza', 20, 1, NOW(), NOW()),
(3, 'سوشي سالمون', 'سوشي سالمون طازج', 75.00, 'Sushi', 15, 1, NOW(), NOW());
