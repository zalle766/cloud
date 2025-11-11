@echo off
echo Starting Eat to Eat Frontend Development Server...
echo.
cd /d "C:\xampp\htdocs\eattoeat\frontend"
echo Current directory: %CD%
echo.
echo Installing dependencies if needed...
call npm install
echo.
echo Starting development server...
echo Open http://localhost:3000 in your browser
echo.
call npm run dev
pause