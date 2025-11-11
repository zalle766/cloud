@echo off
echo ========================================
echo    Eat to Eat Frontend Development
echo ========================================
echo.
echo Starting development server with ENHANCED Location Display...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo ENHANCED LOCATION FEATURES:
echo - Improved neighborhood and street detection
echo - Added debug logging for location API
echo - Enhanced location display logic
echo - Better address parsing
echo - Detailed location information in debug mode
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
