# سكريبت PowerShell لرفع المشروع كاملاً إلى GitHub
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "رفع المشروع كاملاً إلى GitHub" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "الخطوة 1: التحقق من حالة Git..." -ForegroundColor Yellow
git status --short | Select-Object -First 20

Write-Host ""
Write-Host "الخطوة 2: إضافة جميع الملفات الجديدة والمعدلة..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "الخطوة 3: التحقق من الملفات المضافة..." -ForegroundColor Yellow
$status = git status --short
if ($status) {
    $status | Select-Object -First 30
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "تم إضافة جميع الملفات" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "الخطوات التالية:" -ForegroundColor Yellow
    Write-Host "  1. git commit -m 'Update project files'" -ForegroundColor White
    Write-Host "  2. git push" -ForegroundColor White
} else {
    Write-Host "لا توجد ملفات جديدة أو معدلة للرفع" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "ملاحظة: .gitignore سيستبعد تلقائياً:" -ForegroundColor Cyan
Write-Host "  - node_modules/" -ForegroundColor Gray
Write-Host "  - dist/ و build/" -ForegroundColor Gray
Write-Host "  - .env files" -ForegroundColor Gray
Write-Host "  - ملفات النظام والIDE" -ForegroundColor Gray
Write-Host ""

