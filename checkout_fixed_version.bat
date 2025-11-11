@echo off
echo ========================================
echo    Checkout مع السلة - النسخة المصلحة
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ FIXED CHECKOUT WITH CART!
echo ✓ Fixed useEffect issue!
echo ✓ Direct cart loading!
echo ✓ Real product display!
echo ✓ Real price calculations!
echo ✓ Cart validation!
echo ✓ Order creation simulation!
echo ✓ Cart clearing after order!
echo.
echo To test:
echo 1. Go to http://localhost:3000/restaurants
echo 2. Add products to cart
echo 3. Go to http://localhost:3000/checkout
echo 4. See real products and prices
echo 5. Fill form and submit
echo 6. Cart will be cleared after order
echo.
echo Features:
echo - Fixed cart integration with localStorage
echo - Direct cart loading without useEffect issues
echo - Product images in checkout
echo - Real price calculations
echo - Delivery fee from restaurant
echo - Tax calculation (10%)
echo - Cart validation
echo - Order creation simulation
echo - Cart clearing after order
echo - Back to cart button
echo - Console logging for debugging
echo.
echo Note: This version is FIXED and should work!
echo Make sure to add products to cart first!
echo.
php artisan serve --host=127.0.0.1 --port=8000
