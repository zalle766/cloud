@echo off
echo ========================================
echo    Eat to Eat User Dashboard
echo ========================================
echo.
echo Starting development server with USER DASHBOARD...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo NEW USER DASHBOARD FEATURES:
echo - Complete user dashboard with statistics
echo - Recent orders tracking
echo - Favorite restaurants list
echo - Quick actions menu
echo - Order history and ratings
echo - Spending statistics
echo - Restaurant recommendations
echo.
echo TEST THE USER DASHBOARD:
echo 1. Go to: http://localhost:3000/user/register
echo 2. Complete registration process
echo 3. After registration, click user menu in header
echo 4. Click "لوحة التحكم" (Control Panel)
echo 5. See the complete dashboard with:
echo    - Statistics cards (orders, favorites, spending, rating)
echo    - Recent orders list
echo    - Favorite restaurants
echo    - Quick actions
echo.
echo DASHBOARD FEATURES:
echo - Total Orders: 12
echo - Favorite Restaurants: 5
echo - Total Spent: 450 DH
echo - Average Rating: 4.8
echo - Recent orders with status and ratings
echo - Favorite restaurants with images
echo - Quick action buttons
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
