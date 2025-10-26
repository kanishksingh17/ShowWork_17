@echo off
echo 🧠 PHASE 5: E2E System Validation (Docker)
echo ============================================
echo.

echo Step 1: Checking Docker containers...
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo Step 2: Running E2E tests inside backend container...
echo.

REM Run the E2E test inside the backend container
docker exec -it showwork-backend node scripts/test-e2e.mjs

echo.
echo ============================================
echo E2E testing complete!
echo.
pause
