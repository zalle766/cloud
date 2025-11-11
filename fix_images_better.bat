@echo off
echo ========================================
echo    إصلاح الصور بطريقة أفضل - Eat to Eat
echo ========================================
echo.

echo Step 1: Creating storage symbolic link...
cd backend
php artisan storage:link
echo ✓ Storage link created!

echo.
echo Step 2: Running real image seeder...
php artisan db:seed --class=RealImageSeeder
echo ✓ Real images seeded!

echo.
echo Step 3: Starting Laravel server...
echo Laravel server will start on http://localhost:8000
echo.
echo ✓ Images are now using real URLs from Unsplash!
echo ✓ No need for local storage - images load directly from internet!
echo.
php artisan serve --host=127.0.0.1 --port=8000
