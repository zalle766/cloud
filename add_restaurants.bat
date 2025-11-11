@echo off
chcp 65001 >nul
echo ========================================
echo إضافة مطاعم تجريبية لقاعدة البيانات
echo ========================================
echo.

cd backend

echo [1/2] تشغيل Seeder لإضافة المطاعم...
php artisan db:seed --class=DatabaseSeeder

if errorlevel 1 (
    echo.
    echo ❌ فشل إضافة المطاعم من Seeder
    echo.
    echo [2/2] محاولة إضافة المطاعم مباشرة من SQL...
    echo.
    echo يرجى فتح phpMyAdmin وتنفيذ ملف: add_sample_restaurants.sql
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ تم إضافة المطاعم بنجاح!
echo.
echo يمكنك الآن فتح صفحة المطاعم في المتصفح
echo.
pause

