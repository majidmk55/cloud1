# ═══════════════════════════════════════════════════════════
# ABRAN System - Inline CSS Fix (راه‌حل نهایی)
# CSS را مستقیماً در index.html قرار می‌دهد
# ═══════════════════════════════════════════════════════════

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  ABRAN System - Inline CSS Fix                          ║" -ForegroundColor Cyan
Write-Host "║  CSS را مستقیماً در HTML قرار می‌دهد                    ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# مرحله 1: بررسی فایل‌ها
Write-Host "[1/4] Checking files..." -ForegroundColor Yellow

if (-not (Test-Path "dist\index.html")) {
    Write-Host "  ❌ dist\index.html not found!" -ForegroundColor Red
    Write-Host "  Running build first..." -ForegroundColor Yellow
    npm run build
}

$cssFile = Get-ChildItem "dist\assets\*.css" | Select-Object -First 1
if (-not $cssFile) {
    Write-Host "  ❌ CSS file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "  ✅ Found: $($cssFile.Name)" -ForegroundColor Green
Write-Host ""

# مرحله 2: خواندن CSS
Write-Host "[2/4] Reading CSS..." -ForegroundColor Yellow
$cssContent = Get-Content $cssFile.FullName -Raw
Write-Host "  ✅ CSS loaded ($($cssContent.Length) chars)" -ForegroundColor Green
Write-Host ""

# مرحله 3: خواندن HTML
Write-Host "[3/4] Reading HTML..." -ForegroundColor Yellow
$htmlContent = Get-Content "dist\index.html" -Raw
Write-Host "  ✅ HTML loaded" -ForegroundColor Green
Write-Host ""

# مرحله 4: Inline کردن CSS
Write-Host "[4/4] Inlining CSS into HTML..." -ForegroundColor Yellow

# حذف لینک CSS خارجی و اضافه کردن inline
$htmlContent = $htmlContent -replace '<link[^>]*rel="stylesheet"[^>]*>', ''

# اضافه کردن CSS به صورت inline قبل از </head>
$styleTag = "<style>`n$cssContent`n</style>"
$htmlContent = $htmlContent -replace '</head>', "$styleTag`n</head>"

# ذخیره فایل جدید
$htmlContent | Out-File "dist\index.html" -Encoding UTF8 -NoNewline

Write-Host "  ✅ CSS inlined successfully!" -ForegroundColor Green
Write-Host ""

# نتیجه
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  ✅ CSS با موفقیت در HTML قرار گرفت!                    ║" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  📂 فایل: dist\index.html                               ║" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  🎯 حالا می‌توانید فایل را مستقیماً باز کنید:           ║" -ForegroundColor Yellow
Write-Host "║     dist\index.html                                     ║" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  یا از سرور استفاده کنید:                               ║" -ForegroundColor Yellow
Write-Host "║     npx vite preview                                    ║" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# باز کردن فایل
Write-Host "🌐 باز کردن فایل در مرورگر..." -ForegroundColor Yellow
Start-Process "dist\index.html"
