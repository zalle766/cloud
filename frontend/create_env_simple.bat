@echo off
chcp 65001 >nul
echo ========================================
echo إنشاء ملف .env
echo ========================================
echo.

if exist .env (
    echo ملف .env موجود بالفعل!
    echo هل تريد استبداله؟ (Y/N)
    set /p replace="> "
    if /i not "%replace%"=="Y" (
        echo تم الإلغاء.
        pause
        exit /b
    )
    del .env
)

echo جاري إنشاء ملف .env...
echo.

(
echo # Supabase Configuration
echo VITE_SUPABASE_URL=https://rzwprzrwhcaaqcbponiw.supabase.co
echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6d3ByenJ3aGNhYXFjYnBvbml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjEyNjQsImV4cCI6MjA3ODA5NzI2NH0.GtcTByA3v7DTcbtIcUzOLJPSwFnlb2loq4Rr6XvSmfc
echo.
echo # Google Maps API ^(optional^)
echo VITE_GOOGLE_MAPS_API_KEY=
echo.
echo # App Configuration
echo VITE_APP_NAME=Eat to Eat
echo VITE_APP_URL=http://localhost:3000
) > .env

echo ✅ تم إنشاء ملف .env بنجاح!
echo.
echo ⚠️ مهم: يجب إعادة تشغيل خادم التطوير الآن!
echo اضغط Ctrl+C لإيقاف الخادم، ثم npm run dev
echo.
pause

