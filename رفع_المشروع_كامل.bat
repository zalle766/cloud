@echo off
echo ========================================
echo رفع المشروع كاملاً إلى GitHub
echo ========================================
echo.

echo الخطوة 1: التحقق من حالة Git...
git status --short | head -20

echo.
echo الخطوة 2: إضافة جميع الملفات الجديدة والمعدلة...
git add .

echo.
echo الخطوة 3: التحقق من الملفات المضافة...
git status --short | head -30

echo.
echo ========================================
echo تم إضافة جميع الملفات
echo ========================================
echo.
echo الخطوات التالية:
echo   1. git commit -m "Update project files"
echo   2. git push
echo.
echo ملاحظة: .gitignore سيستبعد تلقائياً:
echo   - node_modules/
echo   - dist/ و build/
echo   - .env files
echo   - ملفات النظام والIDE
echo.
pause

