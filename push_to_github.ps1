Write-Host "Adding files to git..." -ForegroundColor Green
git add vercel.json
git add frontend

Write-Host "`nCommitting changes..." -ForegroundColor Green
git commit -m "Fix Vercel build configuration - update vercel.json"

Write-Host "`nPushing to GitHub..." -ForegroundColor Green
git push origin main

Write-Host "`nDone!" -ForegroundColor Green



