@echo off
echo ========================================
echo    Starting Eat to Eat System
echo ========================================
echo.

echo Step 1: Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node server.js"

echo Waiting for backend to start...
ping 127.0.0.1 -n 8 > nul

echo Step 2: Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo    System Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Now test: http://localhost:3000/restaurants/1
echo.
pause




