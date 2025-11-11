@echo off
echo ========================================
echo    Eat to Eat - Fix Images Issue
echo ========================================
echo.

echo [1/4] Creating uploads directory...
if not exist "backend\uploads" mkdir "backend\uploads"
echo Uploads directory created/verified

echo.
echo [2/4] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [3/4] Creating .env file...
if not exist ".env" (
    copy "env.example" ".env"
    echo Created .env file from template
) else (
    echo .env file already exists
)

echo.
echo [4/4] Starting servers...
cd ..

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo    Image Fix Complete!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo The images should now display correctly!
echo If images still don't show, check:
echo 1. Backend server is running on port 5000
echo 2. MySQL database is running
echo 3. Check browser console for errors
echo.
pause
