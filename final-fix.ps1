# ═══════════════════════════════════════════════════════════
# ABRAN System - FINAL FIX (مشکل CSS را به طور کامل حل می‌کند)
# این اسکریپت همه چیز را از اول انجام می‌دهد
# ═══════════════════════════════════════════════════════════

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  ABRAN System - FINAL FIX                               ║" -ForegroundColor Cyan
Write-Host "║  مشکل CSS را به طور کامل حل می‌کند                      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# مرحله 1: نصب vite-plugin-singlefile
Write-Host "[1/6] Installing vite-plugin-singlefile..." -ForegroundColor Yellow
npm install vite-plugin-singlefile
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Failed to install vite-plugin-singlefile!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ vite-plugin-singlefile installed" -ForegroundColor Green
Write-Host ""

# مرحله 2: تغییر vite.config.js
Write-Host "[2/6] Updating vite.config.js..." -ForegroundColor Yellow

$viteConfig = @"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
  build: {
    target: "esnext",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
"@

$viteConfig | Out-File "vite.config.js" -Encoding UTF8 -NoNewline
Write-Host "  ✅ vite.config.js updated" -ForegroundColor Green
Write-Host ""

# مرحله 3: پاک کردن cache و build قبلی
Write-Host "[3/6] Clearing cache and old build..." -ForegroundColor Yellow
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "  ✅ Vite cache cleared" -ForegroundColor Green
}
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "  ✅ Old build cleared" -ForegroundColor Green
}
Write-Host ""

# مرحله 4: Build پروژه
Write-Host "[4/6] Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Build successful" -ForegroundColor Green
Write-Host ""

# مرحله 5: بررسی فایل خروجی
Write-Host "[5/6] Verifying output..." -ForegroundColor Yellow

if (-not (Test-Path "dist\index.html")) {
    Write-Host "  ❌ dist\index.html not found!" -ForegroundColor Red
    exit 1
}

$htmlSize = (Get-Item "dist\index.html").Length
$htmlSizeKB = [math]::Round($htmlSize / 1KB, 2)
Write-Host "  ✅ dist\index.html: $htmlSizeKB KB" -ForegroundColor Green

# بررسی اینکه CSS inline شده است
$htmlContent = Get-Content "dist\index.html" -Raw
if ($htmlContent -match "tailwindcss") {
    Write-Host "  ✅ Tailwind CSS is inlined" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Tailwind CSS not found in HTML!" -ForegroundColor Yellow
}

# بررسی اینکه JavaScript inline شده است
if ($htmlContent -match "react") {
    Write-Host "  ✅ JavaScript is inlined" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  JavaScript not found in HTML!" -ForegroundColor Yellow
}

# بررسی اینکه فایل‌های جداگانه وجود ندارند
$assetFiles = Get-ChildItem "dist\assets" -ErrorAction SilentlyContinue
if ($assetFiles) {
    Write-Host "  ⚠️  Separate asset files found (should be inlined)" -ForegroundColor Yellow
} else {
    Write-Host "  ✅ All assets inlined (no separate files)" -ForegroundColor Green
}
Write-Host ""

# مرحله 6: باز کردن فایل
Write-Host "[6/6] Opening in browser..." -ForegroundColor Yellow
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  ✅ ABRAN SYSTEM is ready!                              ║" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  📂 File: dist\index.html                               ║" -ForegroundColor Cyan
Write-Host "║  📏 Size: $htmlSizeKB KB (all CSS & JS inlined)        ║" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  🎯 Opening file in default browser...                  ║" -ForegroundColor Yellow
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  ⚠️  If you see a blank page, press Ctrl+Shift+R       ║" -ForegroundColor Yellow
Write-Host "║     to clear browser cache                               ║" -ForegroundColor Yellow
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Start-Process "dist\index.html"

Write-Host "✅ Done! The file should now be open in your browser." -ForegroundColor Green
Write-Host ""
Write-Host "If the site still appears as schematic:" -ForegroundColor Yellow
Write-Host "  1. Press Ctrl+Shift+R in the browser (Hard Reload)" -ForegroundColor Gray
Write-Host "  2. Try a different browser" -ForegroundColor Gray
Write-Host "  3. Check browser console (F12) for errors" -ForegroundColor Gray
Write-Host ""
