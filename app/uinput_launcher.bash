#!/bin/bash
SCRIPT_PATH="$(realpath "$0")"
SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"
VENV_DIR="$SCRIPT_DIR/venv"

"$VENV_DIR/bin/python3" "$SCRIPT_DIR/uinput.py"
