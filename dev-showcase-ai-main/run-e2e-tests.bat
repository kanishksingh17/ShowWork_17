@echo off
echo 🧠 PHASE 5: E2E System Validation
echo ===================================
echo.

echo Step 1: Checking Docker containers...
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo Step 2: Running E2E Integration Tests...
echo.

REM Set environment variables for testing
set API_URL=http://localhost:5001
set MONGO_URL=mongodb://admin:password123@localhost:27017/showwork?authSource=admin
set REDIS_URL=redis://localhost:6379

echo Environment configured:
echo - API_URL: %API_URL%
echo - MONGO_URL: %MONGO_URL%
echo - REDIS_URL: %REDIS_URL%
echo.

echo Running comprehensive E2E tests...
node scripts/test-e2e.mjs

echo.
echo ===================================
echo E2E testing complete!
echo.
pause
