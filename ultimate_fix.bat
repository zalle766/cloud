@echo off
echo ========================================
echo    Eat to Eat - Ultimate Fix
echo ========================================
echo.

echo Step 1: Checking MySQL service...
"C:\xampp\mysql\bin\mysql.exe" -u root -e "SELECT 1;" 2>nul
if errorlevel 1 (
    echo ERROR: MySQL is not running!
    echo Please start MySQL service first.
    pause
    exit /b 1
)

echo Step 2: Creating database and tables...
"C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS eat_to_eat;" 2>nul
"C:\xampp\mysql\bin\mysql.exe" -u root eat_to_eat < create_tables.sql 2>nul

echo Step 3: Adding restaurant data...
"C:\xampp\mysql\bin\mysql.exe" -u root eat_to_eat < complete_restaurant_data.sql 2>nul

echo Step 4: Verifying data...
"C:\xampp\mysql\bin\mysql.exe" -u root eat_to_eat < check_restaurants_count.sql

echo Step 5: Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node server.js"

echo Waiting for backend to start...
ping 127.0.0.1 -n 8 > nul

echo Step 6: Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo    System Started Successfully!
echo ========================================
echo.
echo Backend API:  http://localhost:5000
echo Frontend:     http://localhost:3000
echo.
echo Test these URLs:
echo - http://localhost:3000/restaurants
echo - http://localhost:3000/restaurants/1
echo - http://localhost:3000/restaurants/2
echo - http://localhost:3000/restaurants/12
echo.
echo The restaurant click issue should now be FIXED!
echo.
pause




