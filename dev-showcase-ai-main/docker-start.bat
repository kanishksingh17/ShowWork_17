@echo off
echo Starting ShowWork with Docker...

REM Check if Docker is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Copy environment file if it doesn't exist
if not exist .env (
    echo Creating .env file from docker.env.example...
    copy docker.env.example .env
    echo Please edit .env file with your OAuth credentials before running again.
    pause
    exit /b 1
)

REM Start the services
echo Starting Docker containers...
docker-compose up --build -d

echo.
echo ShowWork is starting up!
echo.
echo Services:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:5001
echo - MongoDB: localhost:27017
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
echo.
pause
