@echo off
chcp 65001 >nul
echo ========================================
echo تحديث اسم قاعدة البيانات في ملف .env
echo ========================================
echo.

cd backend

if not exist .env (
    echo ملف .env غير موجود.
    echo سيتم إنشاؤه تلقائياً عند تشغيل setup_laravel_backend.bat
    echo.
    pause
    exit /b 0
)

echo تحديث ملف .env...
echo.

REM تحديث DB_DATABASE إذا كان موجوداً
powershell -Command "(Get-Content .env) -replace 'DB_DATABASE=eattoeat', 'DB_DATABASE=eat_to_eat' | Set-Content .env"

echo ✓ تم تحديث ملف .env بنجاح!
echo.
echo اسم قاعدة البيانات الآن: eat_to_eat
echo.
pause

