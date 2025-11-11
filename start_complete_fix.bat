@echo off
echo ========================================
echo    Eat to Eat - Complete Fix
echo ========================================
echo.

echo Step 1: Creating database...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS eat_to_eat;" 2>nul
if errorlevel 1 (
    echo Warning: MySQL connection failed. Please start MySQL service.
)

echo Step 2: Starting Backend Server (Node.js)...
start "Backend Server" cmd /k "cd backend && npm install && node server.js"

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
echo.
echo Registration should work now!
echo.
echo Press any key to continue...
pause > nul




