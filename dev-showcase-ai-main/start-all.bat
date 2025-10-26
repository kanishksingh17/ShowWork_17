@echo off
echo 🚀 Starting ShowWork Development Servers...
echo.

echo 📡 Starting Backend Server on port 5001...
start "Backend Server" cmd /k "cd /d %~dp0server && node server.js"

echo.
echo ⏳ Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo 🌐 Starting Frontend Server on port 3000...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ✅ Both servers are starting in separate windows...
echo 📡 Backend: http://localhost:5001
echo 🌐 Frontend: http://localhost:3000
echo.
echo 💡 Check the new terminal windows for server status
echo 💡 Press any key to close this window...
pause >nul
