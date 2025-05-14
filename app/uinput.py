import sys
import json
import struct

# from pynput.keyboard import Key, Controller
#
# keyboard = Controller()
#
#
# def pressKey(userKey):
#     key = getattr(Key, userKey)
#     keyboard.press(key)
#     keyboard.release(key)


# def pressKeys(userKeys):
#     pass


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


while True:
    receivedMessage = getMessage()
    print(receivedMessage)
    if receivedMessage == "ping":
        print("message recieved")
        sendMessage(encodeMessage("pong"))
    # elif receivedMessage.startswith("Key."):
    #     pressKey(receivedMessage[4:])
    #     sendMessage(encodeMessage("done pressing"))
    # elif receivedMessage.startswith("Keys."):
    #     pressKeys(receivedMessage[5:])




