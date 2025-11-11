-- إضافة مطاعم تجريبية لقاعدة البيانات
USE `eat_to_eat`;

-- حذف المطاعم القديمة إذا كانت موجودة (اختياري)
-- DELETE FROM restaurants WHERE email IN ('info@alasala.com', 'info@italianpizza.com', 'info@sushijapan.com');
-- DELETE FROM users WHERE email IN ('restaurant1@test.com', 'restaurant2@test.com', 'restaurant3@test.com');

-- إضافة مستخدمين لأصحاب المطاعم (مع التحقق من عدم وجودهم)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `phone`, `address`, `latitude`, `longitude`, `is_active`, `created_at`, `updated_at`) 
SELECT * FROM (
    SELECT 'أحمد المطعم' as name, 'restaurant1@test.com' as email, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' as password, 'restaurant' as role, '+212612345678' as phone, 'شارع محمد الخامس، الدار البيضاء، المغرب' as address, 33.5731 as latitude, -7.5898 as longitude, 1 as is_active, NOW() as created_at, NOW() as updated_at
    UNION ALL
    SELECT 'فاطمة المطعم', 'restaurant2@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'restaurant', '+212612345679', 'شارع الحسن الثاني، الرباط، المغرب', 34.0209, -6.8416, 1, NOW(), NOW()
    UNION ALL
    SELECT 'محمد المطعم', 'restaurant3@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'restaurant', '+212612345680', 'شارع علال الفاسي، مراكش، المغرب', 31.6295, -7.9811, 1, NOW(), NOW()
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE users.email = tmp.email);

-- إضافة المطاعم
INSERT INTO `restaurants` (`user_id`, `name`, `description`, `address`, `latitude`, `longitude`, `phone`, `email`, `opening_time`, `closing_time`, `delivery_fee`, `delivery_radius`, `rating`, `total_reviews`, `is_active`, `is_open`, `created_at`, `updated_at`)
SELECT * FROM (
    SELECT (SELECT id FROM users WHERE email = 'restaurant1@test.com' LIMIT 1) as user_id, 'مطعم الأصالة' as name, 'مطعم يقدم أشهى الأطباق العربية التقليدية' as description, 'شارع محمد الخامس، الدار البيضاء، المغرب' as address, 33.5731 as latitude, -7.5898 as longitude, '+212612345678' as phone, 'info@alasala.com' as email, '09:00' as opening_time, '23:00' as closing_time, 15.00 as delivery_fee, 10 as delivery_radius, 4.5 as rating, 120 as total_reviews, 1 as is_active, 1 as is_open, NOW() as created_at, NOW() as updated_at
    UNION ALL
    SELECT (SELECT id FROM users WHERE email = 'restaurant2@test.com' LIMIT 1), 'مطعم البيتزا الإيطالية', 'أفضل البيتزا الإيطالية الأصيلة', 'شارع الحسن الثاني، الرباط، المغرب', 34.0209, -6.8416, '+212612345679', 'info@italianpizza.com', '10:00', '24:00', 20.00, 8, 4.7, 85, 1, 1, NOW(), NOW()
    UNION ALL
    SELECT (SELECT id FROM users WHERE email = 'restaurant3@test.com' LIMIT 1), 'مطعم السوشي الياباني', 'سوشي طازج ومأكولات يابانية أصيلة', 'شارع علال الفاسي، مراكش، المغرب', 31.6295, -7.9811, '+212612345680', 'info@sushijapan.com', '11:00', '23:00', 25.00, 12, 4.8, 95, 1, 1, NOW(), NOW()
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE restaurants.email = tmp.email);

-- تحديث المطاعم الموجودة لتكون نشطة
UPDATE restaurants SET is_active = 1, is_open = 1 WHERE email IN ('info@alasala.com', 'info@italianpizza.com', 'info@sushijapan.com');

-- عرض عدد المطاعم النشطة
SELECT COUNT(*) as total_active_restaurants FROM restaurants WHERE is_active = 1;

