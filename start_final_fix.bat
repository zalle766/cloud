@echo off
echo ========================================
echo    Eat to Eat - Complete Fix
echo ========================================
echo.

echo Step 1: Creating database and tables...
mysql -u root < simple_database.sql
if errorlevel 1 (
    echo Warning: Database creation failed. Please check MySQL service.
)

echo Step 2: Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node server.js"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

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
echo Registration should work now!
echo.
pause




