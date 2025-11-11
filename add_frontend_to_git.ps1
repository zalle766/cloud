# سكريبت لإضافة مجلد frontend إلى Git
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "إضافة مجلد frontend إلى Git" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# التحقق من وجود مجلد frontend
if (-not (Test-Path "frontend")) {
    Write-Host "خطأ: مجلد frontend غير موجود!" -ForegroundColor Red
    exit 1
}

Write-Host "إضافة ملفات frontend الأساسية..." -ForegroundColor Yellow
git add frontend/package.json
git add frontend/package-lock.json -ErrorAction SilentlyContinue
git add frontend/vite.config.js
git add frontend/tailwind.config.js
git add frontend/postcss.config.js
git add frontend/index.html
git add frontend/.gitignore

Write-Host "إضافة مجلد src..." -ForegroundColor Yellow
git add frontend/src/

Write-Host "إضافة مجلد public..." -ForegroundColor Yellow
git add frontend/public/

Write-Host "إضافة ملفات إضافية..." -ForegroundColor Yellow
if (Test-Path "frontend/Dockerfile") {
    git add frontend/Dockerfile
}
if (Test-Path "frontend/nginx.conf") {
    git add frontend/nginx.conf
}
if (Test-Path "frontend/README.md") {
    git add frontend/README.md
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "تم إضافة ملفات frontend إلى Git" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "الآن قم بتنفيذ:" -ForegroundColor Yellow
Write-Host "  git commit -m 'Add frontend directory'" -ForegroundColor White
Write-Host "  git push" -ForegroundColor White
Write-Host ""

