@echo off
echo ========================================
echo    Eat to Eat - Fixed System
echo ========================================
echo.

echo Step 1: Creating database...
"C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS eat_to_eat;" 2>nul
if errorlevel 1 (
    echo MySQL is not running or not accessible!
    echo Please start MySQL service first.
    pause
    exit /b 1
)

echo Step 2: Creating tables...
"C:\xampp\mysql\bin\mysql.exe" -u root eat_to_eat < create_tables.sql 2>nul
if errorlevel 1 (
    echo Warning: Could not create tables. Database might already exist.
)

echo Database setup complete!

echo.
echo Step 3: Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node server.js"

echo Waiting for backend to start...
timeout /t 8 /nobreak > nul

echo Step 4: Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo    System Started Successfully!
echo ========================================
echo.
echo Backend API:  http://localhost:5000
echo Frontend:     http://localhost:3000
echo Registration: http://localhost:3000/user/register
echo.
echo Registration should work now!
echo.
echo Press any key to continue...
pause > nul
3