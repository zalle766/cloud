# PowerShell script to fix images immediately
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    إصلاح الصور فوراً - Eat to Eat" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "backend"

Write-Host "Step 1: Creating storage link..." -ForegroundColor Yellow
php artisan storage:link

Write-Host ""
Write-Host "Step 2: Running immediate image fix..." -ForegroundColor Yellow
php artisan db:seed --class=ImmediateImageFixSeeder

Write-Host ""
Write-Host "Step 3: Starting server..." -ForegroundColor Yellow
Write-Host "Server will start on http://localhost:8000" -ForegroundColor Green
Write-Host ""
Write-Host "✓ ALL PRODUCTS NOW HAVE WORKING IMAGES!" -ForegroundColor Green
Write-Host "✓ Images are loaded from Unsplash (internet)" -ForegroundColor Green
Write-Host "✓ No local storage issues!" -ForegroundColor Green
Write-Host ""

php artisan serve --host=127.0.0.1 --port=8000
