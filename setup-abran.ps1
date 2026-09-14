# ABRAN System - Quick Setup Script
# این اسکریپت همه مراحل نصب را خودکار انجام می‌دهد

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ABRAN System - Setup Starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# مرحله 1: کلون ریپازیتوری
Write-Host "[1/3] Cloning repository..." -ForegroundColor Yellow
git clone https://github.com/majidmk55/cloud1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to clone repository" -ForegroundColor Red
    exit 1
}
Write-Host "Repository cloned successfully!" -ForegroundColor Green
Write-Host ""

# مرحله 2: تغییر دایرکتوری و نصب وابستگی‌ها
Write-Host "[2/3] Installing dependencies..." -ForegroundColor Yellow
Set-Location cloud1
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# مرحله 3: اجرای سرور
Write-Host "[3/3] Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Server starting at:" -ForegroundColor Green
Write-Host "  http://localhost:3000" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

npm run dev
