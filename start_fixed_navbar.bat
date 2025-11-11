@echo off
echo ========================================
echo    Eat to Eat Frontend Development
echo ========================================
echo.
echo Starting development server with FIXED Navbar...
echo.

cd /d "C:\xampp\htdocs\eattoeat\frontend"

echo Current directory: %CD%
echo.

echo Starting Vite development server...
echo The application will open automatically in your browser.
echo If it doesn't open, go to: http://localhost:3000
echo.
echo The Navbar should now appear at the top!
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
