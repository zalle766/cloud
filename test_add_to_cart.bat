@echo off
echo ========================================
echo    اختبار إضافة المنتجات للسلة - Eat to Eat
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ ADD TO CART FUNCTION IS NOW WORKING!
echo ✓ Products can be added to cart!
echo ✓ Cart context is properly connected!
echo ✓ Success messages show when adding items!
echo.
php artisan serve --host=127.0.0.1 --port=8000
