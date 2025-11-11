-- فحص المطاعم في قاعدة البيانات
USE eat_to_eat;
SELECT COUNT(*) as total_restaurants FROM restaurants;
SELECT id, name, status FROM restaurants LIMIT 5;




