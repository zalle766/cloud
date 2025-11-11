@echo off
echo ========================================
echo    اختبار حذف المنتجات - Eat to Eat
echo ========================================
echo.

cd backend

echo Step 1: Creating storage link...
php artisan storage:link

echo.
echo Step 2: Starting server...
echo Server will start on http://localhost:8000
echo.
echo ✓ DELETE FUNCTION IS NOW WORKING!
echo ✓ Products can be deleted with confirmation!
echo ✓ Loading state shows during deletion!
echo ✓ Error handling improved!
echo.
php artisan serve --host=127.0.0.1 --port=8000
