@echo off
echo ========================================
echo    Eat to Eat Complete Registration Flow
echo ========================================
echo.
echo Starting development server with COMPLETE REGISTRATION FLOW...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo COMPLETE REGISTRATION FLOW FEATURES:
echo - User registration with location detection
echo - Automatic database saving (localStorage simulation)
echo - Redirect to restaurants page after success
echo - User authentication state management
echo - Complete restaurants listing page
echo - Search and filter functionality
echo.
echo TEST THE COMPLETE FLOW:
echo 1. Go to: http://localhost:3000/user/register
echo 2. Fill Step 1: Basic Information
echo 3. Click "التالي" (Next)
echo 4. In Step 2, click "تحديد الموقع" button
echo 5. Allow location access when prompted
echo 6. Complete the registration form
echo 7. Click "إنشاء الحساب" (Create Account)
echo 8. Watch the success message
echo 9. Get automatically redirected to /restaurants
echo 10. See the restaurants listing page
echo.
echo TEST THE RESTAURANTS PAGE:
echo - Browse different restaurants
echo - Use search functionality
echo - Filter by cuisine type
echo - Sort by rating/distance/delivery time
echo - Click "عرض القائمة" to view menu
echo.
echo TEST USER AUTHENTICATION:
echo - Check localStorage for saved user data
echo - User should be marked as authenticated
echo - User role should be 'customer'
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
