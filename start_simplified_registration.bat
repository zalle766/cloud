@echo off
echo ========================================
echo    Eat to Eat Simplified Registration
echo ========================================
echo.
echo Starting development server with SIMPLIFIED USER REGISTRATION...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo SIMPLIFIED REGISTRATION FEATURES:
echo - Reduced from 4 steps to 2 steps only
echo - Step 1: Basic Information (Name, Email, Phone, Password)
echo - Step 2: Location and Terms (City, Neighborhood, Terms)
echo - Removed complex fields (coordinates, preferences, etc.)
echo - City selection from dropdown menu
echo - Neighborhood is optional
echo - Much faster and easier registration
echo.
echo TEST THE SIMPLIFIED REGISTRATION:
echo 1. Go to: http://localhost:3000/user/register
echo 2. Fill Step 1: Basic Information
echo 3. Click "التالي" (Next)
echo 4. Fill Step 2: City and Terms
echo 5. Click "إنشاء الحساب" (Create Account)
echo.
echo TEST THE HEADER LINKS:
echo 1. Go to: http://localhost:3000/
echo 2. Click "إنشاء حساب" in header
echo 3. Should navigate to simplified registration
echo 4. Click "تسجيل الدخول" in header
echo 5. Should navigate to login page
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
