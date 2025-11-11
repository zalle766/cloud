@echo off
echo ========================================
echo    Eat to Eat Header Links Fix
echo ========================================
echo.
echo Starting development server with FIXED HEADER LINKS...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo FIXED ISSUES:
echo - Fixed "إنشاء حساب" button to link to /user/register
echo - Fixed "تسجيل الدخول" button to link to /user/login
echo - Added proper CSS classes for buttons
echo - Added primary and secondary color definitions
echo.
echo TEST THE HEADER LINKS:
echo 1. Go to: http://localhost:3000/
echo 2. Click "إنشاء حساب" (Create Account) button in header
echo 3. Should navigate to user registration page
echo 4. Go back to home page
echo 5. Click "تسجيل الدخول" (Login) button in header
echo 6. Should navigate to user login page
echo.
echo TEST THE USER REGISTRATION:
echo 1. Fill out all 4 steps in registration
echo 2. Test "Next" and "Previous" buttons
echo 3. Test "Create Account" button
echo.
echo TEST THE USER LOGIN:
echo 1. Test login form
echo 2. Test social login buttons
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
