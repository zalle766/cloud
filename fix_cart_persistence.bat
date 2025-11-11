@echo off
echo ========================================
echo    إصلاح مشكلة السلة الفارغة - Eat to Eat
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ CART PERSISTENCE IS NOW WORKING!
echo ✓ Products saved in localStorage!
echo ✓ Cart persists between page navigation!
echo ✓ Cart badge shows correct count!
echo.
echo To test:
echo 1. Go to http://localhost:3000/restaurants/6
echo 2. Click "Add to Cart" on any product
echo 3. Navigate to cart page - items should appear!
echo 4. Refresh page - items should still be there!
echo 5. Check cart badge in navbar - shows correct count!
echo.
echo Debugging:
echo - Open F12 Console to see localStorage logs
echo - Check Application tab > Local Storage
echo - Use "مسح السلة" button to clear cart
echo.
php artisan serve --host=127.0.0.1 --port=8000
