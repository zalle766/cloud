@echo off
echo ========================================
echo    Eat to Eat Registration Fix
echo ========================================
echo.
echo Starting development server with REGISTRATION FIXES...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo FIXED ISSUES:
echo - Fixed premature account creation on step 1
echo - Registration only happens on final submit
echo - Proper step validation before proceeding
echo - Hide login/register buttons after successful registration
echo - Proper authentication state management
echo - Local storage integration with AuthContext
echo.
echo TEST THE FIXED REGISTRATION:
echo 1. Go to: http://localhost:3000/user/register
echo 2. Fill Step 1: Basic Information
echo 3. Click "التالي" (Next) - should go to step 2, NOT create account
echo 4. Fill Step 2: Location and Terms
echo 5. Click "إنشاء الحساب" (Create Account) - NOW it creates account
echo 6. Get redirected to /restaurants
echo 7. Check that login/register buttons are HIDDEN in header
echo 8. User should see their name in header instead
echo.
echo TEST AUTHENTICATION STATE:
echo - After registration, user should be logged in
echo - Header should show user menu instead of login/register
echo - User can logout and see login/register buttons again
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
