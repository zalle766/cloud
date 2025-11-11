@echo off
chcp 65001 >nul
echo ========================================
echo إصلاح ملف .env - Fix .env File
echo ========================================
echo.

cd /d "%~dp0"

if exist .env (
    echo ملف .env موجود بالفعل!
    echo .env file already exists!
    echo.
    echo هل تريد استبداله؟ (Y/N)
    echo Do you want to replace it? (Y/N)
    set /p replace="> "
    if /i not "%replace%"=="Y" (
        echo تم الإلغاء. Cancelled.
        pause
        exit /b
    )
    del .env
    echo تم حذف الملف القديم. Old file deleted.
    echo.
)

echo جاري إنشاء ملف .env...
echo Creating .env file...
echo.

(
echo VITE_SUPABASE_URL=https://rzwprzrwhcaaqcbponiw.supabase.co
echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6d3ByenJ3aGNhYXFjYnBvbml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjEyNjQsImV4cCI6MjA3ODA5NzI2NH0.GtcTByA3v7DTcbtIcUzOLJPSwFnlb2loq4Rr6XvSmfc
) > .env

if exist .env (
    echo.
    echo ✅ تم إنشاء ملف .env بنجاح!
    echo ✅ .env file created successfully!
    echo.
    echo ⚠️ مهم جداً: يجب إعادة تشغيل خادم التطوير الآن!
    echo ⚠️ Very Important: You must restart the dev server now!
    echo.
    echo الخطوات:
    echo Steps:
    echo 1. اضغط Ctrl+C في Terminal لإيقاف الخادم
    echo     Press Ctrl+C in Terminal to stop the server
    echo 2. ثم شغّل: npm run dev
    echo     Then run: npm run dev
    echo.
) else (
    echo.
    echo ❌ فشل إنشاء الملف!
    echo ❌ Failed to create file!
    echo.
    echo يرجى إنشاء الملف يدوياً:
    echo Please create the file manually:
    echo 1. أنشئ ملف جديد باسم .env
    echo    Create a new file named .env
    echo 2. انسخ المحتوى من env_content.txt
    echo    Copy content from env_content.txt
    echo.
)

pause

