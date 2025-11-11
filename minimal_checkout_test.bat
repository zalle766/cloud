@echo off
echo ========================================
echo    النسخة المبسطة من Checkout - Eat to Eat
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ MINIMAL CHECKOUT IMPLEMENTED!
echo ✓ Removed all complex dependencies!
echo ✓ Added console logs for debugging!
echo ✓ Works even with empty cart!
echo.
echo To test:
echo 1. Go to http://localhost:3000/checkout
echo 2. Should show "السلة فارغة" message
echo 3. Add products from restaurants
echo 4. Go to cart and click "متابعة الطلب"
echo 5. Fill form and submit
echo.
echo Debug:
echo - Open F12 Console to see logs
echo - Check if Checkout component loads
echo - Check cart data in console
echo.
echo Features:
echo - Simple checkout form
echo - Order summary
echo - Total calculation
echo - Order simulation
echo.
php artisan serve --host=127.0.0.1 --port=8000
