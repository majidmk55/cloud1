import { Terminal, Copy, CheckCircle2, AlertTriangle, FileCode, Play } from 'lucide-react';
import { useState } from 'react';

const scriptContent = `# ============================================================
# ABRAN SYSTEM - Setup Script
# فایل راه‌اندازی سیستم ابران
# نسخه: 1.0.0
# ============================================================

#Requires -Version 7.0
#Requires -RunAsAdministrator

param(
    [string]$Environment = "development",
    [string]$ProjectRoot = $PSScriptRoot,
    [switch]$SkipDocker,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# ─── رنگ‌ها و توابع کمکی ───────────────────────────────────
function Write-Step { param([string]$Step, [string]$Message)
    Write-Host "▶ [$Step] " -ForegroundColor Cyan -NoNewline
    Write-Host $Message -ForegroundColor White
}

function Write-Success { param([string]$Message)
    Write-Host "  ✅ $Message" -ForegroundColor Green
}

function Write-Warning { param([string]$Message)
    Write-Host "  ⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error { param([string]$Message)
    Write-Host "  ❌ $Message" -ForegroundColor Red
}

# ─── بررسی پیش‌نیازها ─────────────────────────────────────
Write-Step "1/8" "بررسی پیش‌نیازها..."

$prerequisites = @{
    "Node.js (>=18)" = { node --version 2>$null }
    "pnpm" = { pnpm --version 2>$null }
    "Docker" = { docker --version 2>$null }
    "Git" = { git --version 2>$null }
}

foreach ($prereq in $prerequisites.GetEnumerator()) {
    try {
        $version = & $prereq.Value
        Write-Success "$($prereq.Key): $version"
    } catch {
        Write-Error "$($prereq.Key) نصب نشده است!"
        exit 1
    }
}

# ─── نصب وابستگی‌ها ──────────────────────────────────────
Write-Step "2/8" "نصب وابستگی‌های پروژه..."
Set-Location $ProjectRoot
pnpm install --frozen-lockfile
Write-Success "وابستگی‌ها نصب شدند"

# ─── تنظیم متغیرهای محیطی ────────────────────────────────
Write-Step "3/8" "تنظیم متغیرهای محیطی..."

$envFile = ".env.$Environment"
if (-not (Test-Path $envFile)) {
    Copy-Item ".env.example" $envFile
    Write-Success "فایل $envFile از template ایجاد شد"
} else {
    Write-Success "فایل $envFile موجود است"
}

# ─── راه‌اندازی Docker ────────────────────────────────────
if (-not $SkipDocker) {
    Write-Step "4/8" "راه‌اندازی سرویس‌های Docker..."
    
    docker compose up -d postgres redis minio
    Write-Success "PostgreSQL, Redis, MinIO راه‌اندازی شدند"
    
    # انتظار برای آماده‌سازی
    Write-Step "4.1" "انتظار برای آماده‌سازی دیتابیس..."
    Start-Sleep -Seconds 5
    Write-Success "سرویس‌ها آماده هستند"
} else {
    Write-Warning "Docker رد شد (SkipDocker)"
}

# ─── ساخت دیتابیس ────────────────────────────────────────
Write-Step "5/8" "ساخت و migration دیتابیس..."

pnpm --filter @abran/db prisma generate
pnpm --filter @abran/db prisma db push
Write-Success "دیتابیس آماده است"

# ─── ساخت پروژه‌ها ───────────────────────────────────────
Write-Step "6/8" "Build پروژه‌ها..."
pnpm turbo build
Write-Success "تمام پروژه‌ها build شدند"

# ─── اجرای seed ──────────────────────────────────────────
Write-Step "7/8" "اجرای seed داده‌ها..."
pnpm --filter @abran/db prisma db seed
Write-Success "داده‌های اولیه وارد شدند"

# ─── خلاصه ───────────────────────────────────────────────
Write-Step "8/8" "خلاصه راه‌اندازی"
Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     ✅ ABRAN System آماده استفاده است    ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║  Frontend:  http://localhost:3000        ║" -ForegroundColor Cyan
Write-Host "║  API:       http://localhost:4000/api    ║" -ForegroundColor Cyan
Write-Host "║  Swagger:   http://localhost:4000/docs   ║" -ForegroundColor Cyan
Write-Host "║  MinIO:     http://localhost:9001        ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  برای شروع:" -ForegroundColor Yellow
Write-Host "    pnpm dev" -ForegroundColor White
`;

const steps = [
  {
    step: 1,
    title: 'ایجاد فایل',
    description: 'محتوای زیر را در فایل setup-abran.ps1 کپی کنید',
    icon: FileCode,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    step: 2,
    title: 'بررسی دسترسی',
    description: 'PowerShell را به صورت Administrator اجرا کنید',
    icon: AlertTriangle,
    color: 'from-amber-500 to-orange-500',
  },
  {
    step: 3,
    title: 'اجرای اسکریپت',
    description: 'دستور زیر را در ترمینال وارد کنید',
    icon: Play,
    color: 'from-emerald-500 to-green-500',
  },
  {
    step: 4,
    title: 'تأیید نصب',
    description: 'پس از اتمام، سرویس‌ها در آدرس‌های مشخص شده فعال هستند',
    icon: CheckCircle2,
    color: 'from-violet-500 to-purple-500',
  },
];

export function SetupScript() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-3">
          <Terminal className="w-10 h-10 text-emerald-400" />
          اسکریپت راه‌اندازی
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          روش انجام: محتوای زیر را در فایل <code className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-sm font-mono" dir="ltr">setup-abran.ps1</code> کپی کنید
          و مراحل زیر را دنبال نمایید.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((item) => (
          <div
            key={item.step}
            className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-5 hover:border-white/20 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs text-gray-500 mb-1">مرحله {item.step}</div>
            <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
            <p className="text-gray-400 text-xs leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Script Content */}
      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-sm text-gray-400 font-mono" dir="ltr">setup-abran.ps1</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition-all"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>کپی اسکریپت</span>
              </>
            )}
          </button>
        </div>
        <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre" dir="ltr">
            {scriptContent}
          </pre>
        </div>
      </div>

      {/* Run Command */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl border border-emerald-500/20 p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-emerald-400" />
          اجرای اسکریپت
        </h2>
        <div className="space-y-3">
          <div className="bg-[#050816] rounded-xl p-4 border border-white/5">
            <div className="text-xs text-gray-500 mb-2">حالت پیش‌فرض (Development):</div>
            <code className="text-sm text-emerald-300 font-mono" dir="ltr">
              .\setup-abran.ps1
            </code>
          </div>
          <div className="bg-[#050816] rounded-xl p-4 border border-white/5">
            <div className="text-xs text-gray-500 mb-2">با پارامترهای سفارشی:</div>
            <code className="text-sm text-emerald-300 font-mono" dir="ltr">
              .\setup-abran.ps1 -Environment production -SkipDocker
            </code>
          </div>
          <div className="bg-[#050816] rounded-xl p-4 border border-white/5">
            <div className="text-xs text-gray-500 mb-2">با خروجی کامل (Verbose):</div>
            <code className="text-sm text-emerald-300 font-mono" dir="ltr">
              .\setup-abran.ps1 -Verbose
            </code>
          </div>
        </div>
      </div>

      {/* Parameters Table */}
      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-4">پارامترهای اسکریپت</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right text-gray-400 font-medium py-3 px-4">پارامتر</th>
                <th className="text-right text-gray-400 font-medium py-3 px-4">نوع</th>
                <th className="text-right text-gray-400 font-medium py-3 px-4">پیش‌فرض</th>
                <th className="text-right text-gray-400 font-medium py-3 px-4">توضیحات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3 px-4"><code className="text-cyan-300 font-mono text-xs" dir="ltr">-Environment</code></td>
                <td className="py-3 px-4 text-gray-300">string</td>
                <td className="py-3 px-4"><code className="text-amber-300 font-mono text-xs">development</code></td>
                <td className="py-3 px-4 text-gray-400">محیط اجرایی (development, staging, production)</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code className="text-cyan-300 font-mono text-xs" dir="ltr">-ProjectRoot</code></td>
                <td className="py-3 px-4 text-gray-300">string</td>
                <td className="py-3 px-4"><code className="text-amber-300 font-mono text-xs">$PSScriptRoot</code></td>
                <td className="py-3 px-4 text-gray-400">مسیر ریشه پروژه</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code className="text-cyan-300 font-mono text-xs" dir="ltr">-SkipDocker</code></td>
                <td className="py-3 px-4 text-gray-300">switch</td>
                <td className="py-3 px-4"><code className="text-amber-300 font-mono text-xs">false</code></td>
                <td className="py-3 px-4 text-gray-400">رد کردن راه‌اندازی Docker</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code className="text-cyan-300 font-mono text-xs" dir="ltr">-Verbose</code></td>
                <td className="py-3 px-4 text-gray-300">switch</td>
                <td className="py-3 px-4"><code className="text-amber-300 font-mono text-xs">false</code></td>
                <td className="py-3 px-4 text-gray-400">نمایش خروجی کامل</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Post-setup Services */}
      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-4">سرویس‌های پس از نصب</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: 'Frontend (Next.js)', url: 'http://localhost:3000', color: 'text-blue-400' },
            { name: 'API Gateway', url: 'http://localhost:4000/api', color: 'text-emerald-400' },
            { name: 'Swagger Docs', url: 'http://localhost:4000/docs', color: 'text-violet-400' },
            { name: 'MinIO Console', url: 'http://localhost:9001', color: 'text-amber-400' },
            { name: 'PostgreSQL', url: 'localhost:5432', color: 'text-cyan-400' },
            { name: 'Redis', url: 'localhost:6379', color: 'text-red-400' },
          ].map((service) => (
            <div key={service.name} className="flex items-center justify-between bg-[#050816] rounded-xl p-3 border border-white/5">
              <span className="text-sm text-gray-300">{service.name}</span>
              <code className={`text-xs font-mono ${service.color}`} dir="ltr">{service.url}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl border border-amber-500/20 p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          رفع اشکال
        </h2>
        <div className="space-y-3">
          <div className="bg-[#050816] rounded-xl p-4 border border-white/5">
            <div className="text-sm text-amber-300 font-medium mb-1">خطای Execution Policy</div>
            <code className="text-xs text-gray-400 font-mono" dir="ltr">
              Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
            </code>
          </div>
          <div className="bg-[#050816] rounded-xl p-4 border border-white/5">
            <div className="text-sm text-amber-300 font-medium mb-1">Docker در حال اجرا نیست</div>
            <code className="text-xs text-gray-400 font-mono" dir="ltr">
              # Docker Desktop را باز کنید یا:{"\n"}wsl --install{"\n"}# سپس سیستم را ری‌استارت کنید
            </code>
          </div>
          <div className="bg-[#050816] rounded-xl p-4 border border-white/5">
            <div className="text-sm text-amber-300 font-medium mb-1">پورت اشغال است</div>
            <code className="text-xs text-gray-400 font-mono" dir="ltr">
              netstat -ano | findstr :3000{"\n"}taskkill /PID [PID] /F
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
