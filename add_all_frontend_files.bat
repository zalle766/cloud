@echo off
echo ========================================
echo إضافة جميع ملفات frontend إلى Git
echo ========================================
echo.

echo إزالة frontend من Git index إن كان موجوداً...
git rm --cached -r frontend 2>nul

echo.
echo إضافة جميع ملفات frontend بشكل صريح...
git add -f frontend/

echo.
echo التحقق من الملفات المضافة...
git status frontend/ --short

echo.
echo ========================================
echo تم إضافة ملفات frontend
echo ========================================
echo.
echo الآن قم بتنفيذ:
echo   git commit -m "Add all frontend files"
echo   git push
echo.
pause

