# PowerShell script to create .env file
# سكريبت PowerShell لإنشاء ملف .env

$envContent = @"
VITE_SUPABASE_URL=https://rzwprzrwhcaaqcbponiw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6d3ByenJ3aGNhYXFjYnBvbml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjEyNjQsImV4cCI6MjA3ODA5NzI2NH0.GtcTByA3v7DTcbtIcUzOLJPSwFnlb2loq4Rr6XvSmfc
"@

if (Test-Path .env) {
    Write-Host "ملف .env موجود بالفعل!" -ForegroundColor Yellow
    Write-Host "هل تريد استبداله؟ (Y/N)" -ForegroundColor Yellow
    $replace = Read-Host
    if ($replace -ne "Y" -and $replace -ne "y") {
        Write-Host "تم الإلغاء." -ForegroundColor Red
        exit
    }
}

$envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline

Write-Host "✅ تم إنشاء ملف .env بنجاح!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️ مهم: يجب إعادة تشغيل خادم التطوير الآن!" -ForegroundColor Yellow
Write-Host "اضغط Ctrl+C لإيقاف الخادم، ثم npm run dev" -ForegroundColor Yellow
Write-Host ""
Read-Host "اضغط Enter للخروج"

