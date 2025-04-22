#!/bin/bash

# HandsFree OS Installation Script
# This script sets up the Python environment and dependencies

echo "Installing HandsFree OS..."

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
if [[ "$PYTHON_VERSION" < "3.7" ]]; then
    echo "Error: Python 3.7 or higher is required"
    exit 1
fi

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Install system dependencies (for Linux)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Installing system dependencies..."
    sudo apt-get update
    sudo apt-get install -y python3-dev python3-pip portaudio19-dev
fi

# Create default config if it doesn't exist
if [ ! -f "config.json" ]; then
    echo "Creating default configuration..."
    cp config.example.json config.json
fi

# Set up logs directory
mkdir -p logs

echo "Installation complete!"
echo "To start HandsFree OS:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Run: python -m gesture_detection.main"