@echo off
echo ========================================
echo    Eat to Eat Location Detection
echo ========================================
echo.
echo Starting development server with LOCATION DETECTION FEATURE...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo NEW LOCATION DETECTION FEATURES:
echo - Automatic location detection button
echo - GPS-based precise location
echo - Reverse geocoding for Arabic addresses
echo - Auto-fill city, neighborhood, street
echo - Display coordinates and full address
echo - Manual address editing option
echo - Green confirmation box for detected location
echo.
echo TEST THE LOCATION DETECTION:
echo 1. Go to: http://localhost:3000/user/register
echo 2. Fill Step 1: Basic Information
echo 3. Click "التالي" (Next)
echo 4. In Step 2, click "تحديد الموقع" button
echo 5. Allow location access when prompted
echo 6. Watch the automatic address filling
echo 7. See the green confirmation box
echo 8. Complete registration
echo.
echo TEST MANUAL LOCATION:
echo 1. Choose city from dropdown
echo 2. Add neighborhood manually
echo 3. Add street name manually
echo 4. Edit full address if needed
echo.
echo TEST THE HEADER LINKS:
echo 1. Go to: http://localhost:3000/
echo 2. Click "إنشاء حساب" in header
echo 3. Test the location detection feature
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
