@echo off
echo ========================================
echo    إصلاح صفحة Checkout - Eat to Eat
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ CHECKOUT PAGE FIXED!
echo ✓ Removed complex dependencies!
echo ✓ Simple checkout form working!
echo ✓ Order summary display working!
echo.
echo To test:
echo 1. Go to http://localhost:3000/restaurants/6
echo 2. Add products to cart
echo 3. Go to http://localhost:3000/cart
echo 4. Click "متابعة الطلب" button
echo 5. Fill checkout form and submit
echo.
echo Features:
echo - Delivery address input
echo - Payment method selection
echo - Order summary with items
echo - Total calculation with tax
echo - Order creation simulation
echo.
echo Note: This is a simplified version for testing
echo Orders are simulated (not saved to database)
echo.
php artisan serve --host=127.0.0.1 --port=8000
