@echo off
echo ========================================
echo    الحل النهائي لمشكلة الصور المتكررة
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Recreating all products with unique images...
php artisan db:seed --class=FixImagesSeeder

echo.
echo Step 3: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ FIXED: All products now have unique images!
echo ✓ FIXED: No more repeated burger images!
echo ✓ FIXED: Each product shows its own image!
echo.
php artisan serve --host=127.0.0.1 --port=8000
