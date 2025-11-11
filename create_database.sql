-- إعدادات قاعدة البيانات لتطبيق Eat to Eat
-- استخدم هذا الملف في phpMyAdmin لإنشاء قاعدة البيانات

-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS `eat_to_eat` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- استخدام قاعدة البيانات
USE `eat_to_eat`;

-- عرض رسالة النجاح
SELECT 'تم إنشاء قاعدة البيانات بنجاح!' as message;
