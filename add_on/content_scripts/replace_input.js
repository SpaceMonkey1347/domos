(() => {
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    let replaceRules = [];

    let ruleCount = 0;

    let inputBuffer = '';

    init();

    function init() {
        browser.storage.local.get().then(initReplaceRules);

        browser.storage.local.onChanged.addListener(updateReplaceRules);

        document.addEventListener('input', processInput, true);
    }

    // function processInput(event) {
    //     const allowedInputTypes = [
    //         'insertText',
    //     ]
    //
    //     if (!allowedInputTypes.includes(event.inputType)) {
    //         return;
    //     }
    //
    //     let preCarotText;
    //     let replaceInputFn;
    //     const tagName = event.target.tagName;
    //     if (tagName === 'TEXTAREA' || tagName === 'INPUT') {
    //         preCarotText = getTextUntilCaretValue(event);
    //         replaceInputFn = replaceInputValue
    //     } else {
    //         preCarotText = getTextUntilCaretTextNode(event);
    //         replaceInputFn = replaceInputTextNode
    //     }
    //     for (let index = 0; index < ruleCount; index++) {
    //         const lhs = replaceRules[index].lhs
    //         const rhs = replaceRules[index].rhs
    //         if (preCarotText.endsWith(lhs)) {
    //             replaceInputFn(event, lhs, rhs);
    //             return;
    //         }
    //     }
    // }

    function processInput(event) {
        const allowedInputTypes = [
            'insertText',
        ]

        if (!allowedInputTypes.includes(event.inputType)) {
            inputBuffer = '';
            return;
        }
        inputBuffer += event.data;

        for (let index = 0; index < ruleCount; index++) {
            const lhs = replaceRules[index].lhs;
            const rhs = replaceRules[index].rhs;
            if (lhs !== '' && inputBuffer.endsWith(lhs)) {
                replaceInputUinput(lhs, rhs);
            }
        }
    }

    function replaceInputUinput(lhs, rhs) {
        const backspaceCount = lhs.length;
        browser.runtime.sendMessage({
            command: "backspace",
            count: backspaceCount,
        }).then(
            browser.runtime.sendMessage({
                command: "text",
                text: rhs,
            })
        ).then(() => { inputBuffer = '' })
    }

    function replaceInputValue(event, lhs, rhs) {
        const currCaret = event.target.selectionStart;
        const nextCaret = currCaret - lhs.length + rhs.length;
        const lhsStart = currCaret - lhs.length;
        const lhsEnd = currCaret;

        event.target.value = replaceSubstring(event.target.value, rhs, lhsStart, lhsEnd);
        event.target.selectionStart = nextCaret;
        event.target.selectionEnd = nextCaret;
    }

    function replaceInputTextNode(_, lhs, rhs) {
        const selection = window.getSelection();

        const currNode = selection.focusNode;
        const currCaret = selection.focusOffset;
        const nextCaret = currCaret - lhs.length + rhs.length;
        
        const lhsStart = currCaret - lhs.length;
        const lhsEnd = currCaret;

        currNode.nodeValue = replaceSubstring(currNode.nodeValue, rhs, lhsStart, lhsEnd);
        const range = document.createRange();
        range.setStart(currNode, nextCaret);
        range.setEnd(currNode, nextCaret);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function getTextUntilCaretValue(event) {
        const selectionStart = event.target.selectionStart;
        return event.target.value.substring(0, selectionStart);
    }

    function getTextUntilCaretTextNode(_) {
        const selection = window.getSelection();
        const focusOffset = selection.focusOffset;
        const currNode = selection.focusNode;

        return currNode.nodeValue.substring(0, focusOffset);
    }

    function replaceSubstring(original, replacement, startIndex, endIndex) {
        const res = original.substring(0, startIndex)
            + replacement + original.substring(endIndex);
        return res;
    }

    function initReplaceRules(storage) {
        if (storage.ruleCount) {
            ruleCount = storage.ruleCount;
        }
        replaceRules = [];
        for (let i = 1; i <= ruleCount; i++) {
            let currRule = `replaceRule${i}`; 
            if (storage[currRule]) {
                replaceRules.push(storage[currRule]);
            }
        }
        replaceRules.sort((a, b) => b.lhs.length - a.lhs.length);
    }

    function updateReplaceRules(changes) {
        if (changes.ruleCount) {
            ruleCount = changes.ruleCount.newValue;
        }
        replaceRules = [];
        for (let i = 1; i <= ruleCount; i++) {
            let currRule = `replaceRule${i}`;
            if (changes[currRule].newValue) {
                replaceRules.push(changes[currRule].newValue);
            } else {
                replaceRules.push(changes[currRule]);
            }
        }
        replaceRules.sort((a, b) => b.lhs.length - a.lhs.length);
    }

})();
