#!/bin/bash

VENV_DIR="./venv"

# Step 1: Create the virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR/bin" ]; then
    echo "Creating virtual environment..."
    python3 -m venv "$VENV_DIR"
else
    echo "Virtual environment already exists"
fi

# Step 2: Activate the virtual environment (must come before pip install)
echo "Activating virtual environment..."
source "$VENV_DIR/bin/activate"

# Step 3: Install requirements
if [ -f "requirements.txt" ]; then
    echo "Installing packages from requirements.txt..."
    pip install -r requirements.txt
else
    echo "requirements.txt not found. Skipping package installation."
fi

python uinput.py
