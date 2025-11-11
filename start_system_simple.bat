@echo off
echo Starting Eat to Eat System...

echo Step 1: Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node server.js"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Step 2: Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo System started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause




