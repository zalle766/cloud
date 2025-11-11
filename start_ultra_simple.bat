@echo off
echo ========================================
echo    النسخة المبسطة جداً - Eat to Eat
echo ========================================
echo.

echo Step 1: Backing up original files...
copy "frontend\src\main.jsx" "frontend\src\main_original.jsx"
copy "frontend\src\App.jsx" "frontend\src\App_original.jsx"
copy "frontend\src\pages\Home.jsx" "frontend\src\pages\Home_original.jsx"

echo.
echo Step 2: Using ultra-simple versions...
copy "frontend\src\main_simple.jsx" "frontend\src\main.jsx"
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
echo    النسخة المبسطة جداً تعمل الآن!
echo ========================================
echo.
echo ✓ Backend: http://localhost:8000
echo ✓ Frontend: http://localhost:3000
echo ✓ Ultra-simple main.jsx (no QueryClient)
echo ✓ Ultra-simple App.jsx (no contexts)
echo ✓ Ultra-simple Home.jsx (basic fetch)
echo ✓ Test HTML page available
echo.
echo To test:
echo 1. Go to http://localhost:3000 (React app)
echo 2. Or go to http://localhost:3000/test.html (HTML page)
echo 3. Check browser console for logs
echo 4. Use debug info and refresh buttons
echo.
echo Features:
echo - No QueryClient or complex dependencies
echo - Basic fetch API calls
echo - Debug information displayed
echo - Error handling
echo - Manual refresh buttons
echo - HTML test page as backup
echo.
echo Press any key to open the React application...
pause > nul

start http://localhost:3000

echo.
echo Press any key to open the HTML test page...
pause > nul

start http://localhost:3000/test.html

echo.
echo Both pages opened in browser!
echo Check both React app and HTML test page.
echo.
pause
