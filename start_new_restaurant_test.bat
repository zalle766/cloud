@echo off
echo ========================================
echo    Eat to Eat Frontend Development
echo ========================================
echo.
echo Starting development server with NEW RESTAURANT TEST...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo NEW RESTAURANT ADDED:
echo - مطعم الأطلس الجديد
echo - Location: شارع الأطلس، حي النخيل، مراكش
echo - Rating: 4.7 stars
echo - Coordinates: 31.6290, -7.9840
echo.
echo TEST INSTRUCTIONS:
echo 1. Refresh the page to see the new restaurant
echo 2. Check console (F12) for "New restaurant added" message
echo 3. Verify the restaurant appears in the list
echo 4. Check if distance calculation works for new restaurant
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
