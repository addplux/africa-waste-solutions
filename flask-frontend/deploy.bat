@echo off
REM Deploy to Vercel Script for Windows

echo 🚀 Deploying Flask App to Vercel...
echo.

REM Check if vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Vercel CLI is not installed.
    echo 📦 Installing Vercel CLI globally...
    call npm install -g vercel
)

echo 📁 Current directory: flask-frontend
cd /d "%~dp0"

echo.
echo ⚙️  Important: Make sure you have configured environment variables:
echo    - SECRET_KEY
echo    - BACKEND_API_URL
echo.
echo 🔑 Starting deployment...
echo.

REM Deploy to Vercel
call vercel --prod

echo.
echo ✅ Deployment complete!
echo 🌐 Your app should now be live on Vercel
echo.
echo 📝 Don't forget to:
echo    1. Configure environment variables in Vercel dashboard
echo    2. Deploy your backend API
echo    3. Test all functionality
echo.
pause
