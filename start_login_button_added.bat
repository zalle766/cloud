@echo off
echo ========================================
echo    Eat to Eat Login Button Added
echo ========================================
echo.
echo Starting development server with LOGIN BUTTON IN USER MENU...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo NEW FEATURE ADDED:
echo - Added "تسجيل الدخول" button in user dropdown menu
echo - Fixed profile link to point to /user/profile
echo - User menu now has 3 options:
echo   1. الملف الشخصي (Personal Profile)
echo   2. لوحة التحكم (Control Panel)
echo   3. تسجيل الدخول (Login)
echo.
echo TEST THE USER MENU:
echo 1. Go to: http://localhost:3000/
echo 2. Click on user icon in header (if logged in)
echo 3. See the dropdown menu with 3 options
echo 4. Click "تسجيل الدخول" to go to login page
echo 5. Click "الملف الشخصي" to go to profile page
echo.
echo TEST REGISTRATION FLOW:
echo 1. Go to: http://localhost:3000/user/register
echo 2. Complete registration process
echo 3. After successful registration, check user menu
echo 4. All 3 options should be available
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
