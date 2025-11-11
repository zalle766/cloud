@echo off
echo ========================================
echo جعل مجلد frontend عادي في Git
echo ========================================
echo.

echo الخطوة 1: إزالة frontend من Git index (إن كان موجوداً كحالة خاصة)...
git rm --cached -r frontend 2>nul

echo.
echo الخطوة 2: إضافة جميع ملفات frontend بشكل عادي...
git add frontend/

echo.
echo الخطوة 3: التحقق من الملفات المضافة...
git status frontend/ --short | head -30

echo.
echo ========================================
echo تم! الآن frontend مجلد عادي في Git
echo ========================================
echo.
echo الخطوات التالية:
echo   1. git commit -m "Add frontend directory"
echo   2. git push
echo.
echo ملاحظة: .gitignore سيستبعد تلقائياً:
echo   - frontend/dist/
echo   - frontend/node_modules/
echo   - frontend/build/
echo.
pause

