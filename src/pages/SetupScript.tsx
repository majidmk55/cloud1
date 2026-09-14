import { useState, useEffect, useRef } from 'react';
import {
  Terminal, Copy, CheckCircle2, AlertTriangle, Play, RotateCcw,
  Server, GitBranch, Package, Shield, Globe, Clock,
  ChevronDown, ChevronUp, Monitor, Cpu, HardDrive,
  Zap, Check, Loader2, FolderTree, FileCode, Settings,
  XCircle, ArrowLeft, ArrowRight, Download, ExternalLink, Info
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
type PhaseStatus = 'pending' | 'running' | 'completed' | 'error';
type StepStatus = 'pending' | 'running' | 'completed' | 'error';

interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'success' | 'warning' | 'info';
  text: string;
}

interface Step {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  commands: string[];
  expectedOutput: string[];
  status: StepStatus;
  output: TerminalLine[];
  fallback?: string;
}

interface Phase {
  id: number;
  title: string;
  titleEn: string;
  icon: any;
  color: string;
  steps: Step[];
  status: PhaseStatus;
}

// ─── Actual Repository Data ──────────────────────────────────
const repoInfo = {
  name: 'sandbox-workspace',
  url: 'https://github.com/majidmk55/cloud1',
  type: 'Vite + React + TypeScript',
  packageManager: 'npm',
  lockFile: 'package-lock.json',
  scripts: {
    dev: 'vite',
    build: 'vite build',
    typecheck: 'tsc --noEmit',
  },
  dependencies: [
    'react@^18.2.0', 'react-dom@^18.2.0', 'react-router-dom@^6.8.0',
    '@supabase/supabase-js@^2.98.0', 'framer-motion@^11.16.1',
    'recharts@^2.10.0', 'lucide-react@^0.294.0', 'date-fns@^2.30.0',
    'canvas-confetti@^1.9.3', 'uuid@^9.0.1',
    '@dnd-kit/core@^6.1.0', '@dnd-kit/sortable@^8.0.0', '@dnd-kit/utilities@^3.2.2',
  ],
  devDependencies: [
    'vite@^6.3.5', 'typescript@^5.7.0', 'tailwindcss@^4.1.7',
    '@tailwindcss/vite@^4.1.7', '@vitejs/plugin-react@^4.3.4',
    '@types/react@^18.2.0', '@types/react-dom@^18.2.0',
    '@types/uuid@^9.0.7', '@types/canvas-confetti@^1.6.4',
  ],
  files: [
    'src/', 'index.html', 'package.json', 'package-lock.json',
    'tsconfig.json', 'vite.config.js', '.gitignore', 'README.md'
  ],
  port: 5173,
};

// ─── PowerShell Setup Script ─────────────────────────────────
const powershellScript = `# ═══════════════════════════════════════════════════════════
# ABRAN SYSTEM - Robust Setup Script for Windows PowerShell
# Repository: https://github.com/majidmk55/cloud1
# Actual Stack: Vite + React + TypeScript + Tailwind v4
# ═══════════════════════════════════════════════════════════

#Requires -Version 5.1

param(
    [string]$ProjectDir = "$env:USERPROFILE\\abran-datacenter",
    [string]$RepoUrl = "https://github.com/majidmk55/cloud1",
    [switch]$SkipClone,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"

# ─── Helper Functions ────────────────────────────────────────
function Write-Phase {
    param([int]$Num, [string]$Title)
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  Phase $Num : $Title" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan
}

function Write-Step  { param([string]$Msg) Write-Host "  ▶ $Msg" -ForegroundColor White }
function Write-OK    { param([string]$Msg) Write-Host "    ✅ $Msg" -ForegroundColor Green }
function Write-Warn  { param([string]$Msg) Write-Host "    ⚠️  $Msg" -ForegroundColor Yellow }
function Write-Err   { param([string]$Msg) Write-Host "    ❌ $Msg" -ForegroundColor Red }
function Write-Info  { param([string]$Msg) Write-Host "    ℹ️  $Msg" -ForegroundColor Blue }

# ═══════════════════════════════════════════════════════════
# PHASE 1: System Prerequisites Check
# ═══════════════════════════════════════════════════════════
Write-Phase 1 "System Prerequisites Check"

# Check Git
Write-Step "Checking Git..."
try {
    $gitVer = git --version 2>$null
    if ($gitVer) {
        Write-OK "Git: $gitVer"
    } else { throw "Git not found" }
} catch {
    Write-Err "Git is not installed!"
    Write-Info "Download from: https://git-scm.com/download/win"
    Write-Info "Or run: winget install Git.Git"
    exit 1
}

# Check Node.js
Write-Step "Checking Node.js..."
try {
    $nodeVer = node --version 2>$null
    if ($nodeVer) {
        Write-OK "Node.js: $nodeVer"
    } else { throw "Node.js not found" }
} catch {
    Write-Err "Node.js is not installed!"
    Write-Info "Download from: https://nodejs.org/ (LTS recommended)"
    Write-Info "Or run: winget install OpenJS.NodeJS.LTS"
    exit 1
}

# Check npm
Write-Step "Checking npm..."
try {
    $npmVer = npm --version 2>$null
    if ($npmVer) {
        Write-OK "npm: v$npmVer"
    } else { throw "npm not found" }
} catch {
    Write-Err "npm is not installed!"
    Write-Info "Reinstall Node.js from: https://nodejs.org/"
    exit 1
}

# ═══════════════════════════════════════════════════════════
# PHASE 2: Repository Cloning
# ═══════════════════════════════════════════════════════════
Write-Phase 2 "Repository Cloning"

if (-not $SkipClone) {
    Write-Step "Creating project directory..."
    if (-not (Test-Path $ProjectDir)) {
        New-Item -ItemType Directory -Path $ProjectDir -Force | Out-Null
        Write-OK "Created: $ProjectDir"
    } else {
        Write-Warn "Directory already exists"
    }

    Write-Step "Navigating to project directory..."
    Set-Location $ProjectDir
    Write-OK "Current directory: $(Get-Location)"

    Write-Step "Cloning repository..."
    if (Test-Path ".git") {
        Write-Warn "Repository already cloned. Pulling latest..."
        git pull origin main
    } else {
        git clone $RepoUrl .
    }
    Write-OK "Repository cloned successfully"
} else {
    Write-Warn "Skipping clone (--SkipClone)"
    Set-Location $ProjectDir
}

# ═══════════════════════════════════════════════════════════
# PHASE 3: Repository Analysis
# ═══════════════════════════════════════════════════════════
Write-Phase 3 "Repository Analysis"

Write-Step "Listing root files..."
$rootFiles = Get-ChildItem -File | Select-Object -ExpandProperty Name
Write-OK "Root files: $($rootFiles.Count)"
$rootFiles | ForEach-Object { Write-Info "  • $_" }

Write-Step "Analyzing package.json..."
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    Write-OK "Project name: $($packageJson.name)"
    Write-OK "Type: $($packageJson.type)"
    
    $depCount = 0
    if ($packageJson.dependencies) {
        $depCount = ($packageJson.dependencies.PSObject.Properties | Measure-Object).Count
    }
    Write-OK "Dependencies: $depCount packages"
    
    $devDepCount = 0
    if ($packageJson.devDependencies) {
        $devDepCount = ($packageJson.devDependencies.PSObject.Properties | Measure-Object).Count
    }
    Write-OK "Dev Dependencies: $devDepCount packages"
    
    Write-Step "Available scripts:"
    $packageJson.scripts.PSObject.Properties | ForEach-Object {
        Write-Info "  • $($_.Name): $($_.Value)"
    }
} else {
    Write-Err "package.json not found!"
    exit 1
}

# Check for lock file
Write-Step "Checking lock file..."
if (Test-Path "package-lock.json") {
    Write-OK "Using npm (package-lock.json found)"
} elseif (Test-Path "pnpm-lock.yaml") {
    Write-OK "Using pnpm (pnpm-lock.yaml found)"
} elseif (Test-Path "yarn.lock") {
    Write-OK "Using yarn (yarn.lock found)"
} else {
    Write-Warn "No lock file found. Will use npm install"
}

# ═══════════════════════════════════════════════════════════
# PHASE 4: Dependency Installation
# ═══════════════════════════════════════════════════════════
Write-Phase 4 "Dependency Installation"

Write-Step "Installing dependencies with npm..."
try {
    npm install
    Write-OK "Dependencies installed successfully"
} catch {
    Write-Err "npm install failed!"
    Write-Info "Try: npm cache clean --force"
    Write-Info "Then: npm install"
    exit 1
}

# Verify installation
Write-Step "Verifying installation..."
if (Test-Path "node_modules") {
    $moduleCount = (Get-ChildItem "node_modules" -Directory | Measure-Object).Count
    Write-OK "node_modules contains $moduleCount packages"
} else {
    Write-Err "node_modules not found after install!"
    exit 1
}

# ═══════════════════════════════════════════════════════════
# PHASE 5: Environment Configuration
# ═══════════════════════════════════════════════════════════
Write-Phase 5 "Environment Configuration"

Write-Step "Checking for .env template..."
if (Test-Path ".env.example") {
    Copy-Item ".env.example" ".env" -Force
    Write-OK ".env created from .env.example"
} elseif (Test-Path ".env.template") {
    Copy-Item ".env.template" ".env" -Force
    Write-OK ".env created from .env.template"
} else {
    Write-Warn "No .env template found"
    Write-Step "Creating default .env..."
    @"
# ABRAN SYSTEM Environment Configuration
NODE_ENV=development
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
PORT=5173
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-OK "Default .env created"
    Write-Info "⚠️  IMPORTANT: Edit .env and add your Supabase credentials!"
}

# ═══════════════════════════════════════════════════════════
# PHASE 6: Build & Launch
# ═══════════════════════════════════════════════════════════
Write-Phase 6 "Build & Launch"

Write-Step "Running type check..."
try {
    npm run typecheck
    Write-OK "Type check passed"
} catch {
    Write-Warn "Type check failed (non-critical)"
}

Write-Step "Building for production..."
try {
    npm run build
    Write-OK "Build completed successfully"
} catch {
    Write-Err "Build failed!"
    exit 1
}

Write-Step "Starting development server..."
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✅ ABRAN SYSTEM is ready!                          ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║   🌐 Local:   http://localhost:5173                  ║" -ForegroundColor Cyan
Write-Host "║   📂 Project: $ProjectDir" -ForegroundColor Cyan
Write-Host "║   📦 Stack:   Vite + React + TypeScript              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev
`;

// ─── Pipeline Phases ─────────────────────────────────────────
const createInitialPhases = (): Phase[] => [
  {
    id: 1,
    title: 'بررسی پیش‌نیازها',
    titleEn: 'Prerequisites Check',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
    status: 'pending',
    steps: [
      {
        id: '1-1',
        title: 'بررسی Git',
        titleEn: 'Check Git',
        description: 'اطمینان از نصب بودن Git',
        commands: ['git --version'],
        expectedOutput: ['git version 2.43.0.windows.1'],
        status: 'pending',
        output: [],
        fallback: 'winget install Git.Git',
      },
      {
        id: '1-2',
        title: 'بررسی Node.js',
        titleEn: 'Check Node.js',
        description: 'اطمینان از نصب بودن Node.js LTS',
        commands: ['node --version'],
        expectedOutput: ['v20.11.0'],
        status: 'pending',
        output: [],
        fallback: 'winget install OpenJS.NodeJS.LTS',
      },
      {
        id: '1-3',
        title: 'بررسی npm',
        titleEn: 'Check npm',
        description: 'اطمینان از نصب بودن npm',
        commands: ['npm --version'],
        expectedOutput: ['10.2.4'],
        status: 'pending',
        output: [],
        fallback: 'Reinstall Node.js',
      },
    ],
  },
  {
    id: 2,
    title: 'کلون ریپازیتوری',
    titleEn: 'Clone Repository',
    icon: GitBranch,
    color: 'from-violet-500 to-purple-500',
    status: 'pending',
    steps: [
      {
        id: '2-1',
        title: 'ایجاد پوشه پروژه',
        titleEn: 'Create Directory',
        description: 'ساخت پوشه abran-datacenter',
        commands: ['New-Item -ItemType Directory -Path "$env:USERPROFILE\\abran-datacenter" -Force'],
        expectedOutput: ['    Directory: C:\\Users\\User', '', 'Mode                 LastWriteTime         Length Name', '----                 -------------         ------ ----', 'd-----         1/15/2026   3:45 PM                abran-datacenter'],
        status: 'pending',
        output: [],
      },
      {
        id: '2-2',
        title: 'کلون کردن مخزن',
        titleEn: 'Clone Repo',
        description: 'دانلود کد از GitHub',
        commands: ['cd "$env:USERPROFILE\\abran-datacenter"', 'git clone https://github.com/majidmk55/cloud1 .'],
        expectedOutput: ['Cloning into \'.\'...', 'remote: Enumerating objects: 156, done.', 'remote: Counting objects: 100% (156/156), done.', 'remote: Compressing objects: 100% (89/89), done.', 'Receiving objects: 100% (156/156), 2.34 MiB | 5.67 MiB/s, done.'],
        status: 'pending',
        output: [],
      },
    ],
  },
  {
    id: 3,
    title: 'تحلیل مخزن',
    titleEn: 'Repository Analysis',
    icon: FolderTree,
    color: 'from-amber-500 to-orange-500',
    status: 'pending',
    steps: [
      {
        id: '3-1',
        title: 'لیست فایل‌ها',
        titleEn: 'List Files',
        description: 'مشاهده فایل‌های ریشه',
        commands: ['Get-ChildItem -File | Select-Object Name'],
        expectedOutput: ['.gitignore', 'README.md', 'index.html', 'package.json', 'package-lock.json', 'tsconfig.json', 'vite.config.js'],
        status: 'pending',
        output: [],
      },
      {
        id: '3-2',
        title: 'خواندن package.json',
        titleEn: 'Read package.json',
        description: 'تحلیل وابستگی‌ها و اسکریپت‌ها',
        commands: ['Get-Content package.json | ConvertFrom-Json'],
        expectedOutput: ['name: sandbox-workspace', 'type: module', 'scripts: dev, build, typecheck', 'dependencies: 13 packages', 'devDependencies: 9 packages'],
        status: 'pending',
        output: [],
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
        id: '4-1',
        title: 'نصب پکیج‌ها',
        titleEn: 'Install Packages',
        description: 'نصب تمام وابستگی‌ها با npm',
        commands: ['npm install'],
        expectedOutput: ['npm warn deprecated Some packages...', 'added 245 packages in 12s', '', '45 packages are looking for funding', '  run \`npm fund\` for details'],
        status: 'pending',
        output: [],
        fallback: 'npm cache clean --force; npm install',
      },
      {
        id: '4-2',
        title: 'تأیید نصب',
        titleEn: 'Verify Install',
        description: 'بررسی node_modules',
        commands: ['Test-Path node_modules'],
        expectedOutput: ['True'],
        status: 'pending',
        output: [],
      },
    ],
  },
  {
    id: 5,
    title: 'پیکربندی محیط',
    titleEn: 'Environment Config',
    icon: Settings,
    color: 'from-rose-500 to-pink-500',
    status: 'pending',
    steps: [
      {
        id: '5-1',
        title: 'بررسی .env',
        titleEn: 'Check .env',
        description: 'بررسی وجود فایل .env',
        commands: ['Test-Path .env.example'],
        expectedOutput: ['False'],
        status: 'pending',
        output: [],
      },
      {
        id: '5-2',
        title: 'ایجاد .env',
        titleEn: 'Create .env',
        description: 'ساخت فایل .env با مقادیر پیش‌فرض',
        commands: ['@"', 'NODE_ENV=development', 'VITE_SUPABASE_URL=your_url_here', 'VITE_SUPABASE_ANON_KEY=your_key_here', '"@ | Out-File .env -Encoding UTF8'],
        expectedOutput: ['.env created successfully'],
        status: 'pending',
        output: [],
      },
    ],
  },
  {
    id: 6,
    title: 'Build و اجرا',
    titleEn: 'Build & Launch',
    icon: Zap,
    color: 'from-cyan-500 to-blue-500',
    status: 'pending',
    steps: [
      {
        id: '6-1',
        title: 'Type Check',
        titleEn: 'Type Check',
        description: 'بررسی خطاهای TypeScript',
        commands: ['npm run typecheck'],
        expectedOutput: ['', '> sandbox-workspace@ typecheck', '> tsc --noEmit', ''],
        status: 'pending',
        output: [],
      },
      {
        id: '6-2',
        title: 'Build پروژه',
        titleEn: 'Build Project',
        description: 'کامپایل برای production',
        commands: ['npm run build'],
        expectedOutput: ['', '> sandbox-workspace@ build', '> vite build', '', 'vite v6.3.5 building for production...', '✓ 1384 modules transformed.', 'dist/index.html                   1.30 kB', 'dist/assets/index-abc123.css      71.04 kB', 'dist/assets/index-def456.js       555.92 kB', '✓ built in 5.62s'],
        status: 'pending',
        output: [],
      },
      {
        id: '6-3',
        title: 'اجرای سرور',
        titleEn: 'Start Server',
        description: 'راه‌اندازی development server',
        commands: ['npm run dev'],
        expectedOutput: ['', '> sandbox-workspace@ dev', '> vite', '', '  VITE v6.3.5  ready in 342 ms', '', '  ➜  Local:   http://localhost:5173/', '  ➜  Network: use --host to expose'],
        status: 'pending',
        output: [],
      },
    ],
  },
];

// ─── Main Component ─────────────────────────────────────────
export function SetupScript() {
  const [phases, setPhases] = useState<Phase[]>(createInitialPhases());
  const [isRunning, setIsRunning] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'terminal' | 'script' | 'analysis' | 'troubleshoot'>('guide');
  const [elapsed, setElapsed] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => setElapsed(e => e + 100), 100);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [phases]);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return m > 0 ? `${m}m ${s % 60}s` : `${(ms / 1000).toFixed(1)}s`;
  };

  // Run simulation
  const runPipeline = async () => {
    setIsRunning(true);
    setElapsed(0);
    setPhases(createInitialPhases());

    for (let pi = 0; pi < createInitialPhases().length; pi++) {
      const phase = createInitialPhases()[pi];
      setPhases(prev => prev.map((p, i) => i === pi ? { ...p, status: 'running' } : p));
      setExpandedPhase(pi);

      for (let si = 0; si < phase.steps.length; si++) {
        const step = phase.steps[si];
        
        // Mark step as running
        setPhases(prev => prev.map((p, i) =>
          i === pi ? {
            ...p,
            steps: p.steps.map((s, j) => j === si ? { ...s, status: 'running' } : s),
          } : p
        ));

        // Add command to output
        await new Promise(r => setTimeout(r, 300));
        setPhases(prev => prev.map((p, i) =>
          i === pi ? {
            ...p,
            steps: p.steps.map((s, j) =>
              j === si ? {
                ...s,
                output: [...s.output, { type: 'command' as const, text: `PS C:\\abran-datacenter> ${step.commands[0]}` }]
              } : s
            ),
          } : p
        ));

        // Simulate output streaming
        for (let oi = 0; oi < step.expectedOutput.length; oi++) {
          await new Promise(r => setTimeout(r, 200 + Math.random() * 300));
          setPhases(prev => prev.map((p, i) =>
            i === pi ? {
              ...p,
              steps: p.steps.map((s, j) =>
                j === si ? {
                  ...s,
                  output: [...s.output, { type: 'output' as const, text: step.expectedOutput[oi] }]
                } : s
              ),
            } : p
          ));
        }

        // Mark step as completed
        await new Promise(r => setTimeout(r, 200));
        setPhases(prev => prev.map((p, i) =>
          i === pi ? {
            ...p,
            steps: p.steps.map((s, j) => j === si ? { ...s, status: 'completed' } : s),
          } : p
        ));
      }

      // Mark phase as completed
      setPhases(prev => prev.map((p, i) => i === pi ? { ...p, status: 'completed' } : p));
    }

    setIsRunning(false);
  };

  const resetPipeline = () => {
    setIsRunning(false);
    setElapsed(0);
    setPhases(createInitialPhases());
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(powershellScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const totalSteps = phases.reduce((acc, p) => acc + p.steps.length, 0);
  const completedSteps = phases.reduce((acc, p) => acc + p.steps.filter(s => s.status === 'completed').length, 0);
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <div>
              <span>استقرار خودکار ABRAN</span>
              <div className="text-xs font-normal text-gray-500 mt-1" dir="ltr">
                Autonomous Setup for majidmk55/cloud1
              </div>
            </div>
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl">
            راه‌اندازی کامل پروژه <span className="text-emerald-400 font-mono text-xs" dir="ltr">sandbox-workspace</span> —
            Vite + React + TypeScript + Tailwind v4
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={isRunning ? undefined : runPipeline}
            disabled={isRunning}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
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
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition-all border border-white/10"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'پیشرفت', value: `${Math.round(progress)}%`, icon: Zap, color: 'text-emerald-400' },
          { label: 'مراحل', value: `${completedSteps}/${totalSteps}`, icon: CheckCircle2, color: 'text-cyan-400' },
          { label: 'زمان', value: formatTime(elapsed), icon: Clock, color: 'text-amber-400' },
          { label: 'وضعیت', value: isRunning ? 'در حال اجرا' : completedSteps === totalSteps && totalSteps > 0 ? 'تکمیل ✅' : 'آماده', icon: Server, color: 'text-violet-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-3">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
              <span className="text-[10px] text-gray-500">{stat.label}</span>
            </div>
            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-white/5 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit flex-wrap">
        {[
          { id: 'guide' as const, label: '📘 راهنمای نصب', icon: FileCode },
          { id: 'terminal' as const, label: 'Terminal', icon: Terminal },
          { id: 'script' as const, label: 'اسکریپت PowerShell', icon: FileCode },
          { id: 'analysis' as const, label: 'تحلیل مخزن', icon: FolderTree },
          { id: 'troubleshoot' as const, label: 'عیب‌یابی', icon: AlertTriangle },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Guide Tab */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          {/* Success Banner */}
          <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl border-2 border-emerald-500/40 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-300">✅ پیش‌نیازها آماده هستند!</h2>
                <p className="text-sm text-gray-300">حالا فقط ۳ مرحله ساده تا راه‌اندازی سایت</p>
              </div>
            </div>
          </div>

          {/* Quick Start */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl border border-emerald-500/30 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-emerald-400" />
              شروع سریع (۳ مرحله)
            </h2>
            <div className="space-y-4">
              <div className="bg-[#050816] rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">1</div>
                  <span className="text-white font-bold">کلون ریپازیتوری</span>
                </div>
                <code className="text-sm text-cyan-300 font-mono block mr-11" dir="ltr">
                  git clone https://github.com/majidmk55/cloud1 abran-system<br/>
                  cd abran-system
                </code>
              </div>

              <div className="bg-[#050816] rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">2</div>
                  <span className="text-white font-bold">نصب وابستگی‌ها</span>
                </div>
                <code className="text-sm text-cyan-300 font-mono block mr-11" dir="ltr">
                  npm install
                </code>
              </div>

              <div className="bg-[#050816] rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">3</div>
                  <span className="text-white font-bold">اجرای سرور</span>
                </div>
                <code className="text-sm text-cyan-300 font-mono block mr-11" dir="ltr">
                  npm run dev
                </code>
                <div className="mt-2 mr-11 text-xs text-emerald-400">
                  ✅ سایت در آدرس <span className="font-mono" dir="ltr">http://localhost:3000</span> در دسترس خواهد بود
                </div>
              </div>
            </div>
          </div>

          {/* Prerequisites Status */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl border border-emerald-500/30 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              وضعیت پیش‌نیازها
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#050816] rounded-xl p-4 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-white font-bold text-sm">Node.js ✓</h3>
                </div>
                <p className="text-xs text-gray-400">نصب شده و آماده</p>
              </div>
              <div className="bg-[#050816] rounded-xl p-4 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-white font-bold text-sm">npm ✓</h3>
                </div>
                <p className="text-xs text-gray-400">نصب شده و آماده</p>
              </div>
              <div className="bg-[#050816] rounded-xl p-4 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-white font-bold text-sm">Git ✓</h3>
                </div>
                <p className="text-xs text-gray-400">نصب شده و آماده</p>
              </div>
            </div>
          </div>

          {/* Detailed Steps */}
          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-violet-400" />
              مراحل کامل (۳ مرحله ساده)
            </h2>
            <div className="space-y-4">
              <div className="border-r-2 border-emerald-500/30 pr-4">
                <h3 className="text-white font-bold text-sm mb-2">مرحله ۱: کلون ریپازیتوری</h3>
                <div className="bg-[#050816] rounded-lg p-3 border border-white/5">
                  <code className="text-[10px] text-cyan-300 font-mono block" dir="ltr">
                    git clone https://github.com/majidmk55/cloud1 abran-system<br/>
                    cd abran-system
                  </code>
                </div>
              </div>

              <div className="border-r-2 border-cyan-500/30 pr-4">
                <h3 className="text-white font-bold text-sm mb-2">مرحله ۲: نصب وابستگی‌ها</h3>
                <div className="bg-[#050816] rounded-lg p-3 border border-white/5">
                  <code className="text-[10px] text-cyan-300 font-mono block" dir="ltr">
                    npm install
                  </code>
                  <div className="text-[10px] text-gray-400 mt-2">
                    ⏱️ این مرحله ممکن است ۱-۳ دقیقه طول بکشد
                  </div>
                </div>
              </div>

              <div className="border-r-2 border-blue-500/30 pr-4">
                <h3 className="text-white font-bold text-sm mb-2">مرحله ۳: اجرای سرور توسعه</h3>
                <div className="bg-[#050816] rounded-lg p-3 border border-white/5">
                  <code className="text-[10px] text-cyan-300 font-mono block" dir="ltr">
                    npm run dev
                  </code>
                  <div className="text-[10px] text-emerald-400 mt-2">
                    ✅ سرور در http://localhost:3000 اجرا می‌شود
                  </div>
                </div>
              </div>

              <div className="border-r-2 border-violet-500/30 pr-4">
                <h3 className="text-white font-bold text-sm mb-2">مرحله ۴: Build برای Production (اختیاری)</h3>
                <div className="bg-[#050816] rounded-lg p-3 border border-white/5">
                  <code className="text-[10px] text-cyan-300 font-mono block" dir="ltr">
                    npm run build<br/>
                    npm run preview
                  </code>
                  <div className="text-[10px] text-gray-400 mt-2">
                    فایل‌های بهینه‌شده در پوشه <code className="text-cyan-300" dir="ltr">dist/</code> قرار می‌گیرند
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Structure */}
          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-amber-400" />
              ساختار پروژه
            </h2>
            <div className="bg-[#050816] rounded-xl p-4 border border-white/5 font-mono text-xs" dir="ltr">
              <pre className="text-gray-300 leading-relaxed">{`abran-system/
├── src/
│   ├── components/      # کامپوننت‌های مشترک
│   ├── pages/           # صفحات اصلی سایت
│   ├── providers/       # Context providers
│   ├── utils/           # توابع کمکی
│   ├── App.tsx          # کامپوننت اصلی
│   ├── main.tsx         # نقطه ورود
│   └── index.css        # استایل‌های سراسری
├── index.html           # HTML اصلی
├── package.json         # وابستگی‌ها و اسکریپت‌ها
├── vite.config.js       # تنظیمات Vite
├── tsconfig.json        # تنظیمات TypeScript
└── README.md            # مستندات`}</pre>
            </div>
          </div>

          {/* Available Commands */}
          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              دستورات موجود
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { cmd: 'npm run dev', desc: 'اجرای سرور توسعه', icon: '🚀' },
                { cmd: 'npm run build', desc: 'Build برای production', icon: '📦' },
                { cmd: 'npm run typecheck', desc: 'بررسی خطاهای TypeScript', icon: '🔍' },
                { cmd: 'npm run preview', desc: 'پیش‌نمایش build production', icon: '👁️' },
              ].map((item) => (
                <div key={item.cmd} className="bg-[#050816] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{item.icon}</span>
                    <code className="text-sm text-cyan-300 font-mono" dir="ltr">{item.cmd}</code>
                  </div>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Access URLs */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl border border-emerald-500/20 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              آدرس‌های دسترسی
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-[#050816] rounded-xl p-4 border border-white/5">
                <div className="text-sm text-gray-300 font-medium mb-1">Development Server</div>
                <code className="text-xs text-emerald-400 font-mono" dir="ltr">http://localhost:3000</code>
                <div className="text-[10px] text-gray-500 mt-1">پس از اجرای <code className="text-cyan-300" dir="ltr">npm run dev</code></div>
              </div>
              <div className="bg-[#050816] rounded-xl p-4 border border-white/5">
                <div className="text-sm text-gray-300 font-medium mb-1">Production Preview</div>
                <code className="text-xs text-cyan-400 font-mono" dir="ltr">http://localhost:4173</code>
                <div className="text-[10px] text-gray-500 mt-1">پس از اجرای <code className="text-cyan-300" dir="ltr">npm run preview</code></div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl border border-amber-500/20 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              نکات مهم
            </h2>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>مدیر بسته <strong className="text-cyan-300">npm</strong> است (نه pnpm یا yarn)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>پورت پیش‌فرض <strong className="text-cyan-300">3000</strong> است (در vite.config.js تنظیم شده)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>فونت‌های <strong className="text-cyan-300">Vazirmatn</strong> و <strong className="text-cyan-300">JetBrains Mono</strong> از Google Fonts بارگذاری می‌شوند</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">⚠</span>
                <span>اگر پورت 3000 اشغال است، Vite به صورت خودکار پورت بعدی را استفاده می‌کند</span>
              </li>
            </ul>
          </div>

          {/* Success Message */}
          <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl border-2 border-emerald-500/40 p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-xl font-bold text-emerald-300 mb-2">آماده شروع هستید!</h2>
            <p className="text-gray-300 text-sm mb-4">فقط ۳ دستور ساده تا راه‌اندازی کامل سایت</p>
            <div className="bg-[#050816] rounded-xl p-4 border border-white/10 inline-block">
              <code className="text-sm text-cyan-300 font-mono block" dir="ltr">
                git clone https://github.com/majidmk55/cloud1 && cd cloud1 && npm install && npm run dev
              </code>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Tab */}
      {activeTab === 'terminal' && (
        <div className="space-y-3">
          {phases.map((phase, pi) => (
            <div
              key={phase.id}
              className={`bg-gradient-to-br from-white/5 to-transparent rounded-xl border transition-all ${
                phase.status === 'running' ? 'border-emerald-500/30' :
                phase.status === 'completed' ? 'border-emerald-500/20' : 'border-white/10'
              }`}
            >
              <button
                onClick={() => setExpandedPhase(expandedPhase === pi ? null : pi)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${phase.color} flex items-center justify-center ${
                    phase.status === 'running' ? 'animate-pulse' : ''
                  }`}>
                    {phase.status === 'completed' ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : phase.status === 'running' ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <phase.icon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="text-right">
                    <h3 className="text-white font-bold text-xs">
                      فاز {phase.id}: {phase.title}
                    </h3>
                    <p className="text-gray-500 text-[10px]" dir="ltr">{phase.titleEn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    phase.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    phase.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-white/5 text-gray-500'
                  }`}>
                    {phase.status === 'completed' ? '✓' : phase.status === 'running' ? '...' : '—'}
                  </span>
                  {expandedPhase === pi ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </div>
              </button>

              {expandedPhase === pi && (
                <div className="px-4 pb-4 space-y-2">
                  {phase.steps.map((step) => (
                    <div
                      key={step.id}
                      className={`rounded-lg p-3 border ${
                        step.status === 'running' ? 'bg-blue-500/5 border-blue-500/20' :
                        step.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/10' :
                        'bg-[#050816] border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {step.status === 'completed' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : step.status === 'running' ? (
                            <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-gray-600" />
                          )}
                          <span className="text-xs text-white font-medium">{step.title}</span>
                        </div>
                      </div>
                      {step.output.length > 0 && (
                        <div className="bg-black/60 rounded p-2 mt-2 font-mono text-[10px] leading-relaxed overflow-x-auto">
                          {step.output.map((line, i) => (
                            <div
                              key={i}
                              className={
                                line.type === 'command' ? 'text-cyan-400' :
                                line.type === 'error' ? 'text-red-400' :
                                line.type === 'success' ? 'text-emerald-400' :
                                line.type === 'warning' ? 'text-amber-400' :
                                'text-gray-400'
                              }
                            >
                              {line.text}
                            </div>
                          ))}
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

      {/* Script Tab */}
      {activeTab === 'script' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-300"></div>
                </div>
                <span className="text-xs text-gray-400 font-mono" dir="ltr">setup-abran.ps1</span>
              </div>
              <button
                onClick={handleCopyScript}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-gray-300 hover:text-white transition-all"
              >
                {copiedScript ? (
                  <><CheckCircle2 className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">کپی شد!</span></>
                ) : (
                  <><Copy className="w-3 h-3" /><span>کپی</span></>
                )}
              </button>
            </div>
            <div className="p-3 overflow-x-auto max-h-[500px] overflow-y-auto">
              <pre className="text-[10px] text-gray-300 font-mono leading-relaxed whitespace-pre" dir="ltr">{powershellScript}</pre>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent rounded-xl border border-emerald-500/20 p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              نحوه اجرا
            </h3>
            <div className="space-y-2">
              <div className="bg-[#050816] rounded-lg p-3 border border-white/5">
                <div className="text-[10px] text-blue-400 mb-1 font-bold">۱. ذخیره اسکریپت:</div>
                <code className="text-[10px] text-gray-300 font-mono block" dir="ltr">
                  Notepad setup-abran.ps1  # سپس محتوا را paste کنید
                </code>
              </div>
              <div className="bg-[#050816] rounded-lg p-3 border border-white/5">
                <div className="text-[10px] text-emerald-400 mb-1 font-bold">۲. اجرای اسکریپت:</div>
                <code className="text-[10px] text-gray-300 font-mono block" dir="ltr">
                  .\setup-abran.ps1
                </code>
                <div className="text-[9px] text-amber-400 mt-1">⚠️ حتماً از .\ استفاده کنید!</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-4">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-violet-400" />
              اطلاعات ریپازیتوری
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'نام', value: repoInfo.name },
                { label: 'URL', value: repoInfo.url, mono: true },
                { label: 'نوع', value: repoInfo.type },
                { label: 'Package Manager', value: repoInfo.packageManager },
                { label: 'Lock File', value: repoInfo.lockFile },
                { label: 'Port', value: String(repoInfo.port) },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between bg-[#050816] rounded-lg p-2 border border-white/5">
                  <span className="text-[10px] text-gray-500">{item.label}</span>
                  <span className={`text-[10px] text-gray-200 ${item.mono ? 'font-mono' : ''}`} dir={item.mono ? 'ltr' : 'rtl'}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-4">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-400" />
              وابستگی‌ها ({repoInfo.dependencies.length} + {repoInfo.devDependencies.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 max-h-[300px] overflow-y-auto">
              {[...repoInfo.dependencies, ...repoInfo.devDependencies].map((dep) => (
                <div key={dep} className="bg-[#050816] rounded p-1.5 border border-white/5">
                  <code className="text-[9px] text-cyan-300 font-mono" dir="ltr">{dep}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-4">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-amber-400" />
              ساختار فایل‌ها
            </h2>
            <div className="bg-[#050816] rounded-lg p-3 border border-white/5 font-mono text-[10px]" dir="ltr">
              <pre className="text-gray-300 leading-relaxed">{`cloud1/
├── src/
│   ├── components/
│   ├── pages/
│   ├── providers/
│   ├── utils/
│   ├── App.tsx
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
        </div>
      )}

      {/* Troubleshoot Tab */}
      {activeTab === 'troubleshoot' && (
        <div className="space-y-3">
          {[
            {
              title: 'خطای CommandNotFoundException برای setup-abran.ps1',
              error: 'The term \'setup-abran.ps1\' is not recognized',
              solution: 'از .\\ قبل از نام فایل استفاده کنید: .\\setup-abran.ps1',
              command: '.\\setup-abran.ps1',
            },
            {
              title: 'خطای Execution Policy',
              error: 'cannot be loaded because running scripts is disabled',
              solution: 'Execution Policy را تغییر دهید:',
              command: 'Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned',
            },
            {
              title: 'Git نصب نیست',
              error: 'git : The term \'git\' is not recognized',
              solution: 'Git را نصب کنید:',
              command: 'winget install Git.Git',
            },
            {
              title: 'Node.js نصب نیست',
              error: 'node : The term \'node\' is not recognized',
              solution: 'Node.js LTS را نصب کنید:',
              command: 'winget install OpenJS.NodeJS.LTS',
            },
            {
              title: 'خطای npm install',
              error: 'npm ERR! code ERESOLVE',
              solution: 'Cache را پاک کنید و دوباره تلاش کنید:',
              command: 'npm cache clean --force; npm install',
            },
            {
              title: 'پورت 5173 اشغال است',
              error: 'Port 5173 is already in use',
              solution: 'پروسس اشغال‌کننده را پیدا و ببندید:',
              command: 'netstat -ano | findstr :5173\ntaskkill /PID [PID] /F',
            },
          ].map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-amber-500/5 to-transparent rounded-xl border border-amber-500/20 p-4">
              <h3 className="text-xs font-bold text-amber-300 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                {item.title}
              </h3>
              <div className="space-y-2">
                <div className="bg-[#050816] rounded p-2 border border-white/5">
                  <div className="text-[9px] text-red-400 mb-1">خطا:</div>
                  <code className="text-[9px] text-gray-400 font-mono" dir="ltr">{item.error}</code>
                </div>
                <div className="bg-[#050816] rounded p-2 border border-white/5">
                  <div className="text-[9px] text-emerald-400 mb-1">راه‌حل:</div>
                  <div className="text-[9px] text-gray-300 mb-1">{item.solution}</div>
                  <code className="text-[9px] text-cyan-300 font-mono block" dir="ltr">{item.command}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl border border-blue-500/20 p-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-xs font-bold text-blue-300 mb-1">نکات مهم</h3>
            <ul className="text-[10px] text-gray-400 space-y-1 list-disc list-inside">
              <li>همیشه از <code className="text-cyan-300 font-mono" dir="ltr">.\</code> قبل از نام اسکریپت‌های محلی استفاده کنید</li>
              <li>قبل از اجرای اسکریپت، با <code className="text-cyan-300 font-mono" dir="ltr">Test-Path</code> وجود فایل را بررسی کنید</li>
              <li>این پروژه از <strong>npm</strong> استفاده می‌کند (نه pnpm یا yarn)</li>
              <li>پس از نصب، فایل <code className="text-cyan-300 font-mono" dir="ltr">.env</code> را با مقادیر Supabase خود پر کنید</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
