@echo off
chcp 65001 >nul
title ABRAN System - Setup Script
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║     🚀 ABRAN SYSTEM - Setup and Launch Script           ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
echo [1/5] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Or run: winget install OpenJS.NodeJS.LTS
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo ✅ Node.js %NODE_VER% is installed

REM Check if Git is installed
echo.
echo [2/5] Checking Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/
    echo Or run: winget install Git.Git
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('git --version') do set GIT_VER=%%i
echo ✅ %GIT_VER% is installed

REM Clone repository
echo.
echo [3/5] Cloning repository...
if exist "package.json" (
    echo ⚠️  Repository already exists. Skipping clone...
) else (
    git clone https://github.com/majidmk55/cloud1 .
    if errorlevel 1 (
        echo ❌ Failed to clone repository!
        pause
        exit /b 1
    )
    echo ✅ Repository cloned successfully
)

REM Install dependencies
echo.
echo [4/5] Installing dependencies...
echo ⏳ This may take 1-3 minutes...
echo.
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies!
    echo.
    echo Try running: npm cache clean --force
    echo Then: npm install
    echo.
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully

REM Start dev server
echo.
echo [5/5] Starting development server...
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║     ✅ ABRAN SYSTEM is ready!                           ║
echo ║                                                          ║
echo ║     🌐 Open in browser: http://localhost:3000           ║
echo ║                                                          ║
echo ║     Press Ctrl+C to stop the server                     ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

call npm run dev

pause
