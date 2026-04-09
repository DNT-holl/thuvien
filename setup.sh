#!/bin/bash

# Quick Start Script for Thư Viện Gia Đình

echo "╔════════════════════════════════════════════════════╗"
echo "║   📚 Thư Viện Gia Đình - Quick Start Script       ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js... "
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
NODEJS_VERSION=$(node -v)
echo -e "${GREEN}✅ Found $NODEJS_VERSION${NC}"

# Check Git
echo -n "Checking Git... "
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git not found${NC}"
    echo "Please install Git from https://git-scm.com/"
    exit 1
fi
GIT_VERSION=$(git --version)
echo -e "${GREEN}✅ $GIT_VERSION${NC}"

echo ""
echo -e "${YELLOW}🔧 Setting up Backend...${NC}"
cd backend
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  Created .env file. Please update it with your values!"
fi
npm install
echo -e "${GREEN}✅ Backend setup complete${NC}"

echo ""
echo -e "${YELLOW}🎨 Setting up Frontend...${NC}"
cd ../frontend
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env file"
fi
npm install
echo -e "${GREEN}✅ Frontend setup complete${NC}"

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Setup Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo ""
echo "To start developing:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
echo -e "${YELLOW}📝 Remember to:${NC}"
echo "  1. Update backend/.env with MongoDB credentials"
echo "  2. Check frontend/.env for API URL"
echo "  3. Read README.md for full setup guide"
echo ""
