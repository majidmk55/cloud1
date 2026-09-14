# ═══════════════════════════════════════════════════════════
# ABRAN System - Simple HTTP Server (راه‌حل قطعی)
# این اسکریپت یک سرور HTTP ساده راه‌اندازی می‌کند
# ═══════════════════════════════════════════════════════════

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  ABRAN System - Simple HTTP Server                      ║" -ForegroundColor Cyan
Write-Host "║  راه‌حل قطعی برای مشکل CSS                              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# بررسی وجود پوشه dist
if (-not (Test-Path "dist")) {
    Write-Host "❌ پوشه dist وجود ندارد!" -ForegroundColor Red
    Write-Host "   ابتدا دستور 'npm run build' را اجرا کنید" -ForegroundColor Yellow
    exit 1
}

# بررسی وجود index.html
if (-not (Test-Path "dist\index.html")) {
    Write-Host "❌ فایل dist\index.html وجود ندارد!" -ForegroundColor Red
    exit 1
}

# بررسی فایل CSS
$cssFile = Get-ChildItem "dist\assets\*.css" -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $cssFile) {
    Write-Host "❌ فایل CSS در dist\assets یافت نشد!" -ForegroundColor Red
    exit 1
}

$sizeKB = [math]::Round($cssFile.Length / 1KB, 2)
Write-Host "✅ فایل CSS یافت شد: $($cssFile.Name) ($sizeKB KB)" -ForegroundColor Green
Write-Host ""

# توقف سرورهای قبلی
Write-Host "🔄 توقف سرورهای قبلی..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host ""

# اطلاعات سرور
$port = 8080
$url = "http://localhost:$port"

Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  🚀 سرور HTTP در حال راه‌اندازی...                      ║" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  📂 پوشه: dist                                          ║" -ForegroundColor Cyan
Write-Host "║  🌐 آدرس: $url                                    ║" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  ⚠️  دستورالعمل:                                        ║" -ForegroundColor Yellow
Write-Host "║     1. مرورگر را باز کنید                               ║" -ForegroundColor Yellow
Write-Host "║     2. به آدرس بالا بروید                               ║" -ForegroundColor Yellow
Write-Host "║     3. Ctrl+Shift+R بزنید (Hard Reload)                 ║" -ForegroundColor Yellow
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  ℹ️  برای توقف: Ctrl+C                                  ║" -ForegroundColor Gray
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# باز کردن مرورگر
Start-Process $url

# راه‌اندازی سرور HTTP ساده با Python
Write-Host "🔄 راه‌اندازی سرور HTTP..." -ForegroundColor Yellow
Write-Host ""

# بررسی Python
$pythonCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    $pythonCmd = "python3"
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $pythonCmd = "py"
}

if ($pythonCmd) {
    Write-Host "✅ Python یافت شد: $pythonCmd" -ForegroundColor Green
    Write-Host ""
    Set-Location dist
    & $pythonCmd -m http.server $port
} else {
    Write-Host "⚠️  Python یافت نشد. استفاده از npx serve..." -ForegroundColor Yellow
    Write-Host ""
    npx serve dist -l $port
}
