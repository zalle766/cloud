@echo off
echo ========================================
echo    النسخة المبسطة - Eat to Eat
echo ========================================
echo.

echo Step 1: Backing up original files...
copy "frontend\src\App.jsx" "frontend\src\App_original.jsx"
copy "frontend\src\pages\Home.jsx" "frontend\src\pages\Home_original.jsx"

echo.
echo Step 2: Using simple versions...
copy "frontend\src\App_simple.jsx" "frontend\src\App.jsx"
copy "frontend\src\pages\Home_simple.jsx" "frontend\src\pages\Home.jsx"

echo.
echo Step 3: Starting Backend Server...
cd backend
start "Backend Server" cmd /k "php artisan serve --host=127.0.0.1 --port=8000"

echo.
echo Step 4: Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo Step 5: Starting Frontend Server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Step 6: Waiting for frontend to start...
timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo    النسخة المبسطة تعمل الآن!
echo ========================================
echo.
echo ✓ Backend: http://localhost:8000
echo ✓ Frontend: http://localhost:3000
echo ✓ Simple App.jsx (no contexts)
echo ✓ Simple Home.jsx (basic fetch)
echo ✓ Debug information displayed
echo.
echo To test:
echo 1. Go to http://localhost:3000
echo 2. Should see debug info at top
echo 3. Check browser console for logs
echo 4. Click "إعادة التحميل" to test API
echo.
echo Features:
echo - No complex contexts
echo - Basic fetch API calls
echo - Debug information
echo - Error handling
echo - Manual refresh button
echo.
echo Press any key to open the application...
pause > nul

start http://localhost:3000

echo.
echo Application opened in browser!
echo Check debug info and browser console.
echo.
pause
