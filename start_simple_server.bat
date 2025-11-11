@echo off
title Eat to Eat - Simple Test Server
echo.
echo ========================================
echo   Eat to Eat - Simple Test Server
echo ========================================
echo.
echo Starting simple HTTP server...
echo.
echo Open your browser and go to:
echo http://localhost:3000/test.html
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0frontend"
python -m http.server 3000
