@echo off
echo ========================================
echo إصلاح مشكلة frontend في Git
echo ========================================
echo.

echo إزالة frontend من Git index (إن كان موجوداً كـ submodule)...
git rm --cached frontend 2>nul

echo.
echo إضافة ملفات frontend بشكل صريح...
git add -f frontend/package.json
git add -f frontend/package-lock.json
git add -f frontend/vite.config.js
git add -f frontend/tailwind.config.js
git add -f frontend/postcss.config.js
git add -f frontend/index.html
git add -f frontend/.gitignore

echo.
echo إضافة مجلد src...
git add -f frontend/src/

echo.
echo إضافة مجلد public...
git add -f frontend/public/

echo.
echo إضافة ملفات إضافية...
git add -f frontend/Dockerfile
git add -f frontend/nginx.conf
git add -f frontend/README.md

echo.
echo ========================================
echo تم إضافة ملفات frontend
echo ========================================
echo.
echo الآن قم بتنفيذ:
echo   git commit -m "Add frontend directory"
echo   git push
echo.
pause

