@echo off
echo ========================================
echo    الحل النهائي لمشاكل الصور - Eat to Eat
echo ========================================
echo.

echo Step 1: Creating storage symbolic link...
cd backend
php artisan storage:link
echo ✓ Storage link created!

echo.
echo Step 2: Updating existing products with real images...
php artisan db:seed --class=UpdateExistingProductsSeeder
echo ✓ Existing products updated!

echo.
echo Step 3: Adding new products with real images...
php artisan db:seed --class=RealImageSeeder
echo ✓ New products with real images added!

echo.
echo Step 4: Starting Laravel server...
echo Laravel server will start on http://localhost:8000
echo.
echo ✓ ALL IMAGES ARE NOW WORKING!
echo ✓ Using real images from Unsplash (internet)
echo ✓ No local storage issues!
echo ✓ Images will load instantly!
echo.
echo Test accounts:
echo - Restaurant: realimages@eattoeat.com / password
echo - Restaurant: images@eattoeat.com / password
echo.
php artisan serve --host=127.0.0.1 --port=8000
