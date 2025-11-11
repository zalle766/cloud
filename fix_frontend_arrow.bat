@echo off
echo ========================================
echo إصلاح مشكلة السهم في مجلد frontend
echo ========================================
echo.

echo السبب: المجلد موجود في Git لكن الملفات داخله غير متتبعة
echo.

echo إزالة frontend من Git index...
git rm --cached -r frontend 2>nul

echo.
echo إضافة جميع ملفات frontend بشكل صريح...
git add -f frontend/

echo.
echo التحقق من الملفات المضافة...
git status frontend/ --short | head -20

echo.
echo ========================================
echo تم إضافة ملفات frontend
echo ========================================
echo.
echo الآن قم بتنفيذ:
echo   git commit -m "Add all frontend files"
echo   git push
echo.
echo بعد الرفع، السهم سيختفي من IDE
echo.
pause

