@echo off
echo ========================================
echo    Eat to Eat Frontend Development
echo ========================================
echo.
echo Starting development server...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Checking if node_modules exists...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
) else (
    echo Dependencies already installed.
    echo.
)

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
