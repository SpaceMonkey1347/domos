/*
On startup, connect to the "uinput" app.
*/
let port = chrome.runtime.connectNative("com.example.uinput");

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

chrome.runtime.onMessage.addListener((message) => {
    if (message.command === "key") {
        const key = message.key;
        port.postMessage('key.' + key);
    }
    if (message.command === 'backspace') {
        const count = message.count;
        port.postMessage('backspace.' + count);
    }
    if (message.command === "text") {
        let text = message.text;
        port.postMessage('text.' + text);
    }
});
