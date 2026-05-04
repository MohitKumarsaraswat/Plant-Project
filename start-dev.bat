@echo off
REM CropCare Frontend + Backend Startup Script for Windows
REM This script starts both the Flask backend and React frontend

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   CropCare - Full Stack Startup
echo ========================================
echo.

REM Check if .venv exists
if not exist ".venv" (
    echo [WARNING] Virtual environment not found at .venv
    echo Creating virtual environment...
    python -m venv .venv
)

REM Activate virtual environment
echo [1/4] Activating Python virtual environment...
call .venv\Scripts\Activate.ps1
if errorlevel 1 (
    REM Try batch version if PowerShell fails
    call .venv\Scripts\Activate.bat
)

REM Install dependencies
echo [2/4] Installing/updating Python dependencies...
pip install -r requirements.txt > nul 2>&1

REM Install Node dependencies if needed
if not exist "node_modules" (
    echo [3/4] Installing Node dependencies...
    call npm install
) else (
    echo [3/4] Node dependencies already installed (skipping)
)

echo.
echo ========================================
echo   Starting Services
echo ========================================
echo.
echo Backend  URL: http://localhost:5000
echo Frontend URL: http://localhost:5173
echo.
echo Press Ctrl+C to stop all services
echo.

REM Start backend in new window
start cmd /k "cd /d %cd% && .venv\Scripts\Activate.bat && python app.py"

REM Wait a moment for backend to start
timeout /t 2 /nobreak

REM Start frontend
npm run dev
