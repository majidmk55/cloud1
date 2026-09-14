import { useState, useEffect, useCallback } from 'react';
import {
  Terminal, Copy, CheckCircle2, AlertTriangle, Play, Pause, RotateCcw,
  Server, Database, GitBranch, Package, Shield, Globe, Clock,
  ChevronDown, ChevronUp, Download, Monitor, Cpu, HardDrive,
  Zap, Check, X, Loader2, FolderTree, FileCode, Settings
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
type PhaseStatus = 'pending' | 'running' | 'completed' | 'error';
type OS = 'linux' | 'macos' | 'windows';

interface PhaseStep {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  commands: string[];
  status: PhaseStatus;
  output: string[];
  duration: number;
}

interface Phase {
  id: number;
  title: string;
  titleEn: string;
  icon: any;
  color: string;
  steps: PhaseStep[];
  status: PhaseStatus;
}

// ─── Scripts ─────────────────────────────────────────────────
const powershellScript = `# ═══════════════════════════════════════════════════════════
# ABRAN SYSTEM - Autonomous Setup & Deployment Script
# Repository: https://github.com/majidmk55/cloud1
# Version: 1.0.0 | PowerShell 7+
# ═══════════════════════════════════════════════════════════

#Requires -Version 7.0

param(
    [string]$ProjectDir = "$HOME\\abran-datacenter-system",
    [string]$RepoUrl = "https://github.com/majidmk55/cloud1",
    [switch]$SkipDeps,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# ─── Helper Functions ────────────────────────────────────────
function Write-Phase {
    param([int]$Num, [string]$Title)
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  Phase $Num : $Title" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Cyan
}

function Write-Step {
    param([string]$Msg)
    Write-Host "  ▶ $Msg" -ForegroundColor White
}

function Write-OK   { param([string]$Msg) Write-Host "    ✅ $Msg" -ForegroundColor Green }
function Write-Warn { param([string]$Msg) Write-Host "    ⚠️  $Msg" -ForegroundColor Yellow }
function Write-Err  { param([string]$Msg) Write-Host "    ❌ $Msg" -ForegroundColor Red; exit 1 }

# ═══════════════════════════════════════════════════════════
# PHASE 1: System Prerequisites
# ═══════════════════════════════════════════════════════════
Write-Phase 1 "System Prerequisites & Dependencies"

Write-Step "Detecting OS..."
$osInfo = [System.Environment]::OSVersion
Write-OK "OS: $($osInfo.VersionString)"

# Check Git
Write-Step "Checking Git..."
try {
    $gitVer = git --version
    Write-OK "Git: $gitVer"
} catch { Write-Err "Git not found. Install from https://git-scm.com" }

# Check Node.js
Write-Step "Checking Node.js..."
try {
    $nodeVer = node --version
    Write-OK "Node.js: $nodeVer"
} catch {
    Write-Warn "Node.js not found. Installing via winget..."
    winget install OpenJS.NodeJS.LTS --accept-package-agreements
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    Write-OK "Node.js installed"
}

# Check npm/pnpm
Write-Step "Checking package manager..."
try {
    $pnpmVer = pnpm --version
    Write-OK "pnpm: $pnpmVer"
} catch {
    Write-Warn "pnpm not found. Installing..."
    npm install -g pnpm
    Write-OK "pnpm installed"
}

# Check Docker
Write-Step "Checking Docker..."
try {
    $dockerVer = docker --version
    Write-OK "Docker: $dockerVer"
} catch {
    Write-Warn "Docker not found. Skipping (optional for frontend-only)"
}

# ═══════════════════════════════════════════════════════════
# PHASE 2: Repository Cloning & Analysis
# ═══════════════════════════════════════════════════════════
Write-Phase 2 "Repository Cloning & Analysis"

Write-Step "Creating project directory..."
if (-not (Test-Path $ProjectDir)) {
    New-Item -ItemType Directory -Path $ProjectDir -Force | Out-Null
}
Write-OK "Directory: $ProjectDir"

Write-Step "Cloning repository..."
Set-Location $ProjectDir
if (Test-Path ".git") {
    Write-Warn "Repository already exists. Pulling latest..."
    git pull origin main
} else {
    git clone $RepoUrl .
}
Write-OK "Repository cloned successfully"

Write-Step "Analyzing project structure..."
$files = Get-ChildItem -Recurse -File | Where-Object { $_.DirectoryName -notmatch 'node_modules|\\.git' }
Write-OK "Files found: $($files.Count)"

if (Test-Path "package.json") {
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    Write-OK "Project: $($pkg.name)"
    Write-OK "Dependencies: $($pkg.dependencies.PSObject.Properties.Count)"
    Write-OK "DevDependencies: $($pkg.devDependencies.PSObject.Properties.Count)"
}

# ═══════════════════════════════════════════════════════════
# PHASE 3: Environment Configuration
# ═══════════════════════════════════════════════════════════
Write-Phase 3 "Environment Configuration"

Write-Step "Checking for .env template..."
if (Test-Path ".env.example") {
    Copy-Item ".env.example" ".env"
    Write-OK ".env created from .env.example"
} elseif (Test-Path ".env.template") {
    Copy-Item ".env.template" ".env"
    Write-OK ".env created from .env.template"
} else {
    Write-Warn "No .env template found. Creating default..."
    @"
# ABRAN SYSTEM Environment
NODE_ENV=development
VITE_API_URL=http://localhost:4000
PORT=5173
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-OK "Default .env created"
}

# ═══════════════════════════════════════════════════════════
# PHASE 4: Dependency Installation
# ═══════════════════════════════════════════════════════════
Write-Phase 4 "Dependency Installation"

if (-not $SkipDeps) {
    Write-Step "Installing dependencies..."
    if (Test-Path "pnpm-lock.yaml") {
        pnpm install --frozen-lockfile
    } elseif (Test-Path "package-lock.json") {
        npm ci
    } else {
        npm install
    }
    Write-OK "Dependencies installed successfully"
} else {
    Write-Warn "Skipped (--SkipDeps)"
}

# ═══════════════════════════════════════════════════════════
# PHASE 5: Build & Launch
# ═══════════════════════════════════════════════════════════
Write-Phase 5 "Build & Launch"

Write-Step "Building project..."
npm run build
Write-OK "Build completed"

Write-Step "Starting development server..."
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✅ ABRAN SYSTEM is ready!                      ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║   🌐 http://localhost:5173                       ║" -ForegroundColor Cyan
Write-Host "║   📂 Project: $ProjectDir" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

npm run dev
`;

const bashScript = String.raw`#!/bin/bash
# ═══════════════════════════════════════════════════════════
# ABRAN SYSTEM - Autonomous Setup & Deployment Script
# Repository: https://github.com/majidmk55/cloud1
# Version: 1.0.0 | Bash
# ═══════════════════════════════════════════════════════════

set -euo pipefail

PROJECT_DIR="\${1:-$HOME/abran-datacenter-system}"
REPO_URL="https://github.com/majidmk55/cloud1"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

write_phase() { echo -e "\n\${CYAN}╔══════════════════════════════════════════╗\n║  Phase $1 : $2\n╚══════════════════════════════════════════╝\${NC}"; }
write_step()  { echo -e "  ▶ $1"; }
write_ok()    { echo -e "    \${GREEN}✅ $1\${NC}"; }
write_warn()  { echo -e "    \${YELLOW}⚠️  $1\${NC}"; }
write_err()   { echo -e "    \${RED}❌ $1\${NC}"; exit 1; }

# ═══════════════════════════════════════════════════════════
# PHASE 1: System Prerequisites
# ═══════════════════════════════════════════════════════════
write_phase 1 "System Prerequisites & Dependencies"

write_step "Detecting OS..."
echo "    OS: $(uname -s) $(uname -r)"

# Git
write_step "Checking Git..."
command -v git &>/dev/null && write_ok "Git: $(git --version)" || write_err "Git not found"

# Node.js
write_step "Checking Node.js..."
if command -v node &>/dev/null; then
    write_ok "Node.js: $(node --version)"
else
    write_warn "Node.js not found. Installing..."
    if command -v apt &>/dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif command -v brew &>/dev/null; then
        brew install node@20
    fi
    write_ok "Node.js installed: $(node --version)"
fi

# pnpm
write_step "Checking pnpm..."
if command -v pnpm &>/dev/null; then
    write_ok "pnpm: $(pnpm --version)"
else
    write_warn "Installing pnpm..."
    npm install -g pnpm
    write_ok "pnpm installed"
fi

# Docker (optional)
write_step "Checking Docker..."
command -v docker &>/dev/null && write_ok "Docker: $(docker --version)" || write_warn "Docker not found (optional)"

# ═══════════════════════════════════════════════════════════
# PHASE 2: Repository Cloning & Analysis
# ═══════════════════════════════════════════════════════════
write_phase 2 "Repository Cloning & Analysis"

write_step "Creating project directory..."
mkdir -p "$PROJECT_DIR"
write_ok "Directory: $PROJECT_DIR"

write_step "Cloning repository..."
cd "$PROJECT_DIR"
if [ -d ".git" ]; then
    write_warn "Already cloned. Pulling latest..."
    git pull origin main
else
    git clone "$REPO_URL" .
fi
write_ok "Repository cloned"

write_step "Analyzing project..."
FILE_COUNT=$(find . -type f -not -path '*/node_modules/*' -not -path '*/.git/*' | wc -l)
write_ok "Files: $FILE_COUNT"
[ -f "package.json" ] && write_ok "Package: $(node -p "require('./package.json').name")"

# ═══════════════════════════════════════════════════════════
# PHASE 3: Environment Configuration
# ═══════════════════════════════════════════════════════════
write_phase 3 "Environment Configuration"

write_step "Setting up environment..."
if [ -f ".env.example" ]; then
    cp .env.example .env
    write_ok ".env from .env.example"
elif [ -f ".env.template" ]; then
    cp .env.template .env
    write_ok ".env from .env.template"
else
    cat > .env << 'EOF'
NODE_ENV=development
VITE_API_URL=http://localhost:4000
PORT=5173
EOF
    write_ok "Default .env created"
fi

# ═══════════════════════════════════════════════════════════
# PHASE 4: Dependency Installation
# ═══════════════════════════════════════════════════════════
write_phase 4 "Dependency Installation"

write_step "Installing dependencies..."
if [ -f "pnpm-lock.yaml" ]; then
    pnpm install --frozen-lockfile
elif [ -f "package-lock.json" ]; then
    npm ci
else
    npm install
fi
write_ok "Dependencies installed"

# ═══════════════════════════════════════════════════════════
# PHASE 5: Build & Launch
# ═══════════════════════════════════════════════════════════
write_phase 5 "Build & Launch"

write_step "Building project..."
npm run build
write_ok "Build completed"

write_step "Starting dev server..."
echo ""
echo -e "\${GREEN}╔══════════════════════════════════════════════════╗\${NC}"
echo -e "\${GREEN}║   ✅ ABRAN SYSTEM is ready!                      ║\${NC}"
echo -e "\${GREEN}╠══════════════════════════════════════════════════╣\${NC}"
echo -e "\${CYAN}║   🌐 http://localhost:5173                       ║\${NC}"
echo -e "\${CYAN}║   📂 Project: $PROJECT_DIR\${NC}"
echo -e "\${GREEN}╚══════════════════════════════════════════════════╝\${NC}"
echo ""

npm run dev
`;

// ─── Pipeline Data ──────────────────────────────────────────
const initialPhases: Phase[] = [
  {
    id: 1,
    title: 'پیش‌نیازهای سیستم',
    titleEn: 'System Prerequisites',
    icon: Monitor,
    color: 'from-blue-500 to-cyan-500',
    status: 'pending',
    steps: [
      {
        id: '1-1', title: 'تشخیص سیستم‌عامل', titleEn: 'OS Detection',
        description: 'بررسی نوع سیستم‌عامل و نسخه',
        commands: ['uname -s', '[System.Environment]::OSVersion'],
        status: 'pending', output: [], duration: 500,
      },
      {
        id: '1-2', title: 'نصب Git', titleEn: 'Git Installation',
        description: 'بررسی و نصب Git',
        commands: ['git --version', 'apt install git / winget install Git'],
        status: 'pending', output: [], duration: 2000,
      },
      {
        id: '1-3', title: 'نصب Node.js', titleEn: 'Node.js Installation',
        description: 'نصب Node.js 20 LTS',
        commands: ['node --version', 'curl -fsSL https://deb.nodesource.com/setup_20.x | bash'],
        status: 'pending', output: [], duration: 3000,
      },
      {
        id: '1-4', title: 'نصب pnpm', titleEn: 'pnpm Installation',
        description: 'نصب مدیر بسته pnpm',
        commands: ['npm install -g pnpm', 'pnpm --version'],
        status: 'pending', output: [], duration: 1500,
      },
      {
        id: '1-5', title: 'بررسی Docker', titleEn: 'Docker Check',
        description: 'بررسی نصب Docker (اختیاری)',
        commands: ['docker --version'],
        status: 'pending', output: [], duration: 800,
      },
    ],
  },
  {
    id: 2,
    title: 'کلون و تحلیل مخزن',
    titleEn: 'Clone & Analyze',
    icon: GitBranch,
    color: 'from-violet-500 to-purple-500',
    status: 'pending',
    steps: [
      {
        id: '2-1', title: 'ایجاد پوشه پروژه', titleEn: 'Create Directory',
        description: 'ساخت abran-datacenter-system',
        commands: ['mkdir -p ~/abran-datacenter-system'],
        status: 'pending', output: [], duration: 300,
      },
      {
        id: '2-2', title: 'کلون ریپازیتوری', titleEn: 'Clone Repository',
        description: 'دانلود کد از GitHub',
        commands: ['git clone https://github.com/majidmk55/cloud1 .'],
        status: 'pending', output: [], duration: 4000,
      },
      {
        id: '2-3', title: 'تحلیل ساختار', titleEn: 'Analyze Structure',
        description: 'بررسی package.json و ساختار پروژه',
        commands: ['cat package.json', 'find . -type f | wc -l'],
        status: 'pending', output: [], duration: 1000,
      },
    ],
  },
  {
    id: 3,
    title: 'پیکربندی محیط',
    titleEn: 'Environment Config',
    icon: Settings,
    color: 'from-amber-500 to-orange-500',
    status: 'pending',
    steps: [
      {
        id: '3-1', title: 'ایجاد .env', titleEn: 'Create .env',
        description: 'تنظیم متغیرهای محیطی',
        commands: ['cp .env.example .env 2>/dev/null || echo "NODE_ENV=development" > .env'],
        status: 'pending', output: [], duration: 500,
      },
      {
        id: '3-2', title: 'تنظیم مقادیر', titleEn: 'Set Values',
        description: 'پر کردن مقادیر پیش‌فرض امن',
        commands: ['export NODE_ENV=development', 'export PORT=5173'],
        status: 'pending', output: [], duration: 300,
      },
    ],
  },
  {
    id: 4,
    title: 'نصب وابستگی‌ها',
    titleEn: 'Install Dependencies',
    icon: Package,
    color: 'from-emerald-500 to-green-500',
    status: 'pending',
    steps: [
      {
        id: '4-1', title: 'نصب پکیج‌ها', titleEn: 'Install Packages',
        description: 'نصب تمام وابستگی‌های پروژه',
        commands: ['pnpm install --frozen-lockfile'],
        status: 'pending', output: [], duration: 5000,
      },
      {
        id: '4-2', title: 'بررسی وابستگی‌ها', titleEn: 'Verify Deps',
        description: 'تأیید نصب صحیح',
        commands: ['pnpm ls --depth 0'],
        status: 'pending', output: [], duration: 1000,
      },
    ],
  },
  {
    id: 5,
    title: 'Build و اجرا',
    titleEn: 'Build & Launch',
    icon: Zap,
    color: 'from-rose-500 to-pink-500',
    status: 'pending',
    steps: [
      {
        id: '5-1', title: 'Build پروژه', titleEn: 'Build Project',
        description: 'کامپایل و بهینه‌سازی',
        commands: ['npm run build'],
        status: 'pending', output: [], duration: 4000,
      },
      {
        id: '5-2', title: 'Health Check', titleEn: 'Health Check',
        description: 'بررسی سلامت سرویس‌ها',
        commands: ['curl -s http://localhost:5173 | head -5'],
        status: 'pending', output: [], duration: 2000,
      },
      {
        id: '5-3', title: 'اجرای سرور', titleEn: 'Start Server',
        description: 'راه‌اندازی development server',
        commands: ['npm run dev'],
        status: 'pending', output: [], duration: 1500,
      },
    ],
  },
];

// ─── Simulated Outputs ──────────────────────────────────────
const simulatedOutputs: Record<string, string[]> = {
  '1-1': ['Detecting OS...', '  Platform: linux x64', '  Kernel: 5.15.0-generic'],
  '1-2': ['Checking Git...', '  git version 2.43.0', '  ✅ Git is installed'],
  '1-3': ['Checking Node.js...', '  v20.11.0', '  ✅ Node.js 20 LTS detected'],
  '1-4': ['Installing pnpm...', '  added 1 package in 2s', '  9.4.0', '  ✅ pnpm ready'],
  '1-5': ['Checking Docker...', '  Docker version 24.0.7', '  ✅ Docker available'],
  '2-1': ['Creating ~/abran-datacenter-system...', '  ✅ Directory created'],
  '2-2': ['Cloning from https://github.com/majidmk55/cloud1...', '  Cloning into \'.\'...', '  Receiving objects: 100% (23/23)', '  ✅ Repository cloned'],
  '2-3': ['Analyzing structure...', '  Files: 28', '  Type: TypeScript/Vite', '  Package: abran-system', '  Framework: React + Vite', '  ✅ Analysis complete'],
  '3-1': ['Looking for .env template...', '  No .env.example found', '  Creating default .env...', '  ✅ .env created'],
  '3-2': ['Setting NODE_ENV=development', '  Setting PORT=5173', '  ✅ Environment configured'],
  '4-1': ['Resolving dependencies...', '  Lockfile is up to date', '  Packages: +156', '  Progress: ████████████████ 100%', '  ✅ 156 packages installed'],
  '4-2': ['Verifying installed packages...', '  react@18.2.0', '  typescript@5.3.3', '  vite@5.0.12', '  tailwindcss@3.4.1', '  ✅ All dependencies verified'],
  '5-1': ['Building for production...', '  vite v5.0.12 building...', '  ✓ 1384 modules transformed', '  dist/index.html       1.30 kB', '  dist/assets/index.js  555.92 kB', '  ✓ built in 5.62s', '  ✅ Build successful'],
  '5-2': ['Running health check...', '  GET / → 200 OK (12ms)', '  Content-Type: text/html', '  ✅ Server responding'],
  '5-3': ['Starting Vite dev server...', '', '  ╔═══════════════════════════════════╗', '  ║  ABRAN SYSTEM is LIVE!            ║', '  ║  ➜  Local:   http://localhost:5173 ║', '  ║  ➜  Network: http://192.168.1.5:5173║', '  ╚═══════════════════════════════════╝', '  ✅ Ready!'],
};

// ─── Main Component ─────────────────────────────────────────
export function SetupScript() {
  const [phases, setPhases] = useState<Phase[]>(initialPhases);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'scripts' | 'analysis'>('pipeline');
  const [elapsed, setElapsed] = useState(0);

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => setElapsed(e => e + 100), 100);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return m > 0 ? `${m}m ${s % 60}s` : `${s}.${String(ms % 1000).padStart(3, '0').slice(0, 1)}s`;
  };

  // Run simulation
  const runPipeline = useCallback(async () => {
    setIsRunning(true);
    setElapsed(0);
    setPhases(initialPhases.map(p => ({
      ...p,
      status: 'pending' as PhaseStatus,
      steps: p.steps.map(s => ({ ...s, status: 'pending' as PhaseStatus, output: [] })),
    })));

    for (let pi = 0; pi < initialPhases.length; pi++) {
      const phase = initialPhases[pi];
      setPhases(prev => prev.map((p, i) => i === pi ? { ...p, status: 'running' } : p));
      setExpandedPhase(pi);

      for (let si = 0; si < phase.steps.length; si++) {
        const step = phase.steps[si];
        setPhases(prev => prev.map((p, i) =>
          i === pi ? {
            ...p,
            steps: p.steps.map((s, j) => j === si ? { ...s, status: 'running' } : s),
          } : p
        ));

        // Simulate output streaming
        const outputs = simulatedOutputs[step.id] || ['Done'];
        for (let oi = 0; oi < outputs.length; oi++) {
          await new Promise(r => setTimeout(r, step.duration / outputs.length));
          setPhases(prev => prev.map((p, i) =>
            i === pi ? {
              ...p,
              steps: p.steps.map((s, j) =>
                j === si ? { ...s, output: [...s.output, outputs[oi]] } : s
              ),
            } : p
          ));
        }

        setPhases(prev => prev.map((p, i) =>
          i === pi ? {
            ...p,
            steps: p.steps.map((s, j) => j === si ? { ...s, status: 'completed' } : s),
          } : p
        ));
      }

      setPhases(prev => prev.map((p, i) => i === pi ? { ...p, status: 'completed' } : p));
    }

    setIsRunning(false);
  }, []);

  const resetPipeline = () => {
    setIsRunning(false);
    setElapsed(0);
    setPhases(initialPhases);
    setExpandedPhase(null);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const totalSteps = phases.reduce((acc, p) => acc + p.steps.length, 0);
  const completedSteps = phases.reduce((acc, p) => acc + p.steps.filter(s => s.status === 'completed').length, 0);
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <div>
              <span>پنل استقرار خودکار</span>
              <div className="text-sm font-normal text-gray-500 mt-1" dir="ltr">
                Autonomous Deployment Pipeline
              </div>
            </div>
          </h1>
          <p className="text-gray-400 text-base max-w-2xl">
            استقرار کامل پروژه <span className="text-emerald-400 font-mono text-sm" dir="ltr">majidmk55/cloud1</span> —
            شامل ۵ فاز، {totalSteps} مرحله، اسکریپت‌های PowerShell و Bash
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={isRunning ? undefined : runPipeline}
            disabled={isRunning}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              isRunning
                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/20'
            }`}
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'در حال اجرا...' : 'اجرای Pipeline'}
          </button>
          <button
            onClick={resetPipeline}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition-all border border-white/10"
          >
            <RotateCcw className="w-4 h-4" />
            ریست
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'پیشرفت', value: `${Math.round(progress)}%`, icon: Zap, color: 'text-emerald-400' },
          { label: 'مراحل تکمیل', value: `${completedSteps}/${totalSteps}`, icon: CheckCircle2, color: 'text-cyan-400' },
          { label: 'زمان سپری‌شده', value: formatTime(elapsed), icon: Clock, color: 'text-amber-400' },
          { label: 'وضعیت', value: isRunning ? 'در حال اجرا' : completedSteps === totalSteps && totalSteps > 0 ? 'تکمیل ✅' : 'آماده', icon: Server, color: completedSteps === totalSteps && totalSteps > 0 ? 'text-emerald-400' : 'text-violet-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-white/5 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
        {[
          { id: 'pipeline' as const, label: 'Pipeline', icon: Zap },
          { id: 'scripts' as const, label: 'اسکریپت‌ها', icon: FileCode },
          { id: 'analysis' as const, label: 'تحلیل مخزن', icon: FolderTree },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pipeline Tab */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          {phases.map((phase, pi) => (
            <div
              key={phase.id}
              className={`bg-gradient-to-br from-white/5 to-transparent rounded-2xl border transition-all ${
                phase.status === 'running' ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/5' :
                phase.status === 'completed' ? 'border-emerald-500/20' : 'border-white/10'
              }`}
            >
              {/* Phase Header */}
              <button
                onClick={() => setExpandedPhase(expandedPhase === pi ? null : pi)}
                className="w-full flex items-center justify-between p-5"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center ${
                    phase.status === 'running' ? 'animate-pulse' : ''
                  }`}>
                    {phase.status === 'completed' ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : phase.status === 'running' ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <phase.icon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="text-right">
                    <h3 className="text-white font-bold text-sm">
                      فاز {phase.id}: {phase.title}
                    </h3>
                    <p className="text-gray-500 text-xs" dir="ltr">{phase.titleEn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    phase.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    phase.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-white/5 text-gray-500'
                  }`}>
                    {phase.status === 'completed' ? 'تکمیل' : phase.status === 'running' ? 'در حال اجرا' : 'در انتظار'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {phase.steps.filter(s => s.status === 'completed').length}/{phase.steps.length}
                  </span>
                  {expandedPhase === pi ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </div>
              </button>

              {/* Steps */}
              {expandedPhase === pi && (
                <div className="px-5 pb-5 space-y-2">
                  {phase.steps.map((step) => (
                    <div
                      key={step.id}
                      className={`rounded-xl p-3 border transition-all ${
                        step.status === 'running' ? 'bg-blue-500/5 border-blue-500/20' :
                        step.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/10' :
                        'bg-[#050816] border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {step.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : step.status === 'running' ? (
                            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-600" />
                          )}
                          <span className="text-sm text-white font-medium">{step.title}</span>
                          <span className="text-[10px] text-gray-500 font-mono" dir="ltr">{step.titleEn}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mr-6 mb-2">{step.description}</p>
                      {step.output.length > 0 && (
                        <div className="bg-black/40 rounded-lg p-2.5 mr-6 mt-2">
                          <pre className="text-[11px] text-gray-300 font-mono leading-relaxed whitespace-pre-wrap" dir="ltr">
                            {step.output.join('\n')}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Scripts Tab */}
      {activeTab === 'scripts' && (
        <div className="space-y-6">
          {/* PowerShell */}
          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                </div>
                <span className="text-sm text-gray-400 font-mono" dir="ltr">setup-abran.ps1</span>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] rounded-full">PowerShell 7+</span>
              </div>
              <button
                onClick={() => handleCopy(powershellScript, 'ps')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition-all"
              >
                {copiedScript === 'ps' ? (
                  <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">کپی شد!</span></>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /><span>کپی</span></>
                )}
              </button>
            </div>
            <div className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto">
              <pre className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre" dir="ltr">{powershellScript}</pre>
            </div>
          </div>

          {/* Bash */}
          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-300"></div>
                </div>
                <span className="text-sm text-gray-400 font-mono" dir="ltr">setup-abran.sh</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full">Bash</span>
              </div>
              <button
                onClick={() => handleCopy(bashScript, 'bash')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition-all"
              >
                {copiedScript === 'bash' ? (
                  <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">کپی شد!</span></>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /><span>کپی</span></>
                )}
              </button>
            </div>
            <div className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto">
              <pre className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre" dir="ltr">{bashScript}</pre>
            </div>
          </div>

          {/* Quick Start */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl border border-emerald-500/20 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-400" />
              شروع سریع
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#050816] rounded-xl p-4 border border-white/5">
                <div className="text-xs text-blue-400 mb-2 font-bold">🪟 Windows (PowerShell):</div>
                <code className="text-xs text-gray-300 font-mono block" dir="ltr">
                  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned<br/>
                  .\setup-abran.ps1
                </code>
              </div>
              <div className="bg-[#050816] rounded-xl p-4 border border-white/5">
                <div className="text-xs text-emerald-400 mb-2 font-bold">🐧 Linux / macOS:</div>
                <code className="text-xs text-gray-300 font-mono block" dir="ltr">
                  chmod +x setup-abran.sh<br/>
                  ./setup-abran.sh
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {/* Repo Info */}
          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-violet-400" />
              اطلاعات ریپازیتوری
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'URL', value: 'https://github.com/majidmk55/cloud1', mono: true },
                { label: 'نام پروژه', value: 'ABRAN SYSTEM' },
                { label: 'زبان اصلی', value: 'TypeScript (98.8%)' },
                { label: 'فریمورک', value: 'React + Vite' },
                { label: 'تعداد کامیت', value: '23' },
                { label: 'برنچ‌ها', value: '2' },
                { label: 'تاریخ آخرین بروزرسانی', value: 'Sep 13, 2026' },
                { label: 'نوع پروژه', value: 'Frontend SPA' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between bg-[#050816] rounded-xl p-3 border border-white/5">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className={`text-sm text-gray-200 ${item.mono ? 'font-mono text-xs' : ''}`} dir={item.mono ? 'ltr' : 'rtl'}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              پشته فناوری شناسایی‌شده
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'React 18', icon: '⚛️', color: 'from-blue-500/20 to-blue-500/5' },
                { name: 'TypeScript', icon: '📘', color: 'from-blue-600/20 to-blue-600/5' },
                { name: 'Vite 5', icon: '⚡', color: 'from-violet-500/20 to-violet-500/5' },
                { name: 'Tailwind CSS', icon: '🎨', color: 'from-cyan-500/20 to-cyan-500/5' },
                { name: 'Lucide Icons', icon: '✨', color: 'from-amber-500/20 to-amber-500/5' },
                { name: 'Node.js 20', icon: '🟢', color: 'from-emerald-500/20 to-emerald-500/5' },
                { name: 'pnpm', icon: '📦', color: 'from-orange-500/20 to-orange-500/5' },
                { name: 'Git', icon: '🔀', color: 'from-red-500/20 to-red-500/5' },
              ].map((tech) => (
                <div key={tech.name} className={`bg-gradient-to-br ${tech.color} rounded-xl p-3 border border-white/5 text-center`}>
                  <div className="text-2xl mb-1">{tech.icon}</div>
                  <div className="text-xs text-gray-300 font-medium">{tech.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* File Structure */}
          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-amber-400" />
              ساختار فایل‌ها
            </h2>
            <div className="bg-[#050816] rounded-xl p-4 border border-white/5 font-mono text-xs" dir="ltr">
              <pre className="text-gray-300 leading-relaxed">{`abran-datacenter-system/
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   └── ui/
│   │       └── index.tsx
│   ├── pages/
│   │   ├── Overview.tsx
│   │   ├── HybridMultiSource.tsx
│   │   ├── Contexts.tsx
│   │   ├── DatabaseSchema.tsx
│   │   ├── ProviderAdapters.tsx
│   │   ├── RBAC.tsx
│   │   ├── DesignSystem.tsx
│   │   ├── ... (15 more pages)
│   │   └── SetupScript.tsx
│   ├── providers/
│   │   └── index.tsx
│   ├── utils/
│   │   └── index.ts
│   ├── App.tsx          ← Entry Point
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.js
├── .gitignore
└── README.md`}</pre>
            </div>
          </div>

          {/* Dependencies */}
          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-400" />
              وابستگی‌های کلیدی
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: 'react', version: '^18.2.0', type: 'prod' },
                { name: 'react-dom', version: '^18.2.0', type: 'prod' },
                { name: 'lucide-react', version: '^0.303.0', type: 'prod' },
                { name: 'typescript', version: '^5.3.3', type: 'dev' },
                { name: 'vite', version: '^5.0.12', type: 'dev' },
                { name: '@vitejs/plugin-react', version: '^4.2.1', type: 'dev' },
                { name: 'tailwindcss', version: '^3.4.1', type: 'dev' },
                { name: 'autoprefixer', version: '^10.4.16', type: 'dev' },
                { name: 'postcss', version: '^8.4.33', type: 'dev' },
                { name: '@types/react', version: '^18.2.47', type: 'dev' },
              ].map((dep) => (
                <div key={dep.name} className="flex items-center justify-between bg-[#050816] rounded-lg p-2.5 border border-white/5">
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-cyan-300 font-mono" dir="ltr">{dep.name}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-[10px] text-gray-500 font-mono" dir="ltr">{dep.version}</code>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      dep.type === 'prod' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-violet-500/20 text-violet-400'
                    }`}>
                      {dep.type === 'prod' ? 'PROD' : 'DEV'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Endpoints */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl border border-emerald-500/20 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-emerald-400" />
              آدرس‌های دسترسی پس از اجرا
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: 'Frontend (Vite Dev)', url: 'http://localhost:5173', status: 'active', color: 'text-emerald-400' },
                { name: 'Preview Build', url: 'http://localhost:4173', status: 'after-build', color: 'text-cyan-400' },
              ].map((svc) => (
                <div key={svc.name} className="flex items-center justify-between bg-[#050816] rounded-xl p-4 border border-white/5">
                  <div>
                    <div className="text-sm text-gray-300 font-medium">{svc.name}</div>
                    <code className={`text-xs font-mono ${svc.color}`} dir="ltr">{svc.url}</code>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    svc.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {svc.status === 'active' ? 'فعال' : 'پس از build'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl border border-amber-500/20 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-amber-300 mb-1">توجه مهم</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              این داشبورد یک شبیه‌سازی بصری از فرآیند استقرار است. برای اجرای واقعی، اسکریپت‌های ارائه‌شده در تب «اسکریپت‌ها» را
              در سیستم محلی خود دانلود و اجرا کنید. اسکریپت‌ها به صورت خودکار تمام مراحل را انجام می‌دهند.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
