@echo off
echo ========================================
echo    اختبار الاتصال - Eat to Eat
echo ========================================
echo.

echo Testing Backend API...
echo.

echo 1. Testing restaurants endpoint...
curl -s http://localhost:8000/api/restaurants
echo.
echo.

echo 2. Testing if backend is running...
curl -s -o nul -w "Backend Status: %%{http_code}\n" http://localhost:8000/api/restaurants
echo.

echo 3. Testing if frontend is running...
curl -s -o nul -w "Frontend Status: %%{http_code}\n" http://localhost:3000
echo.

echo ========================================
echo    نتائج الاختبار
echo ========================================
echo.
echo If you see:
echo - Backend Status: 200 = Backend is working
echo - Frontend Status: 200 = Frontend is working
echo - JSON data above = Restaurants API is working
echo.
echo If you see errors:
echo - Backend Status: 000 = Backend not running
echo - Frontend Status: 000 = Frontend not running
echo.
echo Solutions:
echo - Run start_backend_only.bat for backend
echo - Run start_frontend_only.bat for frontend
echo - Run start_full_system.bat for both
echo.
pause
