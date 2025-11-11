@echo off
chcp 65001 >nul
echo ========================================
echo إصلاح قاعدة البيانات - إنشاء الجداول
echo ========================================
echo.

cd backend

echo [1] التحقق من ملف .env...
if not exist .env (
    echo خطأ: ملف .env غير موجود!
    echo يرجى تشغيل setup_laravel_backend.bat أولاً
    pause
    exit /b 1
)
echo ✓ ملف .env موجود
echo.

echo [2] التحقق من اتصال قاعدة البيانات...
php artisan db:show 2>nul
if errorlevel 1 (
    echo.
    echo ⚠ تحذير: لا يمكن الاتصال بقاعدة البيانات
    echo.
    echo يرجى التأكد من:
    echo   1. MySQL يعمل في XAMPP
    echo   2. قاعدة البيانات 'eat_to_eat' موجودة
    echo      - افتح phpMyAdmin: http://localhost/phpmyadmin
    echo      - أنشئ قاعدة بيانات باسم: eat_to_eat
    echo.
    echo هل تريد المتابعة على أي حال؟ (Y/N)
    set /p continue=
    if /i not "%continue%"=="Y" exit /b 1
)
echo ✓ الاتصال بقاعدة البيانات ناجح
echo.

echo [3] إنشاء الجداول...
php artisan migrate --force
if errorlevel 1 (
    echo.
    echo ❌ فشل إنشاء الجداول!
    echo.
    echo الحل البديل: استخدم ملف SQL مباشرة
    echo   1. افتح phpMyAdmin: http://localhost/phpmyadmin
    echo   2. اختر قاعدة البيانات 'eat_to_eat'
    echo   3. اضغط على تبويب "SQL"
    echo   4. انسخ محتوى ملف: create_users_table_only.sql
    echo   5. الصق في مربع SQL واضغط "Go"
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ تم إنشاء الجداول بنجاح!
echo ========================================
echo.
echo يمكنك الآن:
echo   - التسجيل في: http://localhost:3000/customer/register
echo   - التحقق من phpMyAdmin لرؤية جدول users
echo.
pause

