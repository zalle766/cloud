@echo off
echo ========================================
echo    Eat to Eat - Complete Fix
echo ========================================
echo.

echo Step 1: Adding more restaurants to database...
"C:\xampp\mysql\bin\mysql.exe" -u root eat_to_eat < add_more_restaurants.sql

echo Step 2: Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node server.js"

echo Waiting for backend to start...
timeout /t 8 /nobreak > nul

echo Step 3: Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo    System Started Successfully!
echo ========================================
echo.
echo Backend API:  http://localhost:5000
echo Frontend:     http://localhost:3000
echo Restaurants:  http://localhost:3000/restaurants
echo.
echo Now you can click on restaurants and they will work!
echo.
echo Press any key to continue...
pause > nul




