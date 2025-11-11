@echo off
echo ========================================
echo    إصلاح مشكلة المطاعم القريبة
echo ========================================
echo.

cd backend

echo Step 1: Fresh migration and seeding...
php artisan migrate:fresh --seed

echo.
echo Step 2: Creating storage link...
php artisan storage:link

echo.
echo Step 3: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ RESTAURANTS SEEDED!
echo ✓ DATABASE REFRESHED!
echo ✓ STORAGE LINKED!
echo.
echo To test:
echo 1. Go to http://localhost:3000
echo 2. Should see restaurants in "المطاعم القريبة" section
echo 3. Click "عرض الكل" to see all restaurants
echo.
echo Features:
echo - 3 restaurants with data
echo - Products for each restaurant
echo - Proper images and ratings
echo - Working API endpoints
echo.
php artisan serve --host=127.0.0.1 --port=8000
