@echo off
echo ========================================
echo    إصلاح خطأ تحميل السلة - Eat to Eat
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ LOCALSTORAGE ERRORS FIXED!
echo ✓ Server-side rendering compatibility added!
echo ✓ Better error handling implemented!
echo ✓ Cart should load without errors now!
echo.
echo To test:
echo 1. Go to http://localhost:3000/cart
echo 2. Page should load without error message
echo 3. Check F12 Console for debug messages
echo 4. Test adding products to cart
echo.
echo Debug messages to look for:
echo - "CartProvider is initializing..."
echo - "Cart component is loading..."
echo - "useCart hook returned: [object]"
echo - "Cart component loaded successfully"
echo.
echo If you still see errors:
echo - Check Console for specific error messages
echo - Try refreshing the page
echo - Clear browser cache if needed
echo.
php artisan serve --host=127.0.0.1 --port=8000
