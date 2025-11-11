@echo off
echo ========================================
echo    Eat to Eat Frontend Development
echo ========================================
echo.
echo Starting development server with PRECISE Location System...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo NEW PRECISE LOCATION FEATURES:
echo - Shows exact neighborhood and street
echo - Saves precise coordinates with accuracy
echo - Filters restaurants within 3km radius
echo - Displays detailed location in header
echo - Enhanced location modal with street-level info
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
