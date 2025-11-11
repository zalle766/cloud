@echo off
echo ========================================
echo    استعادة النسخة الأصلية الكاملة
echo ========================================
echo.

echo Step 1: Restoring original files...
copy "frontend\src\main_original.jsx" "frontend\src\main.jsx"
copy "frontend\src\App_original.jsx" "frontend\src\App.jsx"
copy "frontend\src\pages\Home_original.jsx" "frontend\src\pages\Home.jsx"

echo.
echo Step 2: Cleaning up backup files...
del "frontend\src\main_original.jsx"
del "frontend\src\App_original.jsx"
del "frontend\src\pages\Home_original.jsx"

echo.
echo ========================================
echo    تم استعادة النسخة الأصلية الكاملة!
echo ========================================
echo.
echo ✓ Original main.jsx restored
echo ✓ Original App.jsx restored
echo ✓ Original Home.jsx restored
echo ✓ Backup files cleaned up
echo.
echo You can now run start_full_system.bat
echo to use the full version.
echo.
pause
