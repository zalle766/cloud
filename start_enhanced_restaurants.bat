@echo off
echo ========================================
echo    Eat to Eat Frontend Development
echo ========================================
echo.
echo Starting development server with ENHANCED Restaurant Display...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo ENHANCED FEATURES:
echo - Added more restaurants in Marrakech
echo - Added restaurants in Casablanca and Rabat
echo - Extended radius to 10km for demo
echo - Added debug information
echo - Shows restaurant count and location details
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
