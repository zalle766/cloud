@echo off
echo ========================================
echo Quick Fix: Create Database Tables
echo ========================================
echo.
echo This script will create all required database tables.
echo Make sure MySQL is running in XAMPP first!
echo.
pause

cd backend

echo.
echo Step 1: Checking if .env file exists...
if not exist .env (
    echo ERROR: .env file not found!
    echo Please run setup_laravel_backend.bat first
    pause
    exit /b 1
)
echo .env file found!
echo.

echo Step 2: Testing database connection...
php artisan db:show
if errorlevel 1 (
    echo.
    echo ========================================
    echo DATABASE CONNECTION ERROR!
    echo ========================================
    echo.
    echo Please check:
    echo   1. MySQL is running in XAMPP Control Panel
    echo   2. Database 'eat_to_eat' exists
    echo      - Open phpMyAdmin: http://localhost/phpmyadmin
    echo      - Create database named: eat_to_eat
    echo      - Collation: utf8mb4_unicode_ci
    echo   3. .env file has correct database settings:
    echo      DB_DATABASE=eat_to_eat
    echo      DB_USERNAME=root
    echo      DB_PASSWORD=
    echo.
    pause
    exit /b 1
)
echo Database connection OK!
echo.

echo Step 3: Creating database tables...
php artisan migrate:fresh --force
if errorlevel 1 (
    echo.
    echo ERROR: Failed to create tables!
    echo Please check the error message above.
    pause
    exit /b 1
)
echo.
echo ========================================
echo SUCCESS! All tables created!
echo ========================================
echo.
echo You can now:
echo   1. Register new users at http://localhost:3000/customer/register
echo   2. Check phpMyAdmin to see the 'users' table
echo.
pause

