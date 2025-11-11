@echo off
echo Creating sample images in storage...

cd backend\storage\app\public\products

echo Creating sample image files...

REM إنشاء ملفات صور تجريبية باستخدام PowerShell
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
}"

echo Sample images created successfully!
echo.
echo Now creating storage link...
cd ..\..\..\..
php artisan storage:link
echo Storage link created!
echo.
echo Running image seeder...
php artisan db:seed --class=ImageSeeder
echo Image seeder completed!
echo.
echo Press any key to continue...
pause
