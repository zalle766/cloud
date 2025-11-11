@echo off
echo ========================================
echo    Eat to Eat Frontend Development
echo ========================================
echo.
echo Starting development server with REAL Location Data...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo REAL LOCATION DATA FEATURES:
echo - Uses ONLY real API geocoding results
echo - No mock or fallback data
echo - Enhanced parsing for street/neighborhood
echo - Improved API response analysis
echo - Detailed debug logging
echo.
echo TEST INSTRUCTIONS:
echo 1. Click location button in header
echo 2. Try "Use Current Location" for real GPS data
echo 3. Search for specific addresses
echo 4. Check console (F12) for detailed API responses
echo 5. Verify real street/neighborhood display
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
