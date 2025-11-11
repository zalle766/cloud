@echo off
echo ========================================
echo إصلاح الاتصال مع MySQL
echo ========================================

echo نسخ ملف .env الصحيح...
copy env_mysql.txt backend\.env

echo الانتقال لمجلد Laravel...
cd backend

echo إنشاء مفتاح التطبيق...
php artisan key:generate

echo تشغيل migrations...
php artisan migrate --force

echo إدراج البيانات التجريبية...
php artisan db:seed --force

echo إنشاء رابط التخزين...
php artisan storage:link

echo ========================================
echo تم إعداد Laravel مع MySQL بنجاح!
echo ========================================

echo تشغيل خادم Laravel...
php artisan serve --host=0.0.0.0 --port=8000
