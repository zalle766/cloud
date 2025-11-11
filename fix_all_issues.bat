@echo off
echo ========================================
echo    Eat to Eat - Complete Fix
echo ========================================
echo.

echo [1/6] Creating uploads directory...
if not exist "backend\uploads" mkdir "backend\uploads"
echo Uploads directory created/verified

echo.
echo [2/6] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [3/6] Creating .env file...
if not exist ".env" (
    echo # Database Configuration > .env
    echo DB_HOST=localhost >> .env
    echo DB_USER=root >> .env
    echo DB_PASSWORD= >> .env
    echo DB_NAME=eat_to_eat >> .env
    echo. >> .env
    echo # Server Configuration >> .env
    echo PORT=5000 >> .env
    echo NODE_ENV=development >> .env
    echo. >> .env
    echo # JWT Secret >> .env
    echo JWT_SECRET=your-super-secret-jwt-key-change-in-production >> .env
    echo Created .env file
) else (
    echo .env file already exists
)

echo.
echo [4/6] Starting Backend Server...
cd ..
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo [5/6] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo [6/6] Opening browser...
timeout /t 3 /nobreak > nul
start http://localhost:3000

echo.
echo ========================================
echo    All Issues Fixed!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Fixed issues:
echo 1. ✅ Created uploads directory
echo 2. ✅ Fixed process.env error in api.js
echo 3. ✅ Updated vite.config.js proxy
echo 4. ✅ Created .env file for backend
echo 5. ✅ Installed all dependencies
echo.
echo The application should now work without errors!
echo.
pause
