#!/bin/bash
# CropCare Frontend + Backend Startup Script for macOS/Linux
# This script starts both the Flask backend and React frontend

echo ""
echo "========================================"
echo "  CropCare - Full Stack Startup"
echo "========================================"
echo ""

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "[WARNING] Virtual environment not found at .venv"
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "[1/4] Activating Python virtual environment..."
source .venv/bin/activate

# Install dependencies
echo "[2/4] Installing/updating Python dependencies..."
pip install -r requirements.txt > /dev/null 2>&1

# Install Node dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "[3/4] Installing Node dependencies..."
    npm install
else
    echo "[3/4] Node dependencies already installed (skipping)"
fi

echo ""
echo "========================================"
echo "  Starting Services"
echo "========================================"
echo ""
echo "Backend  URL: http://localhost:5000"
echo "Frontend URL: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start backend in background
python app.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start frontend
npm run dev

# Cleanup: Kill backend when frontend stops
kill $BACKEND_PID 2>/dev/null
