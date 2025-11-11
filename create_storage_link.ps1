# PowerShell script to create storage link
Set-Location "backend"
php artisan storage:link
Write-Host "Storage link created successfully!"
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
