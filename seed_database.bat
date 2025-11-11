@echo off
echo Adding sample data to database...
cd backend
php artisan db:seed --force
echo Sample data added successfully!
pause
