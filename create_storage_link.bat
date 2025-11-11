@echo off
echo Creating storage symbolic link...
cd backend
php artisan storage:link
echo Storage link created successfully!
pause
