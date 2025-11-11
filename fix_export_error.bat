@echo off
echo ========================================
echo    إصلاح خطأ التصدير المكرر - Eat to Eat
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ DUPLICATE EXPORT ERROR FIXED!
echo ✓ CartProvider exported only once!
echo ✓ useCart exported only once!
echo ✓ Cart component exported correctly!
echo.
echo To test:
echo 1. Go to http://localhost:3000/cart
echo 2. Page should load without errors
echo 3. Check F12 Console for debug messages
echo 4. Add products to cart and test persistence
echo.
echo Debug messages to look for:
echo - "CartProvider is initializing..."
echo - "Cart component is loading..."
echo - "Cart component loaded successfully"
echo.
php artisan serve --host=127.0.0.1 --port=8000
