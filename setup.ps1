# ═══════════════════════════════════════════════════════════
# ABRAN SYSTEM - Setup and Launch Script (PowerShell)
# ═══════════════════════════════════════════════════════════

#Requires -Version 5.1

$ErrorActionPreference = "Stop"

# Helper functions
function Write-Step {
    param([string]$Step, [string]$Message)
    Write-Host ""
    Write-Host "[$Step] " -ForegroundColor Cyan -NoNewline
    Write-Host $Message -ForegroundColor White
}

function Write-OK {
    param([string]$Message)
    Write-Host "  ✅ $Message" -ForegroundColor Green
}

function Write-Err {
    param([string]$Message)
    Write-Host "  ❌ $Message" -ForegroundColor Red
}

function Write-Warn {
    param([string]$Message)
    Write-Host "  ⚠️  $Message" -ForegroundColor Yellow
}

# Header
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Cyan
Write-Host "║     🚀 ABRAN SYSTEM - Setup and Launch Script           ║" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js
Write-Step "1/5" "Checking Node.js..."
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-OK "Node.js $nodeVersion is installed"
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Err "Node.js is not installed!"
    Write-Host ""
    Write-Host "  Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "  Or run: winget install OpenJS.NodeJS.LTS" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Check Git
Write-Step "2/5" "Checking Git..."
try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-OK "$gitVersion is installed"
    } else {
        throw "Git not found"
    }
} catch {
    Write-Err "Git is not installed!"
    Write-Host ""
    Write-Host "  Please install Git from: https://git-scm.com/" -ForegroundColor Yellow
    Write-Host "  Or run: winget install Git.Git" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 3: Clone repository
Write-Step "3/5" "Cloning repository..."
if (Test-Path "package.json") {
    Write-Warn "Repository already exists. Skipping clone..."
} else {
    try {
        git clone https://github.com/majidmk55/cloud1 .
        Write-OK "Repository cloned successfully"
    } catch {
        Write-Err "Failed to clone repository!"
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Step 4: Install dependencies
Write-Step "4/5" "Installing dependencies..."
Write-Host "  ⏳ This may take 1-3 minutes..." -ForegroundColor Gray
Write-Host ""

try {
    npm install
    Write-OK "Dependencies installed successfully"
} catch {
    Write-Err "Failed to install dependencies!"
    Write-Host ""
    Write-Host "  Try running: npm cache clean --force" -ForegroundColor Yellow
    Write-Host "  Then: npm install" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 5: Start dev server
Write-Step "5/5" "Starting development server..."
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║     ✅ ABRAN SYSTEM is ready!                           ║" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║     🌐 Open in browser: http://localhost:3000           ║" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║     Press Ctrl+C to stop the server                     ║" -ForegroundColor Yellow
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

npm run dev
