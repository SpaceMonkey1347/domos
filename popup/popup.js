// browser.storage.local.get("config").then(init)

function isEmpty(obj) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

function isDeepCopy(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function init(storedConfig) {
    console.log("initializing...")
    const configEl = document.querySelector(".config");
    const config = JSON.parse(configEl.innerHTML);
    if (isEmpty(storedConfig) 
        || !isDeepCopy({config: config}, storedConfig)) {
        updateLocalStorage(config);
    }
}

function updateLocalStorage(config) {
    console.log("updating local storage")
    browser.storage.local.set({ config });
}
