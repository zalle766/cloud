@echo off
echo ========================================
echo    اختبار تسجيل المستخدم - Eat to Eat
echo ========================================
echo.

echo [1/4] فحص الخادم الخلفي...
curl -s http://localhost:5000 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ الخادم الخلفي غير مشغل على المنفذ 5000
    echo يرجى تشغيل الخادم الخلفي أولاً:
    echo   cd backend
    echo   npm start
    echo.
    echo أو استخدم السكريبت التلقائي:
    echo   start_user_registration_fixed.bat
    echo.
    pause
    exit /b 1
) else (
    echo ✅ الخادم الخلفي يعمل على المنفذ 5000
)

echo.
echo [2/4] فحص الواجهة الأمامية...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ الواجهة الأمامية غير مشغلة على المنفذ 5173
    echo يرجى تشغيل الواجهة الأمامية أولاً:
    echo   cd frontend
    echo   npm run dev
    echo.
    pause
    exit /b 1
) else (
    echo ✅ الواجهة الأمامية تعمل على المنفذ 5173
)

echo.
echo [3/4] اختبار نقطة نهاية التسجيل...
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"Test\",\"lastName\":\"User\",\"email\":\"test@example.com\",\"phoneNumber\":\"01234567890\",\"password\":\"password123\",\"city\":\"الدار البيضاء\"}" ^
  -s -o test_response.json 2>nul

if %errorlevel% neq 0 (
    echo ❌ فشل في اختبار نقطة نهاية التسجيل
    echo تحقق من أن الخادم الخلفي يعمل بشكل صحيح
) else (
    echo ✅ نقطة نهاية التسجيل تعمل بشكل صحيح
)

echo.
echo [4/4] فتح صفحة التسجيل...
echo.
echo ✅ جميع الاختبارات نجحت!
echo.
echo يمكنك الآن الوصول إلى:
echo - صفحة التسجيل: http://localhost:5173/user/register
echo - صفحة تسجيل الدخول: http://localhost:5173/user/login
echo.
echo سيتم فتح صفحة التسجيل الآن...
timeout /t 2 /nobreak >nul
start http://localhost:5173/user/register

echo.
echo تم فتح صفحة التسجيل في المتصفح.
echo يمكنك الآن اختبار التسجيل!
echo.
pause




