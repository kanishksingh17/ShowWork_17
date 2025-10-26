@echo off
echo 🔧 ShowWork Environment Setup
echo =============================
echo.

echo Creating .env file for your ShowWork application...
echo.

REM Create .env file with template
(
echo # ShowWork Environment Configuration
echo # ==========================================
echo.
echo # --- DATABASES ---
echo DATABASE_URL=mongodb+srv://showwork_admin:StrongPassword123!@cluster0.xxxxx.mongodb.net/showwork?retryWrites=true^&w=majority
echo REDIS_URL=rediss://default:^<YOUR_PASSWORD^>@apn1-upstash.io:12345
echo.
echo # --- GITHUB OAUTH ---
echo GITHUB_CLIENT_ID=your-github-client-id-here
echo GITHUB_CLIENT_SECRET=your-github-client-secret-here
echo.
echo # --- GOOGLE OAUTH ---
echo GOOGLE_CLIENT_ID=your-google-client-id-here
echo GOOGLE_CLIENT_SECRET=your-google-client-secret-here
echo.
echo # --- SERVER CONFIG ---
echo PORT=5001
echo NODE_ENV=development
echo JWT_SECRET=showwork-super-secret-jwt-key-2024-change-this-in-production
echo SESSION_SECRET=showwork-super-secret-session-key-2024-change-this-in-production
echo FRONTEND_URL=http://localhost:3000
echo BACKEND_URL=http://localhost:5001
echo.
echo # --- AI CONFIGURATION ---
echo OPENAI_API_KEY=your-openai-api-key-here
echo.
echo # --- CORS CONFIG ---
echo CORS_ORIGIN=http://localhost:3000
echo.
echo # --- DEVELOPMENT SETTINGS ---
echo DEBUG=true
echo LOG_LEVEL=debug
) > .env

echo ✅ .env file created successfully!
echo.
echo 🔧 Next steps:
echo 1. Edit .env file with your actual credentials
echo 2. Replace placeholder values with real ones:
echo    - DATABASE_URL: Your MongoDB connection string
echo    - REDIS_URL: Your Upstash Redis connection string
echo    - GITHUB_CLIENT_ID: Your GitHub OAuth client ID
echo    - GITHUB_CLIENT_SECRET: Your GitHub OAuth client secret
echo    - GOOGLE_CLIENT_ID: Your Google OAuth client ID
echo    - GOOGLE_CLIENT_SECRET: Your Google OAuth client secret
echo    - OPENAI_API_KEY: Your OpenAI API key
echo.
echo 3. Save the file and restart your application
echo.
pause
