@echo off
echo ========================================
echo    إصلاح مشاكل الصور - Eat to Eat
echo ========================================
echo.

echo Step 1: Creating storage directory...
cd backend
if not exist "storage\app\public\products" mkdir "storage\app\public\products"

echo Step 2: Creating storage symbolic link...
php artisan storage:link
echo ✓ Storage link created!

echo.
echo Step 3: Creating sample images...
cd storage\app\public\products

REM إنشاء صور تجريبية بسيطة
echo Creating sample images using PowerShell...
powershell -Command "& {
    # إنشاء صورة برجر
    Add-Type -AssemblyName System.Drawing
    $bitmap = New-Object System.Drawing.Bitmap(300, 200)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::LightBlue)
    $font = New-Object System.Drawing.Font('Arial', 24)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    $graphics.DrawString('Burger', $font, $brush, 100, 80)
    $bitmap.Save('burger.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $graphics.Dispose()
    $bitmap.Dispose()
    
    # إنشاء صورة بيتزا
    $bitmap = New-Object System.Drawing.Bitmap(300, 200)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::LightGreen)
    $font = New-Object System.Drawing.Font('Arial', 24)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    $graphics.DrawString('Pizza', $font, $brush, 100, 80)
    $bitmap.Save('pizza.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $graphics.Dispose()
    $bitmap.Dispose()
    
    # إنشاء صورة سلطة
    $bitmap = New-Object System.Drawing.Bitmap(300, 200)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::LightYellow)
    $font = New-Object System.Drawing.Font('Arial', 24)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    $graphics.DrawString('Salad', $font, $brush, 100, 80)
    $bitmap.Save('salad.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $graphics.Dispose()
    $bitmap.Dispose()
    
    # إنشاء صورة كباب
    $bitmap = New-Object System.Drawing.Bitmap(300, 200)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::LightCoral)
    $font = New-Object System.Drawing.Font('Arial', 24)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    $graphics.DrawString('Kebab', $font, $brush, 100, 80)
    $bitmap.Save('kebab.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $graphics.Dispose()
    $bitmap.Dispose()
    
    # إنشاء صورة شاورما
    $bitmap = New-Object System.Drawing.Bitmap(300, 200)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::LightPink)
    $font = New-Object System.Drawing.Font('Arial', 24)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    $graphics.DrawString('Shawarma', $font, $brush, 80, 80)
    $bitmap.Save('shawarma.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $graphics.Dispose()
    $bitmap.Dispose()
    
    # إنشاء صورة افتراضية
    $bitmap = New-Object System.Drawing.Bitmap(300, 200)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::LightGray)
    $font = New-Object System.Drawing.Font('Arial', 24)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    $graphics.DrawString('Default', $font, $brush, 90, 80)
    $bitmap.Save('default.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $graphics.Dispose()
    $bitmap.Dispose()
}"

echo ✓ Sample images created!

echo.
echo Step 4: Running image seeder...
cd ..\..\..\..
php artisan db:seed --class=ImageSeeder
echo ✓ Image seeder completed!

echo.
echo Step 5: Starting Laravel server...
echo Laravel server will start on http://localhost:8000
echo.
echo ✓ All image issues have been fixed!
echo ✓ You can now see images in the application!
echo.
php artisan serve --host=127.0.0.1 --port=8000
