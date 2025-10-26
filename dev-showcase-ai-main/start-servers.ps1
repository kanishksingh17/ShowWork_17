# PowerShell script to start both servers
Write-Host "🚀 Starting ShowWork Development Servers..." -ForegroundColor Green

# Get the script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend Server
Write-Host "📡 Starting Backend Server on port 5001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ScriptDir\server'; node server.js"

# Wait 3 seconds for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "🌐 Starting Frontend Server on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ScriptDir'; npm run dev"

Write-Host "✅ Both servers are starting..." -ForegroundColor Green
Write-Host "📡 Backend: http://localhost:5001" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "💡 Check the new terminal windows for server status" -ForegroundColor Magenta
Write-Host "💡 Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
