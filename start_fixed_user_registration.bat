@echo off
echo ========================================
echo    Eat to Eat User Registration Fix
echo ========================================
echo.
echo Starting development server with FIXED USER REGISTRATION...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo FIXED ISSUES:
echo - Added custom CSS classes for forms
echo - Fixed button styling issues
echo - Fixed input field styling
echo - Added proper primary color definitions
echo.
echo TEST THE USER REGISTRATION:
echo 1. Go to: http://localhost:3000/user/register
echo 2. Fill out all 4 steps
echo 3. Test the "Next" and "Previous" buttons
echo 4. Test the final "Create Account" button
echo.
echo TEST THE USER LOGIN:
echo 1. Go to: http://localhost:3000/user/login
echo 2. Test the login form
echo 3. Test the social login buttons
echo.
echo TEST THE USER PROFILE:
echo 1. Go to: http://localhost:3000/user/profile
echo 2. Test the edit functionality
echo 3. Test the save/cancel buttons
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
