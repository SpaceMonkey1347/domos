#!/bin/bash

SCRIPT_PATH="$(realpath "$0")"
SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"
VENV_DIR="$SCRIPT_DIR/venv"

CHROME_GLOBAL_DIR="/etc/opt/chrome/native-messaging-hosts"
CHROME_LOCAL_DIR="$HOME/.config/google-chrome/NativeMessagingHosts"

FIREFOX_GLOBAL_DIR="/usr/lib/mozilla/native-messaging-hosts"
FIREFOX_LOCAL_DIR="$HOME/mozilla/native-messaging-hosts"

CHROME_GLOBAL_PATH="$CHROME_GLOBAL_DIR/com.example.uinput.json"
CHROME_LOCAL_PATH="$CHROME_LOCAL_DIR/com.example.uinput.json"

FIREFOX_GLOBAL_PATH="$FIREFOX_GLOBAL_DIR/uinput.json"
FIREFOX_LOCAL_PATH="$FIREFOX_LOCAL_DIR/uinput.json"

echo "Checking for: $CHROME_GLOBAL_PATH"
if [[ -f "$CHROME_GLOBAL_PATH" ]]; then
    echo "Deleting file..."
    sudo rm $CHROME_GLOBAL_PATH
    sudo rmdir -p $CHROME_GLOBAL_DIR --ignore-fail-on-non-empty
else
    echo "File does not exist"
fi

echo "Checking for: $CHROME_LOCAL_PATH"
if [[ -f "$CHROME_LOCAL_PATH" ]]; then
    echo "Deleting file..."
    rm $CHROME_LOCAL_PATH
    rmdir -p $CHROME_LOCAL_DIR --ignore-fail-on-non-empty
else
    echo "File does not exist"
fi

echo "Checking for: $FIREFOX_GLOBAL_PATH"
if [[ -f "$FIREFOX_GLOBAL_PATH" ]]; then
    echo "Deleting file..."
    sudo rm $FIREFOX_GLOBAL_PATH
    sudo rmdir -p $FIREFOX_GLOBAL_DIR --ignore-fail-on-non-empty
else
    echo "File does not exist"
fi

echo "Checking for: $FIREFOX_LOCAL_PATH"
if [[ -f "$FIREFOX_LOCAL_PATH" ]]; then
    echo "Deleting file..."
    rm $FIREFOX_LOCAL_PATH
    rmdir -p $FIREFOX_LOCAL_DIR --ignore-fail-on-non-empty
else
    echo "File does not exist"
fi

rm -rf $SCRIPT_DIR/venv
