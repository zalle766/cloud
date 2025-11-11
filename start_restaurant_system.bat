@echo off
echo ========================================
echo    Eat to Eat Restaurant System
echo ========================================
echo.
echo Starting development server with RESTAURANT REGISTRATION SYSTEM...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo NEW RESTAURANT SYSTEM FEATURES:
echo - Restaurant Registration Form (8 steps)
echo - Detailed restaurant information collection
echo - Owner and partnership information
echo - License and document management
echo - Image upload functionality
echo - Admin dashboard for restaurant management
echo - Real-time restaurant approval system
echo.
echo AVAILABLE ROUTES:
echo - http://localhost:3000/ (Home page)
echo - http://localhost:3000/restaurant/register (Restaurant registration)
echo - http://localhost:3000/admin/dashboard (Admin dashboard)
echo.
echo TEST INSTRUCTIONS:
echo 1. Go to /restaurant/register to test registration form
echo 2. Fill out all 8 steps of the form
echo 3. Go to /admin/dashboard to see submitted restaurants
echo 4. Test approval/rejection functionality
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
