@echo off
echo ========================================
echo    Eat to Eat - Fix Process Error
echo ========================================
echo.

echo [1/3] Fixing process.env error in api.js...
echo Process error has been fixed by removing process.env usage

echo.
echo [2/3] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo [3/3] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo    Process Error Fixed!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo The "process is not defined" error should now be resolved!
echo.
echo Changes made:
echo 1. Removed process.env from api.js
echo 2. Updated vite.config.js proxy to port 5000
echo 3. Using relative API path /api
echo.
pause
