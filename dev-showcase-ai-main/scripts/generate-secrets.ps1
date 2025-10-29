# PowerShell script to generate secure secrets for ShowWork production
# Usage: .\generate-secrets.ps1

Write-Host "🔐 Generating secure secrets for ShowWork production..." -ForegroundColor Cyan
Write-Host ""

Write-Host "==========================================" -ForegroundColor Yellow
Write-Host "SESSION_SECRET:" -ForegroundColor Green
$sessionSecret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
Write-Host $sessionSecret

Write-Host ""
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host "JWT_SECRET:" -ForegroundColor Green
$jwtSecret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
Write-Host $jwtSecret

Write-Host ""
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host "✅ Copy these values to your .env.production file" -ForegroundColor Green
Write-Host "✅ Also add them to Render Dashboard > Environment Variables" -ForegroundColor Green
Write-Host ""
