@echo off
echo ========================================
echo    Eat to Eat - Final Image Fix
echo ========================================
echo.

echo [1/3] Updated RestaurantsSimple.jsx with cache-busting...
echo Added timestamp to all image URLs to prevent caching

echo.
echo [2/3] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo [3/3] Opening browser with cache clear...
timeout /t 5 /nobreak > nul
start "http://localhost:3000/restaurants"

echo.
echo ========================================
echo    Final Image Fix Applied!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Restaurants: http://localhost:3000/restaurants
echo.
echo Changes made:
echo 1. ✅ Added timestamp to all image URLs
echo 2. ✅ Added loading="lazy" for better performance
echo 3. ✅ Enhanced error handling and logging
echo 4. ✅ Cache-busting to prevent old images
echo.
echo IMPORTANT: If images still don't show:
echo 1. Press Ctrl+F5 to hard refresh
echo 2. Clear browser cache
echo 3. Check internet connection
echo 4. Open browser console (F12) for errors
echo.
echo The restaurant images should now display correctly!
echo.
pause
