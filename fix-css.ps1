# Fix CSS Issue - ABRAN System
# این اسکریپت مشکل CSS را رفع می‌کند

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Fixing CSS Issue..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# مرحله 1: توقف سرور (اگر در حال اجرا است)
Write-Host "[1/4] Stopping any running server..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "  ✅ Server stopped" -ForegroundColor Green
Write-Host ""

# مرحله 2: پاک کردن Vite cache
Write-Host "[2/4] Clearing Vite cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "  ✅ Vite cache cleared" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  No Vite cache found" -ForegroundColor Gray
}
Write-Host ""

# مرحله 3: پاک کردن dist folder
Write-Host "[3/4] Clearing dist folder..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "  ✅ Dist folder cleared" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  No dist folder found" -ForegroundColor Gray
}
Write-Host ""

# مرحله 4: راه‌اندازی مجدد سرور
Write-Host "[4/4] Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Server starting..." -ForegroundColor Green
Write-Host "  Open: http://localhost:3000" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: After server starts, press Ctrl+Shift+R in browser" -ForegroundColor Yellow
Write-Host "to clear browser cache and reload." -ForegroundColor Yellow
Write-Host ""

npm run dev
