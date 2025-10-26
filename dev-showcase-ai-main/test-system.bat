@echo off
echo 🧩 PHASE 4: Full System Bring-Up Testing
echo ==========================================
echo.

echo Step 1: Starting Docker containers...
docker-compose up --build -d

echo.
echo Waiting for services to start...
timeout /t 30 /nobreak >nul

echo.
echo Step 2: Checking container status...
docker ps

echo.
echo Step 3: Testing database connection...
docker exec -it showwork-backend node -e "console.log('Testing MongoDB connection...'); import('./src/config/db.js').then(m=>m.connectDB()).then(()=>console.log('✅ MongoDB Connected Successfully')).catch(e=>console.error('❌ MongoDB Error:', e.message))"

echo.
echo Step 4: Testing Redis connection...
docker exec -it showwork-backend node -e "console.log('Testing Redis connection...'); import('bullmq').then(({Queue})=> new Queue('test', { connection: { host:'redis', port:6379 } }).add('ping',{}).then(()=>console.log('✅ Redis OK')).catch(e=>console.error('❌ Redis Error:', e.message))"

echo.
echo Step 5: Testing AI post generation...
docker exec -it showwork-backend node -e "console.log('Testing AI post generation...'); import('./src/lib/workers/postGenerator.js').then(m=>m.generatePost({projectTitle:'AI Portfolio', description:'An AI-powered project showcase app'})).then(console.log).catch(e=>console.error('❌ AI Generation Error:', e.message))"

echo.
echo Step 6: Testing scheduled post API...
curl -X POST http://localhost:5001/api/calendar/schedule -H "Content-Type: application/json" -d "{\"projectId\":\"demo123\",\"platforms\":[\"twitter\",\"linkedin\"],\"content\":\"Excited to showcase my new AI-powered app!\",\"scheduledAt\":\"2025-10-25T18:00:00Z\",\"userId\":\"user123\"}"

echo.
echo Step 7: Testing analytics webhook...
curl -X POST http://localhost:5001/api/webhooks/platform/linkedin -H "Content-Type: application/json" -d "{\"postId\":\"abc123\",\"likes\":20,\"views\":250,\"comments\":5,\"userId\":\"user123\",\"projectId\":\"demo123\"}"

echo.
echo Step 8: Checking Redis queue...
docker exec -it showwork-redis redis-cli keys "*"

echo.
echo Step 9: Viewing container logs...
echo Frontend logs:
docker-compose logs frontend --tail=10

echo.
echo Backend logs:
docker-compose logs backend --tail=10

echo.
echo Publish Worker logs:
docker-compose logs publish-worker --tail=10

echo.
echo Analytics Worker logs:
docker-compose logs analytics-worker --tail=10

echo.
echo ==========================================
echo 🎉 System testing complete!
echo.
echo Access points:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:5001
echo - MongoDB: localhost:27017
echo - Redis: localhost:6379
echo.
echo To view real-time logs: docker-compose logs -f
echo To stop all services: docker-compose down
echo.
pause
