@echo off
echo ========================================
echo Creating Database Tables for Eat to Eat
echo ========================================
echo.

cd backend

echo [1/3] Checking database connection...
php artisan db:show
if errorlevel 1 (
    echo ERROR: Cannot connect to database!
    echo Please make sure:
    echo   1. MySQL is running in XAMPP
    echo   2. Database 'eattoeat' exists
    echo   3. .env file is configured correctly
    pause
    exit /b 1
)
echo.

echo [2/3] Running database migrations...
php artisan migrate --force
if errorlevel 1 (
    echo ERROR: Migration failed!
    echo Please check the error message above.
    pause
    exit /b 1
)
echo.

echo [3/3] Verifying tables...
php artisan db:table users
if errorlevel 1 (
    echo WARNING: Users table might not exist
) else (
    echo SUCCESS: Users table exists!
)
echo.

echo ========================================
echo Database setup complete!
echo ========================================
echo.
echo All tables have been created successfully.
echo You can now register users.
echo.
pause

