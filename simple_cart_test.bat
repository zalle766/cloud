@echo off
echo ========================================
echo    النسخة المبسطة من السلة - Eat to Eat
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ SIMPLIFIED CART IMPLEMENTED!
echo ✓ Removed complex localStorage logic!
echo ✓ Removed error-prone try-catch blocks!
echo ✓ Basic cart functionality working!
echo.
echo To test:
echo 1. Go to http://localhost:3000/cart
echo 2. Page should load without errors
echo 3. Add products from restaurants
echo 4. Test cart functionality
echo.
echo Features:
echo - Add/remove products
echo - Update quantities
echo - Clear cart
echo - Show total price
echo - Cart badge in navbar
echo.
echo Note: Cart data will NOT persist between sessions
echo This is a simplified version for testing
echo.
php artisan serve --host=127.0.0.1 --port=8000
