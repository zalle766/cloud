@echo off
chcp 65001 >nul
echo ========================================
echo حذف وإنشاء قاعدة البيانات من جديد
echo ========================================
echo.
echo ⚠ تحذير: سيتم حذف قاعدة البيانات بالكامل!
echo.
pause

cd backend

echo.
echo [1/4] التحقق من ملف .env...
if not exist .env (
    echo ❌ خطأ: ملف .env غير موجود!
    echo يرجى تشغيل setup_laravel_backend.bat أولاً
    pause
    exit /b 1
)
echo ✓ ملف .env موجود
echo.

echo [2/4] حذف قاعدة البيانات القديمة...
php artisan db:wipe --force 2>nul
if errorlevel 1 (
    echo ⚠ تحذير: لا يمكن حذف قاعدة البيانات (قد تكون غير موجودة)
)
echo.

echo [3/4] إنشاء قاعدة البيانات والجداول من جديد...
php artisan migrate:fresh --force
if errorlevel 1 (
    echo.
    echo ❌ فشل إنشاء الجداول!
    echo.
    echo الحل البديل: استخدم ملف SQL مباشرة
    echo   1. افتح phpMyAdmin: http://localhost/phpmyadmin
    echo   2. اضغط على تبويب "SQL"
    echo   3. انسخ محتوى ملف: recreate_database_complete.sql
    echo   4. الصق في مربع SQL واضغط "Go"
    echo.
    pause
    exit /b 1
)
echo.

echo [4/4] التحقق من الجداول...
php artisan db:table users 2>nul
if errorlevel 1 (
    echo ⚠ تحذير: جدول users قد لا يكون موجوداً
) else (
    echo ✓ جدول users موجود
)
echo.

echo ========================================
echo ✓ تم إنشاء قاعدة البيانات بنجاح!
echo ========================================
echo.
echo يمكنك الآن:
echo   - التسجيل في: http://localhost:3000/customer/register
echo   - التحقق من phpMyAdmin لرؤية جميع الجداول
echo.
pause

