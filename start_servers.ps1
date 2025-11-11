# Start Eat to Eat Servers
Write-Host "Starting Eat to Eat servers..." -ForegroundColor Green

Write-Host "`nStarting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; php artisan serve" -WindowStyle Normal

Write-Host "`nWaiting 3 seconds before starting frontend..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "`nStarting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal

Write-Host "`nBoth servers are starting..." -ForegroundColor Green
Write-Host "Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
