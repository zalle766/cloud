@echo off
echo ========================================
echo إضافة مجلد frontend إلى Git
echo ========================================
echo.

echo إضافة ملفات frontend الأساسية...
git add frontend/package.json
git add frontend/vite.config.js
git add frontend/tailwind.config.js
git add frontend/postcss.config.js
git add frontend/index.html
git add frontend/.gitignore

echo.
echo إضافة مجلد src...
git add frontend/src/

echo.
echo إضافة مجلد public...
git add frontend/public/

echo.
echo إضافة ملفات إضافية...
git add frontend/Dockerfile
git add frontend/nginx.conf

if exist "frontend\README.md" (
    git add frontend/README.md
)

echo.
echo ========================================
echo تم إضافة ملفات frontend إلى Git
echo ========================================
echo.
echo الآن قم بتنفيذ:
echo   git commit -m "Add frontend directory"
echo   git push
echo.
pause

