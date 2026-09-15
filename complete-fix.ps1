# ═══════════════════════════════════════════════════════════
# ABRAN System - Complete Fix (مشکل CSS را به طور کامل حل می‌کند)
# این اسکریپت همه چیز را از اول انجام می‌دهد
# ═══════════════════════════════════════════════════════════

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  ABRAN System - Complete Fix                            ║" -ForegroundColor Cyan
Write-Host "║  مشکل CSS را به طور کامل حل می‌کند                      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# مرحله 1: توقف تمام process های Node
Write-Host "[1/7] Stopping all Node processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "  ✅ Done" -ForegroundColor Green
Write-Host ""

# مرحله 2: پاک کردن کامل cache
Write-Host "[2/7] Clearing all caches..." -ForegroundColor Yellow
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "  ✅ Vite cache cleared" -ForegroundColor Green
}
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "  ✅ Dist folder cleared" -ForegroundColor Green
}
Write-Host ""

# مرحله 3: بررسی و اصلاح package.json
Write-Host "[3/7] Checking package.json..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
if (-not $packageJson.scripts.preview) {
    Write-Host "  ⚠️  Adding 'preview' script..." -ForegroundColor Yellow
    $content = Get-Content "package.json" -Raw
    $content = $content -replace '("build":\s*"vite build"),', '$1,
    "preview": "vite preview",'
    $content | Out-File "package.json" -Encoding UTF8 -NoNewline
    Write-Host "  ✅ Added 'preview' script" -ForegroundColor Green
} else {
    Write-Host "  ✅ 'preview' script exists" -ForegroundColor Green
}
Write-Host ""

# مرحله 4: Build پروژه
Write-Host "[4/7] Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Build successful" -ForegroundColor Green
Write-Host ""

# مرحله 5: بررسی فایل CSS
Write-Host "[5/7] Verifying CSS output..." -ForegroundColor Yellow
$cssFile = Get-ChildItem "dist\assets\*.css" | Select-Object -First 1
if ($cssFile) {
    $sizeKB = [math]::Round($cssFile.Length / 1KB, 2)
    Write-Host "  ✅ CSS file: $($cssFile.Name) ($sizeKB KB)" -ForegroundColor Green
    
    # بررسی محتوا
    $cssContent = Get-Content $cssFile.FullName -Raw
    if ($cssContent -match "tailwindcss") {
        Write-Host "  ✅ Tailwind CSS detected in output" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Tailwind CSS not found in output!" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ❌ No CSS file found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# مرحله 6: بررسی index.html
Write-Host "[6/7] Checking index.html..." -ForegroundColor Yellow
$indexHtml = Get-Content "dist\index.html" -Raw
if ($indexHtml -match 'rel="stylesheet"') {
    Write-Host "  ✅ CSS link found in index.html" -ForegroundColor Green
} else {
    Write-Host "  ❌ CSS link NOT found in index.html!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# مرحله 7: اجرای سرور
Write-Host "[7/7] Starting server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  ✅ ABRAN SYSTEM is ready!                              ║" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  🌐 Open in browser:                                     ║" -ForegroundColor Cyan
Write-Host "║     http://localhost:4173                                ║" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  ⚠️  IMPORTANT STEPS:                                   ║" -ForegroundColor Yellow
Write-Host "║     1. Open the URL above in your browser               ║" -ForegroundColor Yellow
Write-Host "║     2. Press Ctrl+Shift+R (Hard Reload)                 ║" -ForegroundColor Yellow
Write-Host "║     3. If still not working, try another browser        ║" -ForegroundColor Yellow
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  Press Ctrl+C to stop the server                        ║" -ForegroundColor Gray
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

npx vite preview --port 4173
