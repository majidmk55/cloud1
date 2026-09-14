# ═══════════════════════════════════════════════════════════
# ABRAN System - Diagnostic & Fix Script
# این اسکریپت مشکل را تشخیص داده و رفع می‌کند
# ═══════════════════════════════════════════════════════════

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  ABRAN System - Diagnostic & Fix                       ║" -ForegroundColor Cyan
Write-Host "║  تشخیص و رفع خودکار مشکلات                             ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# مرحله 1: توقف سرورهای قبلی
Write-Host "[1/7] Stopping any running servers..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "  ✅ Done" -ForegroundColor Green
Write-Host ""

# مرحله 2: پاک کردن cache
Write-Host "[2/7] Clearing Vite cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "  ✅ Vite cache cleared" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  No cache found" -ForegroundColor Gray
}
Write-Host ""

# مرحله 3: بررسی فایل‌های کلیدی
Write-Host "[3/7] Checking critical files..." -ForegroundColor Yellow

$filesToCheck = @(
    @{ Path = "src/main.tsx"; Description = "Entry point" },
    @{ Path = "src/index.css"; Description = "CSS entry" },
    @{ Path = "src/App.tsx"; Description = "Main app component" },
    @{ Path = "vite.config.js"; Description = "Vite configuration" },
    @{ Path = "index.html"; Description = "HTML template" }
)

$allFilesExist = $true
foreach ($file in $filesToCheck) {
    if (Test-Path $file.Path) {
        Write-Host "  ✅ $($file.Description): $($file.Path)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ MISSING: $($file.Path)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "  ❌ Some critical files are missing!" -ForegroundColor Red
    Write-Host "  Please re-clone the repository:" -ForegroundColor Yellow
    Write-Host "  git clone https://github.com/majidmk55/cloud1" -ForegroundColor Cyan
    exit 1
}
Write-Host ""

# مرحله 4: بررسی محتوای فایل‌ها
Write-Host "[4/7] Verifying file contents..." -ForegroundColor Yellow

# بررسی main.tsx
$mainTsx = Get-Content "src/main.tsx" -Raw
if ($mainTsx -match 'import.*index\.css') {
    Write-Host "  ✅ main.tsx imports CSS" -ForegroundColor Green
} else {
    Write-Host "  ❌ main.tsx does NOT import CSS!" -ForegroundColor Red
}

# بررسی index.css
$indexCss = Get-Content "src/index.css" -Raw
if ($indexCss -match '@import.*tailwindcss') {
    Write-Host "  ✅ index.css uses Tailwind v4 syntax" -ForegroundColor Green
} else {
    Write-Host "  ❌ index.css does NOT use Tailwind v4!" -ForegroundColor Red
}

# بررسی vite.config.js
$viteConfig = Get-Content "vite.config.js" -Raw
if ($viteConfig -match '@tailwindcss/vite') {
    Write-Host "  ✅ vite.config.js has Tailwind plugin" -ForegroundColor Green
} else {
    Write-Host "  ❌ vite.config.js missing Tailwind plugin!" -ForegroundColor Red
}

# بررسی App.tsx - صفحه پیش‌فرض
$appTsx = Get-Content "src/App.tsx" -Raw
if ($appTsx -match "useState<Page>\('overview'\)") {
    Write-Host "  ✅ App.tsx defaults to 'overview' page" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  App.tsx may not default to 'overview'" -ForegroundColor Yellow
    Write-Host "     Fixing..." -ForegroundColor Yellow
    $appTsx = $appTsx -replace "useState<Page>\('[^']+'\)", "useState<Page>('overview')"
    $appTsx | Out-File "src/App.tsx" -Encoding UTF8 -NoNewline
    Write-Host "  ✅ Fixed: App.tsx now defaults to 'overview'" -ForegroundColor Green
}
Write-Host ""

# مرحله 5: Build پروژه
Write-Host "[5/7] Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Build successful" -ForegroundColor Green
Write-Host ""

# مرحله 6: بررسی خروجی
Write-Host "[6/7] Verifying build output..." -ForegroundColor Yellow

if (-not (Test-Path "dist\index.html")) {
    Write-Host "  ❌ dist/index.html not found!" -ForegroundColor Red
    exit 1
}

$cssFiles = Get-ChildItem "dist\assets\*.css" -ErrorAction SilentlyContinue
if ($cssFiles) {
    foreach ($css in $cssFiles) {
        $sizeKB = [math]::Round($css.Length / 1KB, 2)
        Write-Host "  ✅ CSS: $($css.Name) ($sizeKB KB)" -ForegroundColor Green
    }
} else {
    Write-Host "  ❌ No CSS files in dist/assets!" -ForegroundColor Red
}

$jsFiles = Get-ChildItem "dist\assets\*.js" -ErrorAction SilentlyContinue
if ($jsFiles) {
    foreach ($js in $jsFiles) {
        $sizeKB = [math]::Round($js.Length / 1KB, 2)
        Write-Host "  ✅ JS: $($js.Name) ($sizeKB KB)" -ForegroundColor Green
    }
} else {
    Write-Host "  ❌ No JS files in dist/assets!" -ForegroundColor Red
}
Write-Host ""

# مرحله 7: اجرای سرور
Write-Host "[7/7] Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  ✅ ABRAN SYSTEM is ready!                              ║" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  🌐 Open in browser: http://localhost:3000              ║" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  📋 IMPORTANT STEPS:                                    ║" -ForegroundColor Yellow
Write-Host "║     1. Open the URL above                               ║" -ForegroundColor Yellow
Write-Host "║     2. Press Ctrl+Shift+R (Hard Reload)                 ║" -ForegroundColor Yellow
Write-Host "║     3. Open DevTools (F12) → Console tab                ║" -ForegroundColor Yellow
Write-Host "║     4. Look for [ABRAN BOOT] messages                   ║" -ForegroundColor Yellow
Write-Host "║     5. If you see errors, copy them and share           ║" -ForegroundColor Yellow
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  🔍 Diagnostic Commands (in browser console):           ║" -ForegroundColor Cyan
Write-Host "║     console.log(window.__ABRAN_ERRORS__)                ║" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  Press Ctrl+C to stop the server                        ║" -ForegroundColor Gray
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

npm run dev
