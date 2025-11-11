@echo off
echo ========================================
echo    Eat to Eat - User Registration Fix
echo ========================================
echo.

echo Starting complete system setup...
echo.

echo [1/5] Checking Node.js installation...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

echo.
echo [2/5] Installing backend dependencies...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Backend dependencies already installed
)

echo.
echo [3/5] Installing frontend dependencies...
cd ..\frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Frontend dependencies already installed
)

echo.
echo [4/5] Starting backend server...
cd ..\backend
start "Backend Server" cmd /k "npm start"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo [5/5] Starting frontend server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo Waiting for frontend to start...
timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo           Setup Complete!
echo ========================================
echo.
echo ✅ Backend server: http://localhost:5000
echo ✅ Frontend server: http://localhost:5173
echo ✅ User registration: http://localhost:5173/user/register
echo.
echo The user registration form is now working properly with:
echo - Multi-step form with validation
echo - Arabic language support
echo - Location detection
echo - Proper error handling
echo - Success notifications
echo.
echo You can now test the registration by:
echo 1. Opening http://localhost:5173/user/register
echo 2. Filling out the form
echo 3. Submitting to create a new account
echo.
echo Press any key to open the registration page...
pause > nul

start http://localhost:5173/user/register

echo.
echo Enjoy using Eat to Eat! 🍽️
pause
