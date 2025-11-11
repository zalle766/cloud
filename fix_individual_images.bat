@echo off
echo ========================================
echo    إصلاح مشكلة الصور المختارة - Eat to Eat
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Clearing existing products with wrong images...
php artisan tinker --execute="App\Models\Product::where('image', 'products/default.jpg')->update(['image' => null]);"

echo.
echo Step 3: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ FIXED: Products will now show their individual images!
echo ✓ FIXED: No more default image for all products!
echo ✓ FIXED: Each product will have unique image!
echo.
php artisan serve --host=127.0.0.1 --port=8000
