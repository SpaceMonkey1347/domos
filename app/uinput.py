#!/usr/bin/env python3

import sys
import json
import struct
from time import sleep

import pyperclip
from pynput.keyboard import Key, Controller

keyboard = Controller()


def tapKey(keyName):
    if hasattr(Key, keyName):
        keyName = getattr(Key, keyName)
    keyboard.press(keyName)
    keyboard.release(keyName)


def tapBackspace(count):
    for i in range(count):
        keyboard.press(Key.backspace)
        keyboard.release(Key.backspace)


def typeText(text: str):
    printable_keys = set(
        "abcdefghijklmnopqrstuvwxyz"
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "0123456789"
        "`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/? "
    )
    for char in text:
        if char in printable_keys:
            keyboard.press(char)
            keyboard.release(char)
        else:
            hexcode = f'{ord(char):X}'
            # sendEncodedMessage(hexcode)
            typeUnicodeLinux(hexcode)



def typeUnicode(text):
    # Copy text to clipboard
    pyperclip.copy(text)
    sleep(0.1)  # Wait for clipboard to update

    # Paste the text
    with keyboard.pressed(Key.ctrl):
        keyboard.press('v')
        keyboard.release('v')

    sleep(0.1)


def typeUnicodeLinux(hexcode: str):
    """
    Types a unicode character using Ctrl+Shift+u + hex code + Enter (Linux)
    """
    with keyboard.pressed(Key.ctrl):
        with keyboard.pressed(Key.shift):
            with keyboard.pressed('u'):
                sleep(0.1)
                for char in hexcode:
                    keyboard.press(char)
                    keyboard.release(char)
                    sleep(0.05)


# # Example: U+2764 (❤️ heart)
# type_unicode_linux("2764")


def type_alt_numpad(code: str):
    """
    Windows Alt+Numpad entry for extended ASCII characters (like Alt+0169 for ©)
    Must be entered using the numeric keypad.
    """
    keyboard.press(Key.alt_l)
    for digit in code:
        keyboard.press(digit)
        keyboard.release(digit)
        sleep(0.05)
    keyboard.release(Key.alt_l)


# # Example: Alt+0169 = ©
# type_alt_numpad('0169')


# Read a message from stdin and decode it.
def getMessage():
    rawLength = sys.stdin.buffer.read(4)
    if len(rawLength) == 0:
        sys.exit(0)
    messageLength = struct.unpack('@I', rawLength)[0]
    message = sys.stdin.buffer.read(messageLength).decode('utf-8')
    return json.loads(message)


# Encode a message for transmission, given its content.
def encodeMessage(messageContent):
    # https://docs.python.org/3/library/json.html#basic-usage
    # To get the most compact JSON representation, you should specify
    # (',', ':') to eliminate whitespace.
    # We want the most compact representation because the browser rejects
    # messages that exceed 1 MB.
    encodedContent = json.dumps(messageContent, separators=(',', ':')).encode('utf-8')
    encodedLength = struct.pack('@I', len(encodedContent))
    return {'length': encodedLength, 'content': encodedContent}


# Send an encoded message to stdout
def sendMessage(encodedMessage):
    sys.stdout.buffer.write(encodedMessage['length'])
    sys.stdout.buffer.write(encodedMessage['content'])
    sys.stdout.buffer.flush()


def sendEncodedMessage(messageContent):
    return sendMessage(encodeMessage(messageContent))


def listenForMessages():
    while True:
        receivedMessage = getMessage()
        if receivedMessage.startswith('key.'):
            key = receivedMessage[4:]
            sendEncodedMessage('Pressing: ' + key)
            tapKey(key)
        elif receivedMessage.startswith('backspace.'):
            count = receivedMessage[10:]
            sendEncodedMessage('Tapping backspace * ' + count)
            tapBackspace(int(count))
        elif receivedMessage.startswith('text.'):
            text = receivedMessage[5:]
            sendEncodedMessage('Typing: ' + text)
            typeText(text)
        elif receivedMessage.startswith('unicode.'):
            char = receivedMessage[8:]
            sendEncodedMessage('Unicode: ' + char)
            typeUnicodeLinux(char)
        else:
            sendEncodedMessage('Invalid message to app: ' + receivedMessage)


listenForMessages()
