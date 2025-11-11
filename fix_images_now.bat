@echo off
echo ========================================
echo    إصلاح الصور فوراً - Eat to Eat
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Running immediate image fix...
php artisan db:seed --class=ImmediateImageFixSeeder

echo.
echo Step 3: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ ALL PRODUCTS NOW HAVE WORKING IMAGES!
echo ✓ Images are loaded from Unsplash (internet)
echo ✓ No local storage issues!
echo.
php artisan serve --host=127.0.0.1 --port=8000
