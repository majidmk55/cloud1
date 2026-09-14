#!/bin/bash

# ═══════════════════════════════════════════════════════════
# ABRAN SYSTEM - Setup and Launch Script (Bash)
# For Linux and macOS
# ═══════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
write_step() {
    echo ""
    echo -e "${CYAN}[$1]${NC} $2"
}

write_ok() {
    echo -e "  ${GREEN}✅ $1${NC}"
}

write_err() {
    echo -e "  ${RED}❌ $1${NC}"
}

write_warn() {
    echo -e "  ${YELLOW}⚠️  $1${NC}"
}

# Header
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                          ║${NC}"
echo -e "${CYAN}║     🚀 ABRAN SYSTEM - Setup and Launch Script           ║${NC}"
echo -e "${CYAN}║                                                          ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check Node.js
write_step "1/5" "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VER=$(node --version)
    write_ok "Node.js $NODE_VER is installed"
else
    write_err "Node.js is not installed!"
    echo ""
    echo -e "  ${YELLOW}Please install Node.js from: https://nodejs.org/${NC}"
    echo -e "  ${YELLOW}Or run: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -${NC}"
    echo -e "  ${YELLOW}     sudo apt-get install -y nodejs${NC}"
    echo ""
    exit 1
fi

# Step 2: Check Git
write_step "2/5" "Checking Git..."
if command -v git &> /dev/null; then
    GIT_VER=$(git --version)
    write_ok "$GIT_VER is installed"
else
    write_err "Git is not installed!"
    echo ""
    echo -e "  ${YELLOW}Please install Git:${NC}"
    echo -e "  ${YELLOW}  Ubuntu/Debian: sudo apt-get install git${NC}"
    echo -e "  ${YELLOW}  macOS: brew install git${NC}"
    echo ""
    exit 1
fi

# Step 3: Clone repository
write_step "3/5" "Cloning repository..."
if [ -f "package.json" ]; then
    write_warn "Repository already exists. Skipping clone..."
else
    git clone https://github.com/majidmk55/cloud1 .
    write_ok "Repository cloned successfully"
fi

# Step 4: Install dependencies
write_step "4/5" "Installing dependencies..."
echo -e "  ${NC}⏳ This may take 1-3 minutes..."
echo ""

if npm install; then
    write_ok "Dependencies installed successfully"
else
    write_err "Failed to install dependencies!"
    echo ""
    echo -e "  ${YELLOW}Try running: npm cache clean --force${NC}"
    echo -e "  ${YELLOW}Then: npm install${NC}"
    echo ""
    exit 1
fi

# Step 5: Start dev server
write_step "5/5" "Starting development server..."
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║     ✅ ABRAN SYSTEM is ready!                           ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${CYAN}║     🌐 Open in browser: http://localhost:3000           ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${YELLOW}║     Press Ctrl+C to stop the server                     ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

npm run dev
