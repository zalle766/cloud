@echo off
echo ========================================
echo رفع ملفات frontend إلى GitHub
echo ========================================
echo.

echo الخطوة 1: إزالة frontend من Git index (إن كان موجوداً كحالة خاصة)...
git rm --cached -r frontend 2>nul

echo.
echo الخطوة 2: إضافة جميع ملفات frontend...
git add frontend/

echo.
echo الخطوة 3: التحقق من الملفات المضافة...
git status frontend/ --short | head -30

echo.
echo ========================================
echo تم إضافة ملفات frontend
echo ========================================
echo.
echo الخطوات التالية:
echo   1. git commit -m "Add frontend files"
echo   2. git push
echo.
echo ملاحظة: .gitignore سيستبعد تلقائياً:
echo   - frontend/dist/ (ملفات البناء)
echo   - frontend/node_modules/ (الحزم)
echo   - frontend/build/ (ملفات البناء البديلة)
echo.
echo سيتم رفع:
echo   - frontend/src/ (الكود المصدري)
echo   - frontend/public/ (الملفات الثابتة)
echo   - frontend/package.json (ملف التبعيات)
echo   - جميع ملفات الإعداد الأخرى
echo.
pause

