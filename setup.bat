@echo off
REM Quick Start Script for Thư Viện Gia Đình (Windows)

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║   📚 Thư Viện Gia Đình - Quick Start (Windows)    ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found
    echo Please install from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js installed
echo.

REM Setup Backend
echo 🔧 Setting up Backend...
cd backend
if not exist ".env" (
    copy .env.example .env
    echo ⚠️  Created .env file - please update with your values!
)
call npm install
echo ✅ Backend setup complete
echo.

REM Setup Frontend
echo 🎨 Setting up Frontend...
cd ../frontend
if not exist ".env" (
    copy .env.example .env
    echo ✅ Created .env file
)
call npm install
echo ✅ Frontend setup complete
echo.

echo ════════════════════════════════════════════════════
echo ✨ Setup Complete!
echo ════════════════════════════════════════════════════
echo.
echo To start developing:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then visit: http://localhost:3000
echo.
echo 📝 Remember to:
echo   1. Update backend\.env with MongoDB credentials
echo   2. Check frontend\.env for API URL
echo   3. Read README.md for full setup guide
echo.
pause
