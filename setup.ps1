# ═══════════════════════════════════════════════════════════
# ABRAN SYSTEM - Quick Setup Script (PowerShell)
# Prerequisites are already installed ✓
# ═══════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Cyan
Write-Host "║     🚀 ABRAN SYSTEM - Quick Setup                       ║" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clone repository
Write-Host "[1/3] " -ForegroundColor Cyan -NoNewline
Write-Host "Cloning repository..." -ForegroundColor White
if (Test-Path "package.json") {
    Write-Host "  ⚠️  Repository already exists. Pulling latest..." -ForegroundColor Yellow
    git pull origin main
} else {
    git clone https://github.com/majidmk55/cloud1 .
}
Write-Host "  ✅ Repository ready" -ForegroundColor Green
Write-Host ""

# Step 2: Install dependencies
Write-Host "[2/3] " -ForegroundColor Cyan -NoNewline
Write-Host "Installing dependencies..." -ForegroundColor White
Write-Host "  ⏳ This may take 1-3 minutes..." -ForegroundColor Gray
Write-Host ""
npm install
Write-Host ""
Write-Host "  ✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 3: Start dev server
Write-Host "[3/3] " -ForegroundColor Cyan -NoNewline
Write-Host "Starting development server..." -ForegroundColor White
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║     ✅ ABRAN SYSTEM is ready!                           ║" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║     🌐 Open in browser: http://localhost:3000           ║" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║     Press Ctrl+C to stop the server                     ║" -ForegroundColor Yellow
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

npm run dev
