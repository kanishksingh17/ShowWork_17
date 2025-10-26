@echo off
echo 🔍 ShowWork System Status Check
echo ================================
echo.

echo 📊 Container Status:
echo --------------------
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo 🔗 Network Connectivity:
echo ------------------------
echo Testing frontend (port 3000)...
curl -s -o nul -w "Frontend: %%{http_code}\n" http://localhost:3000 || echo "Frontend: Not responding"

echo Testing backend (port 5001)...
curl -s -o nul -w "Backend: %%{http_code}\n" http://localhost:5001/api/health || echo "Backend: Not responding"

echo.
echo 🗄️ Database Status:
echo -------------------
docker exec -it showwork-mongodb mongosh --eval "db.runCommand('ping')" 2>nul && echo "✅ MongoDB: Connected" || echo "❌ MongoDB: Not connected"

echo.
echo 📦 Redis Status:
echo ----------------
docker exec -it showwork-redis redis-cli ping 2>nul && echo "✅ Redis: Connected" || echo "❌ Redis: Not connected"

echo.
echo 👷 Worker Status:
echo -----------------
echo Publish Worker:
docker-compose logs publish-worker --tail=5 | findstr "listening\|ready\|error" || echo "No recent activity"

echo Analytics Worker:
docker-compose logs analytics-worker --tail=5 | findstr "active\|ready\|error" || echo "No recent activity"

echo.
echo 📈 Queue Status:
echo ---------------
docker exec -it showwork-redis redis-cli keys "*" 2>nul || echo "No queues found"

echo.
echo 🔧 System Resources:
echo ---------------------
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo.
echo 📋 Recent Logs (Last 10 lines):
echo --------------------------------
echo Backend logs:
docker-compose logs backend --tail=10

echo.
echo ================================
echo Status check complete!
echo.
pause
