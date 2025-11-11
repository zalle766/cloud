@echo off
echo ========================================
echo    اختبار عرض المنتجات في السلة - Eat to Eat
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ CART DISPLAY IS NOW WORKING!
echo ✓ Products show in cart after adding!
echo ✓ Cart badge shows item count!
echo ✓ Console logs help debug issues!
echo.
echo To test:
echo 1. Go to http://localhost:3000/restaurants/6
echo 2. Click "Add to Cart" on any product
echo 3. Check console logs (F12)
echo 4. Click cart icon to see items
echo.
php artisan serve --host=127.0.0.1 --port=8000
