#!/bin/bash

SCRIPT_PATH="$(realpath "$0")"
SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"
VENV_DIR="$SCRIPT_DIR/venv"

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
if [ -f "$SCRIPT_DIR/requirements.txt" ]; then
    echo "Installing packages from requirements.txt..."
    pip install -r $SCRIPT_DIR/requirements.txt
else
    echo "requirements.txt not found. Skipping package installation."
fi

chmod +x $SCRIPT_DIR/uinput.py
chmod +x $SCRIPT_DIR/uinput_launcher.bash

echo "Updating native messaging manifests: $SCRIPT_DIR/uinput.json"


CHROME_GLOBAL_DIR="/etc/opt/chrome/native-messaging-hosts"
CHROME_LOCAL_DIR="$HOME/.config/google-chrome/NativeMessagingHosts"

FIREFOX_GLOBAL_DIR="/usr/lib/mozilla/native-messaging-hosts"
FIREFOX_LOCAL_DIR="$HOME/mozilla/native-messaging-hosts"

echo
echo "Which browser do you want to install this for?"
echo "1) Chrome"
echo "2) Firefox"
read -p "Enter the number (1 or 2): " browser_opt
echo

echo "Where do you want the native messaging manifest?"
echo "1) System-wide: /"
echo "2) User-specific: ~"
read -p "Enter the number (1 or 2): " scope_opt
echo

case "$browser_opt" in
    1)
        echo "Installing for Chrome..."
        # Update path value for chrome native messaging manifest
        jq --arg newpath "$SCRIPT_DIR/uinput.py" '.path = $newpath' $SCRIPT_DIR/com.example.uinput.json > $SCRIPT_DIR/uinput_tmp.json && mv $SCRIPT_DIR/uinput_tmp.json $SCRIPT_DIR/com.example.uinput.json

        case "$scope_opt" in
            1)
                echo "Installing syste-wide: $CHROME_GLOBAL_DIR/com.example.uinput.json"
                sudo mkdir -p $CHROME_GLOBAL_DIR && sudo cp $SCRIPT_DIR/com.example.uinput.json $CHROME_GLOBAL_DIR
                ;;
            2)
                echo "Installing user-specific: $CHROME_LOCAL_DIR/com.example.uinput.json"
                mkdir -p $CHROME_LOCAL_DIR && cp $SCRIPT_DIR/com.example.uinput.json $CHROME_LOCAL_DIR
                ;;
            *)
                echo "Invalid manifest directory choice. Exiting."
                exit 1
                ;;
        esac
        ;;
    2)
        echo "Installing for Firefox..."
        # Update path value for firefox native messaging manifest
        jq --arg newpath "$SCRIPT_DIR/uinput.py" '.path = $newpath' $SCRIPT_DIR/uinput.json > $SCRIPT_DIR/uinput_tmp.json && mv $SCRIPT_DIR/uinput_tmp.json $SCRIPT_DIR/uinput.json

        case "$scope_opt" in
            1)
                echo "Installing syste-wide: $FIREFOX_GLOBAL_DIR/uinput.json"
                sudo mkdir -p $FIREFOX_GLOBAL_DIR && sudo cp $SCRIPT_DIR/uinput.json $FIREFOX_GLOBAL_DIR
                ;;
            2)
                echo "Installing user-specific: $FIREFOX_LOCAL_DIR/uinput.json"
                mkdir -p $FIREFOX_LOCAL_DIR && cp $SCRIPT_DIR/uinput.json $FIREFOX_LOCAL_DIR
                ;;
            *)
                echo "Invalid manifest directory choice. Exiting."
                exit 1
                ;;
        esac
        ;;
    *)
        echo "Invalid browser choice. Exiting."
        exit 1
        ;;
esac
