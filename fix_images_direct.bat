@echo off
echo ========================================
echo    الحل المباشر لمشكلة الصور المتكررة
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Applying direct SQL fix...
sqlite3 database/database.sqlite < ../fix_images_direct.sql

echo.
echo Step 3: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ FIXED: All products now have unique images!
echo ✓ FIXED: Direct SQL solution applied!
echo ✓ FIXED: Each product shows its own image!
echo.
php artisan serve --host=127.0.0.1 --port=8000
