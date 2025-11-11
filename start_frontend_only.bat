@echo off
echo ========================================
echo    تشغيل الفرونت إند فقط - Eat to Eat
echo ========================================
echo.

cd frontend

echo Step 1: Installing dependencies...
npm install

echo.
echo Step 2: Starting development server...
echo Server will start on http://localhost:3000
echo.
echo ✓ DEPENDENCIES INSTALLED!
echo ✓ FRONTEND STARTING!
echo.
echo To test:
echo 1. Go to http://localhost:3000
echo 2. Should see the React app
echo 3. Make sure backend is running on port 8000
echo.
echo Features:
echo - React development server
echo - Hot reload enabled
echo - Ready to connect to backend
echo.
echo Note: Make sure backend is running on port 8000
echo before testing the restaurants feature.
echo.
npm run dev
