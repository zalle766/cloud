@echo off
title Eat to Eat - Frontend Development Server
echo.
echo ========================================
echo   Eat to Eat - Frontend Development
echo ========================================
echo.
echo Starting development server...
echo.
cd /d "%~dp0frontend"
npm run dev
echo.
echo Press any key to exit...
pause >nul
