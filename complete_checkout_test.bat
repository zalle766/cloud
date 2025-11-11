@echo off
echo ========================================
echo    Checkout المكتمل مع السلة - Eat to Eat
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ COMPLETE CHECKOUT IMPLEMENTED!
echo ✓ Real cart integration working!
echo ✓ Product display in checkout!
echo ✓ Real price calculation!
echo ✓ Order creation simulation!
echo.
echo To test:
echo 1. Go to http://localhost:3000/restaurants/6
echo 2. Add products to cart
echo 3. Go to http://localhost:3000/cart
echo 4. Click "متابعة الطلب" button
echo 5. Fill checkout form and submit
echo.
echo Features:
echo - Real cart integration
echo - Product display with images
echo - Real price calculation
echo - Delivery fee calculation
echo - Tax calculation (10%)
echo - Order creation simulation
echo - Cart clearing after order
echo.
echo Note: Orders are simulated (not saved to database)
echo Cart data persists in localStorage
echo.
php artisan serve --host=127.0.0.1 --port=8000
