@echo off
echo ========================================
echo    Eat to Eat - Complete Fix
echo ========================================
echo.

echo Step 1: Adding complete restaurant data...
"C:\xampp\mysql\bin\mysql.exe" -u root eat_to_eat < complete_restaurant_data.sql

echo Step 2: Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node server.js"

echo Waiting for backend to start...
ping 127.0.0.1 -n 8 > nul

echo Step 3: Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo    System Started Successfully!
echo ========================================
echo.
echo Backend API:  http://localhost:5000
echo Frontend:     http://localhost:3000
echo.
echo Test these restaurant links:
echo - http://localhost:3000/restaurants/1
echo - http://localhost:3000/restaurants/2
echo - http://localhost:3000/restaurants/12
echo.
echo The restaurant click issue should now be FIXED!
echo.
pause




