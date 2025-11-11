@echo off
echo ========================================
echo    Eat to Eat Frontend Development
echo ========================================
echo.
echo Starting development server with FIXED Neighborhood Display...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo FIXED NEIGHBORHOOD DISPLAY:
echo - Added fallback location data for major cities
echo - Enhanced location parsing with detailed info
echo - Added direct location setting for popular areas
echo - Improved header display logic
echo - Added debug logging for location data
echo.
echo TEST INSTRUCTIONS:
echo 1. Click location button in header
echo 2. Try "Use Current Location" or select popular location
echo 3. Check console (F12) for detailed location info
echo 4. Verify neighborhood shows in header
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
