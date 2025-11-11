@echo off
echo ========================================
echo    النسخة المستقرة من Checkout - Eat to Eat
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ STABLE CHECKOUT IMPLEMENTED!
echo ✓ No external dependencies!
echo ✓ No complex hooks!
echo ✓ Pure React with inline styles!
echo ✓ Should work without any errors!
echo.
echo To test:
echo 1. Go to http://localhost:3000/checkout
echo 2. Should show checkout form immediately
echo 3. Fill form and submit
echo 4. Test order creation
echo.
echo Features:
echo - Simple checkout form
echo - Delivery address input
echo - Payment method selection
echo - Order summary (demo)
echo - Order creation simulation
echo - Link to restaurants page
echo.
echo Note: This is a stable demo version
echo No real cart integration
echo No real order creation
echo Works independently
echo.
php artisan serve --host=127.0.0.1 --port=8000
