#!/bin/bash

# Post Buddy Setup Script
# This script sets up both backend and frontend for development

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 Post Buddy - Setup Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Setup Backend
echo "📦 Setting up backend..."
cd backend

if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found!"
    exit 1
fi

echo "  Installing backend dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "  Creating .env file from .env.example..."
    cp .env.example .env
    echo "  ⚠️  Please edit backend/.env and add your GEMINI_API_KEY"
    echo "     Get your free API key at: https://makersuite.google.com/app/apikey"
fi

echo "✓ Backend setup complete"
echo ""

# Setup Frontend
echo "📦 Setting up frontend..."
cd ../frontend

if [ ! -f "package.json" ]; then
    echo "❌ Frontend package.json not found!"
    exit 1
fi

echo "  Installing frontend dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "  Creating .env file from .env.example..."
    cp .env.example .env
fi

echo "✓ Frontend setup complete"
echo ""

# Final instructions
cd ..

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo ""
echo "1. Add your Gemini API key to backend/.env:"
echo "   GEMINI_API_KEY=your_api_key_here"
echo ""
echo "2. Start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Need help? Check README.md for full documentation"
echo ""
