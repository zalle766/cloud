@echo off
title Eat to Eat - Full React App
echo.
echo ========================================
echo   Eat to Eat - Full React Application
echo ========================================
echo.
echo Starting React development server...
echo.
echo This will show:
echo - Home page with search
echo - Location modal on first visit
echo - Nearby restaurants with distances
echo - Beautiful responsive design
echo.
echo Open your browser and go to:
echo http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0frontend"
npm run dev
