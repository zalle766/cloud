@echo off
echo ========================================
echo    Eat to Eat Frontend Development
echo ========================================
echo.
echo Starting development server with FIXED CSS...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo CSS FIXES APPLIED:
echo - Added CSS import to main_simple.jsx
echo - Enhanced RTL support
echo - Fixed Arabic font loading
echo - Added proper direction and text alignment
echo - Enhanced Tailwind CSS configuration
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
