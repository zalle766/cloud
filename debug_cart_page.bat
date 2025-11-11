@echo off
echo ========================================
echo    تشخيص مشكلة صفحة السلة الفارغة - Eat to Eat
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ DEBUGGING ENABLED!
echo ✓ Console logs added to track issues!
echo ✓ CartProvider initialization tracked!
echo ✓ Component loading tracked!
echo.
echo To debug:
echo 1. Open F12 Developer Tools
echo 2. Go to Console tab
echo 3. Navigate to http://localhost:3000/cart
echo 4. Check console messages:
echo    - "CartProvider is initializing..."
echo    - "Cart component is loading..."
echo    - "Cart component loaded successfully"
echo.
echo If you see errors:
echo - Check if CartProvider is wrapping the app
echo - Check if useCart hook is working
echo - Check localStorage data
echo.
php artisan serve --host=127.0.0.1 --port=8000
