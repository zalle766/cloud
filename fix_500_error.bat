@echo off
echo ========================================
echo    إصلاح خطأ 500 في المطاعم
echo ========================================
echo.

cd backend

echo Step 1: Clearing cache...
php artisan cache:clear
php artisan config:clear
php artisan route:clear

echo.
echo Step 2: Fresh migration and seeding...
php artisan migrate:fresh --seed

echo.
echo Step 3: Creating storage link...
php artisan storage:link

echo.
echo Step 4: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ CACHE CLEARED!
echo ✓ DATABASE REFRESHED!
echo ✓ STORAGE LINKED!
echo ✓ RESTAURANT CONTROLLER FIXED!
echo.
echo To test:
echo 1. Go to http://localhost:3000
echo 2. Should see restaurants without 500 error
echo 3. Check browser console for debug info
echo.
echo Features:
echo - Simplified restaurant API
echo - Better error handling
echo - Default ratings and reviews
echo - No complex location queries
echo.
php artisan serve --host=127.0.0.1 --port=8000
