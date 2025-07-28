#!/bin/bash

# Idea Garden API Setup Script
# This script sets up the Python 3.12 virtual environment for the API backend

set -e  # Exit on any error

echo "🚀 Setting up Idea Garden API Backend..."

# Check if Python 3.12 is available
if ! command -v python3.12 &> /dev/null; then
    echo "❌ Python 3.12 is not installed. Please install it first:"
    echo "   macOS: brew install python@3.12"
    echo "   Ubuntu/Debian: sudo apt install python3.12 python3.12-venv"
    echo "   Or download from: https://www.python.org/downloads/"
    exit 1
fi

echo "📦 Creating Python 3.12 virtual environment..."
python3.12 -m venv venv_py312

echo "🔧 Activating virtual environment..."
source venv_py312/bin/activate

echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ API setup complete!"
echo ""
echo "To start the API server:"
echo "  cd api"
echo "  source venv_py312/bin/activate"
echo "  python main.py"
echo ""
echo "The server will run on http://localhost:4000" 