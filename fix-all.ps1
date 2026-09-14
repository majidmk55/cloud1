# ═══════════════════════════════════════════════════════════
# ABRAN System - Fix Script (اجرای این اسکریپت همه چیز را حل می‌کند)
# ═══════════════════════════════════════════════════════════

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  ABRAN System - Fix Script                              ║" -ForegroundColor Cyan
Write-Host "║  این اسکریپت مشکل CSS را به طور کامل رفع می‌کند         ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# مرحله 1: اصلاح package.json
Write-Host "[1/5] Fixing package.json..." -ForegroundColor Yellow

$packageJsonPath = "package.json"
if (Test-Path $packageJsonPath) {
    $content = Get-Content $packageJsonPath -Raw
    if ($content -notmatch '"preview"') {
        $content = $content -replace '"build": "vite build",', '"build": "vite build",
    "preview": "vite preview",'
        $content | Out-File $packageJsonPath -Encoding UTF8
        Write-Host "  ✅ Added 'preview' script to package.json" -ForegroundColor Green
    } else {
        Write-Host "  ℹ️  'preview' script already exists" -ForegroundColor Gray
    }
} else {
    Write-Host "  ❌ package.json not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# مرحله 2: پاک کردن cache
Write-Host "[2/5] Clearing caches..." -ForegroundColor Yellow

if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "  ✅ Vite cache cleared" -ForegroundColor Green
}
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "  ✅ Dist folder cleared" -ForegroundColor Green
}
Write-Host ""

# مرحله 3: Build مجدد
Write-Host "[3/5] Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Build successful" -ForegroundColor Green
Write-Host ""

# مرحله 4: بررسی فایل CSS
Write-Host "[4/5] Verifying CSS..." -ForegroundColor Yellow
$cssFiles = Get-ChildItem "dist\assets\*.css" -ErrorAction SilentlyContinue
if ($cssFiles) {
    foreach ($file in $cssFiles) {
        $sizeKB = [math]::Round($file.Length / 1KB, 2)
        Write-Host "  ✅ $($file.Name): $sizeKB KB" -ForegroundColor Green
    }
} else {
    Write-Host "  ❌ No CSS file found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# مرحله 5: اجرای سرور
Write-Host "[5/5] Starting preview server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  ✅ ABRAN SYSTEM is ready!                              ║" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  🌐 Open in browser: http://localhost:4173              ║" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  ⚠️  IMPORTANT: After opening, press Ctrl+Shift+R       ║" -ForegroundColor Yellow
Write-Host "║     to clear browser cache                               ║" -ForegroundColor Yellow
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  Press Ctrl+C to stop the server                        ║" -ForegroundColor Gray
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

npx vite preview
