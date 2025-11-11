@echo off
echo ========================================
echo    تشخيص مشكلة تسجيل المستخدم
echo ========================================
echo.

echo [1/6] فحص وجود Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js غير مثبت
    echo يرجى تثبيت Node.js من https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js مثبت
)

echo.
echo [2/6] فحص مجلد الخادم الخلفي...
if not exist backend (
    echo ❌ مجلد الخادم الخلفي غير موجود
    pause
    exit /b 1
) else (
    echo ✅ مجلد الخادم الخلفي موجود
)

echo.
echo [3/6] فحص مجلد الواجهة الأمامية...
if not exist frontend (
    echo ❌ مجلد الواجهة الأمامية غير موجود
    pause
    exit /b 1
) else (
    echo ✅ مجلد الواجهة الأمامية موجود
)

echo.
echo [4/6] فحص ملف server.js...
if not exist backend\server.js (
    echo ❌ ملف server.js غير موجود في مجلد الخادم الخلفي
    pause
    exit /b 1
) else (
    echo ✅ ملف server.js موجود
)

echo.
echo [5/6] فحص ملف UserRegistration.jsx...
if not exist frontend\src\user\UserRegistration.jsx (
    echo ❌ ملف UserRegistration.jsx غير موجود
    pause
    exit /b 1
) else (
    echo ✅ ملف UserRegistration.jsx موجود
)

echo.
echo [6/6] فحص ملف api.js...
if not exist frontend\src\services\api.js (
    echo ❌ ملف api.js غير موجود
    pause
    exit /b 1
) else (
    echo ✅ ملف api.js موجود
)

echo.
echo ========================================
echo           نتائج التشخيص
echo ========================================
echo.
echo جميع الملفات المطلوبة موجودة ✅
echo.
echo المشكلة المحتملة:
echo 1. الخادم الخلفي غير مشغل
echo 2. الواجهة الأمامية غير مشغلة
echo 3. مشكلة في قاعدة البيانات
echo 4. مشكلة في التكوين
echo.
echo الحلول المقترحة:
echo.
echo 1. تشغيل الخادم الخلفي:
echo    cd backend
echo    npm install
echo    npm start
echo.
echo 2. تشغيل الواجهة الأمامية (في نافذة جديدة):
echo    cd frontend
echo    npm install
echo    npm run dev
echo.
echo 3. فتح صفحة التسجيل:
echo    http://localhost:5173/user/register
echo.
pause




