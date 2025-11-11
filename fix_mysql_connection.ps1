# إصلاح ملف .env لاستخدام MySQL بدلاً من SQLite
Write-Host "إصلاح ملف .env لاستخدام MySQL..." -ForegroundColor Green

# نسخ ملف .env الصحيح
Copy-Item "env_mysql.txt" "backend\.env" -Force

Write-Host "تم إنشاء ملف .env بنجاح!" -ForegroundColor Green

# الانتقال لمجلد Laravel
Set-Location backend

Write-Host "إنشاء مفتاح التطبيق..." -ForegroundColor Yellow
php artisan key:generate

Write-Host "تشغيل migrations..." -ForegroundColor Yellow
php artisan migrate --force

Write-Host "إدراج البيانات التجريبية..." -ForegroundColor Yellow
php artisan db:seed --force

Write-Host "إنشاء رابط التخزين..." -ForegroundColor Yellow
php artisan storage:link

Write-Host "تم إعداد Laravel مع MySQL بنجاح!" -ForegroundColor Green
Write-Host "تشغيل خادم Laravel..." -ForegroundColor Cyan

php artisan serve --host=0.0.0.0 --port=8000
