/*
On startup, connect to the "uinput" app.
*/
let port = browser.runtime.connectNative("uinput");

/*
Listen for messages from the app and log them to the console.
*/
port.onMessage.addListener((response) => {
    console.log("Received:", response);
});

/*
Listen for the native messaging port closing.
*/
port.onDisconnect.addListener((port) => {
    if (port.error) {
        console.log(`Disconnected due to an error: ${port.error.message}`);
    } else {
        // The port closed for an unspecified reason. If this occurred right after
        // calling `browser.runtime.connectNative()` there may have been a problem
        // starting the the native messaging client in the first place.
        // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging#troubleshooting
        console.log(`Disconnected`, port);
    }
});

/*
send the app a message.
*/


function sendMessage(message) {
    port.postMessage(message);
}

function tapKey(key) {
    port.postMessage('tap.' + key);
}

function tapBackspace(count) {
    port.postMessage('backspace.' + count);
}

function typeContent(text) {
    port.postMessage('content.' + text);
}

function getUnicodeCodes(char) {
    const codePoint = char.codePointAt(0);

    // Linux uses hex (Ctrl+Shift+u + HEX)
    const linuxHex = codePoint.toString(16);

    // Windows uses decimal (Alt + DECIMAL), but only works for <= 255 or 0xFFFF in some cases
    const windowsDecimal = codePoint.toString(10);

    console.log(`Character: ${char}`);
    console.log(`Unicode Code Point: U+${codePoint.toString(16).toUpperCase()}`);
    console.log(`Linux Input (Ctrl+Shift+u): ${linuxHex}`);
    console.log(`Windows Input (Alt+Numpad): ${windowsDecimal}`);
}

// getUnicodeCodes("©");     // Alt+0169
// getUnicodeCodes("❤");     // Not supported in Windows Alt+Numpad
// getUnicodeCodes("€");     // Alt+0128
// getUnicodeCodes("あ");     // Not supported in Windows Alt+Numpad
// getUnicodeCodes("😀");    // Not supported in Windows Alt+Numpad


// setTimeout(() => {
//     // sendMessage('unicode.睷')
//     sendMessage('unicode.2764')
// }, 3000);


browser.runtime.onMessage.addListener((message) => {
    if (message.command === "pressKey") {
        tapKey(message.content)
    }
    if (message.command === 'backspace') {
        tapBackspace(message.count);
    }
    if (message.command === "typeContent") {
        let content = message.content
        typeContent(content);
    }
});
