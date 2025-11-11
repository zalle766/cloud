@echo off
echo ========================================
echo    Eat to Eat - Quick Fix
echo ========================================
echo.

echo Step 1: Creating database...
"C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS eat_to_eat;"

echo Step 2: Creating tables...
"C:\xampp\mysql\bin\mysql.exe" -u root eat_to_eat < create_tables.sql

echo Step 3: Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node server.js"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Step 4: Starting Frontend Server...
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




