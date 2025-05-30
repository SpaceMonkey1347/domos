#!/bin/bash

SCRIPT_PATH="$(realpath "$0")"
SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"
VENV_DIR="$SCRIPT_DIR/venv"

CHROME_GLOBAL_PATH="/etc/opt/chrome/native-messaging-hosts/com.example.uinput.json"
CHROME_LOCAL_PATH="$HOME/.config/google-chrome/NativeMessagingHosts/com.example.uinput.json"

FIREFOX_GLOBAL_PATH="/usr/lib/mozilla/native-messaging-hosts/uinput.json"
FIREFOX_LOCAL_PATH="$HOME/mozilla/native-messaging-hosts/uinput.json"

echo "Checking for: $CHROME_GLOBAL_PATH"
if [[ -f "$CHROME_GLOBAL_PATH" ]]; then
    echo "Deleting file..."
    sudo rm $CHROME_GLOBAL_PATH
else
    echo "File does not exist"
fi

echo "Checking for: $CHROME_LOCAL_PATH"
if [[ -f "$CHROME_LOCAL_PATH" ]]; then
    echo "Deleting file..."
    rm $CHROME_LOCAL_PATH
else
    echo "File does not exist"
fi

echo "Checking for: $FIREFOX_GLOBAL_PATH"
if [[ -f "$FIREFOX_GLOBAL_PATH" ]]; then
    echo "Deleting file..."
    sudo rm $FIREFOX_GLOBAL_PATH
else
    echo "File does not exist"
fi

echo "Checking for: $FIREFOX_LOCAL_PATH"
if [[ -f "$FIREFOX_LOCAL_PATH" ]]; then
    echo "Deleting file..."
    rm $FIREFOX_LOCAL_PATH
else
    echo "File does not exist"
fi
